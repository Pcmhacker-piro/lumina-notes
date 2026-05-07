import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  RotateCcw, 
  Clock,
  User
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn, formatDate } from '../lib/utils';

interface Version {
  id: string;
  title: string;
  content: string;
  updatedAt: any;
  lastEditedBy: string;
}

interface VersionHistoryProps {
  documentId: string;
  onClose: () => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ documentId, onClose }) => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'documents', documentId, 'versions'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const v = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Version));
      setVersions(v);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [documentId]);

  const restoreVersion = async (version: Version) => {
    if (!confirm('Are you sure you want to restore this version? Current changes will be overwritten.')) return;
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        title: version.title,
        content: version.content,
        updatedAt: serverTimestamp()
      });
      onClose();
    } catch (error) {
      console.error('Error restoring version:', error);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-80 bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-zinc-500" />
          <h2 className="font-bold text-zinc-900 dark:text-zinc-100">Version History</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          </div>
        ) : versions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            No versions saved yet.
          </div>
        ) : (
          versions.map(v => (
            <div 
              key={v.id}
              className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Clock size={12} />
                  <span>{v.updatedAt?.toDate ? formatDate(v.updatedAt.toDate()) : 'Recent'}</span>
                </div>
                <button 
                  onClick={() => restoreVersion(v)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-indigo-600 transition-opacity"
                  title="Restore this version"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate mb-1">{v.title}</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <User size={10} />
                <span>Edited by {v.lastEditedBy.substring(0, 8)}...</span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 text-center">
          Versions are created when you manually save or significant changes occur.
        </p>
      </div>
    </div>
  );
};
