import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { ShareModal } from './components/ShareModal';
import { Menu, Search, Clock, Star, Share2, MoreHorizontal, Moon, Sun, Trash2, Archive, RotateCcw, FileText, X } from 'lucide-react';
import { doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';
import { cn } from './lib/utils';

const AppContent: React.FC = () => {
  const { user, loading, error, login, loginWithRedirect, clearError } = useAuth();
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    // Handle URL params for direct document access
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('doc');
    if (docId) {
      setActiveDocId(docId);
    }
  }, []);

  const archiveDocument = async () => {
    if (!activeDocId) return;
    try {
      await updateDoc(doc(db, 'documents', activeDocId), {
        isArchived: true,
        updatedAt: serverTimestamp()
      });
      setActiveDocId(null);
    } catch (error) {
      console.error('Error archiving document:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-8 shadow-xl shadow-indigo-500/20">L</div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Welcome to Lumina</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-center max-w-md">
          A powerful, Notion-inspired workspace for your documents, collaboration, and organization.
        </p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm max-w-md relative group">
            <p>{error}</p>
            <button 
              onClick={clearError}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button 
            onClick={login}
            className="w-full px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25"
          >
            Sign in with Google
          </button>
          <button 
            onClick={loginWithRedirect}
            className="w-full px-8 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
          >
            Sign in with Redirect
          </button>
        </div>
        
        <p className="mt-8 text-xs text-zinc-400 text-center max-w-xs">
          If popups are blocked in your browser, try the redirect method.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("h-screen flex overflow-hidden", isDarkMode && "dark")}>
      <Sidebar 
        activeDocId={activeDocId} 
        onSelectDoc={(id) => { setActiveDocId(id); setIsSidebarOpen(false); }} 
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950 lg:ml-64">
        <header className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="hover:underline cursor-pointer">Workspace</span>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[150px]">
                {activeDocId ? 'Document' : 'Select a page'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500">
              <Star size={18} />
            </button>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={archiveDocument}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500"
            >
              <Archive size={18} />
            </button>
            <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeDocId ? (
            <Editor documentId={activeDocId} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-300 dark:text-zinc-700 mb-6">
                <FileText size={40} />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Select a document</h2>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">
                Choose a document from the sidebar or create a new one to get started.
              </p>
            </div>
          )}
        </div>

        {isShareModalOpen && activeDocId && (
          <ShareModal 
            documentId={activeDocId} 
            onClose={() => setIsShareModalOpen(false)} 
          />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
