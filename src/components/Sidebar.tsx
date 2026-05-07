import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { 
  FileText, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  MoreVertical,
  Search,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Document {
  id: string;
  title: string;
  parentId: string | null;
  icon?: string;
  isArchived: boolean;
  ownerId: string;
}

interface SidebarProps {
  activeDocId: string | null;
  onSelectDoc: (id: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeDocId, onSelectDoc, isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [archivedDocs, setArchivedDocs] = useState<Document[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'documents'),
      where('ownerId', '==', user.uid),
      where('isArchived', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Document));
      setDocuments(docs);
    });

    const qArchived = query(
      collection(db, 'documents'),
      where('ownerId', '==', user.uid),
      where('isArchived', '==', true),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribeArchived = onSnapshot(qArchived, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Document));
      setArchivedDocs(docs);
    });

    return () => {
      unsubscribe();
      unsubscribeArchived();
    };
  }, [user]);

  const restoreDocument = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, 'documents', id), {
        isArchived: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error restoring document:', error);
    }
  };

  const deletePermanently = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this document permanently?')) return;
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const createDocument = async (parentId: string | null = null) => {
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'documents'), {
        title: 'Untitled',
        ownerId: user.uid,
        parentId,
        isArchived: false,
        isPublished: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastEditedBy: user.uid,
        content: '',
      });
      onSelectDoc(docRef.id);
      if (parentId) {
        setExpanded(prev => ({ ...prev, [parentId]: true }));
      }
    } catch (error) {
      console.error('Error creating document:', error);
    }
  };

  const renderTree = (parentId: string | null = null, level = 0) => {
    const children = documents.filter(d => d.parentId === parentId);
    
    return children.map(doc => (
      <div key={doc.id} className="flex flex-col">
        <div 
          onClick={() => onSelectDoc(doc.id)}
          className={cn(
            "group flex items-center py-1 px-3 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors",
            activeDocId === doc.id && "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100",
            level > 0 && "ml-4"
          )}
        >
          <button 
            onClick={(e) => toggleExpand(doc.id, e)}
            className="p-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded"
          >
            {documents.some(d => d.parentId === doc.id) ? (
              expanded[doc.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <div className="w-[14px]" />
            )}
          </button>
          <span className="mr-2 text-lg">{doc.icon || '📄'}</span>
          <span className="flex-1 truncate text-sm font-medium">{doc.title}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); createDocument(doc.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded transition-opacity"
          >
            <Plus size={14} />
          </button>
        </div>
        {expanded[doc.id] && renderTree(doc.id, level + 1)}
      </div>
    ));
  };

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform lg:translate-x-0",
      isMobileOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Lumina</span>
        </div>
        <button onClick={onCloseMobile} className="lg:hidden p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Documents</span>
            <button 
              onClick={() => createDocument()}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-500"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-0.5">
            {renderTree()}
          </div>
        </div>

        <div>
          <button 
            onClick={() => setIsTrashOpen(!isTrashOpen)}
            className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Trash2 size={14} />
              <span>Trash</span>
            </div>
            {isTrashOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          
          <AnimatePresence>
            {isTrashOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-0.5"
              >
                {archivedDocs.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-zinc-400 italic">No items in trash</p>
                ) : (
                  archivedDocs.map(doc => (
                    <div 
                      key={doc.id}
                      className="group flex items-center py-1 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                    >
                      <span className="flex-1 truncate text-sm text-zinc-500">{doc.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => restoreDocument(doc.id, e)}
                          className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-500"
                          title="Restore"
                        >
                          <RotateCcw size={14} />
                        </button>
                        <button 
                          onClick={(e) => deletePermanently(doc.id, e)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                          title="Delete permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-4">
          <img src={user?.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-zinc-200" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{user?.displayName}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md transition-colors"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
