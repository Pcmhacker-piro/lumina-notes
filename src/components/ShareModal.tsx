import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  Globe, 
  Lock, 
  Copy, 
  Check,
  ChevronDown
} from 'lucide-react';
import { doc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { useAuth } from './AuthProvider';

interface ShareModalProps {
  documentId: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ documentId, onClose }) => {
  const { user } = useAuth();
  const [isPublished, setIsPublished] = useState(false);
  const [collaborators, setCollaborators] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'documents', documentId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setIsPublished(data.isPublished || false);
        setCollaborators(data.collaborators || {});
      }
    });

    return () => unsubscribe();
  }, [documentId]);

  const togglePublish = async () => {
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        isPublished: !isPublished
      });
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}?doc=${documentId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Share Document</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                isPublished ? "bg-green-100 text-green-600" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              )}>
                {isPublished ? <Globe size={20} /> : <Lock size={20} />}
              </div>
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Publish to web</p>
                <p className="text-sm text-zinc-500">Anyone with the link can view</p>
              </div>
            </div>
            <button 
              onClick={togglePublish}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                isPublished 
                  ? "bg-red-50 text-red-600 hover:bg-red-100" 
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              )}
            >
              {isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Share Link</p>
            <div className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <input 
                type="text" 
                readOnly 
                value={`${window.location.origin}?doc=${documentId}`}
                className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-600 dark:text-zinc-400 truncate"
              />
              <button 
                onClick={copyLink}
                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Collaborators</p>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
              <UserPlus size={20} className="text-zinc-400" />
              <span className="text-sm text-zinc-500">Invite people via email (coming soon)</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
