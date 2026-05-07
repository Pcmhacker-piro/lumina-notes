import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { doc, updateDoc, serverTimestamp, onSnapshot, addDoc, collection, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthProvider';
import { VersionHistory } from './VersionHistory';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Heading1, 
  Heading2, 
  Link as LinkIcon,
  Undo,
  Redo,
  History,
  Save
} from 'lucide-react';
import { cn } from '../lib/utils';

interface EditorProps {
  documentId: string;
}

export const Editor: React.FC<EditorProps> = ({ documentId }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVersionSaving, setIsVersionSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      debouncedSave(html);
    },
  });

  useEffect(() => {
    if (!documentId) return;

    const unsubscribe = onSnapshot(doc(db, 'documents', documentId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTitle(data.title);
        
        // Only update editor if content is different and not currently focused
        // This is a simple way to handle real-time updates without cursor jumping
        if (editor && !editor.isFocused && data.content !== editor.getHTML()) {
          editor.commands.setContent(data.content || '');
        }
      }
    });

    return () => unsubscribe();
  }, [documentId, editor]);

  const debouncedSave = (content: string) => {
    setIsSaving(true);
    const timeout = setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'documents', documentId), {
          content,
          updatedAt: serverTimestamp(),
          lastEditedBy: user?.uid,
        });
      } catch (error) {
        console.error('Error saving content:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        title: newTitle,
        updatedAt: serverTimestamp(),
        lastEditedBy: user?.uid,
      });
    } catch (error) {
      console.error('Error saving title:', error);
    }
  };

  const saveVersion = async () => {
    if (!editor || isVersionSaving) return;
    setIsVersionSaving(true);
    try {
      await addDoc(collection(db, 'documents', documentId, 'versions'), {
        title,
        content: editor.getHTML(),
        updatedAt: serverTimestamp(),
        lastEditedBy: user?.uid,
      });
      alert('Version saved successfully!');
    } catch (error) {
      console.error('Error saving version:', error);
    } finally {
      setIsVersionSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 p-2 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800", editor.isActive('bold') && "bg-zinc-200 dark:bg-zinc-700")}
        >
          <Bold size={18} />
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800", editor.isActive('italic') && "bg-zinc-200 dark:bg-zinc-700")}
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-zinc-200 dark:border-zinc-800 mx-1" />
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800", editor.isActive('heading', { level: 1 }) && "bg-zinc-200 dark:bg-zinc-700")}
        >
          <Heading1 size={18} />
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800", editor.isActive('heading', { level: 2 }) && "bg-zinc-200 dark:bg-zinc-700")}
        >
          <Heading2 size={18} />
        </button>
        <div className="w-px h-6 bg-zinc-200 dark:border-zinc-800 mx-1" />
        <button 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800", editor.isActive('bulletList') && "bg-zinc-200 dark:bg-zinc-700")}
        >
          <List size={18} />
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800", editor.isActive('orderedList') && "bg-zinc-200 dark:bg-zinc-700")}
        >
          <ListOrdered size={18} />
        </button>
        <button 
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800", editor.isActive('taskList') && "bg-zinc-200 dark:bg-zinc-700")}
        >
          <CheckSquare size={18} />
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-1 mr-2">
          <button 
            onClick={saveVersion}
            disabled={isVersionSaving}
            className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-50"
            title="Save version"
          >
            <Save size={18} />
          </button>
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={cn("p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500", isHistoryOpen && "bg-zinc-200 dark:bg-zinc-700")}
            title="Version history"
          >
            <History size={18} />
          </button>
        </div>
        <div className="text-xs text-zinc-400 px-2 min-w-[60px]">
          {isSaving ? 'Saving...' : 'Saved'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-16 max-w-4xl mx-auto w-full">
        <input 
          type="text" 
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="w-full text-4xl lg:text-5xl font-bold bg-transparent border-none outline-none mb-8 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
        />
        <EditorContent editor={editor} className="prose prose-zinc dark:prose-invert max-w-none min-h-[500px]" />
      </div>

      {isHistoryOpen && (
        <VersionHistory 
          documentId={documentId} 
          onClose={() => setIsHistoryOpen(false)} 
        />
      )}
    </div>
  );
};
