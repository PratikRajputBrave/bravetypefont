import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-main/20 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-paper-card rounded-2xl shadow-paper-lg border border-paper-border p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent-orangeLight text-accent-orange">
              <FolderPlus size={18} />
            </div>
            <h3 className="font-semibold text-charcoal-main">Create New Collection</h3>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal-subtle hover:text-charcoal-main rounded-lg hover:bg-paper-cream">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-charcoal-muted mb-1.5">Collection Name</label>
            <input
              type="text"
              placeholder="e.g. Client A, Luxury, Logo Fonts..."
              value={folderName}
              onChange={e => setFolderName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-paper-cream border border-paper-border text-sm text-charcoal-main placeholder-charcoal-subtle focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-charcoal-muted hover:bg-paper-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-accent-orange text-white hover:bg-accent-orangeHover disabled:opacity-50 transition-colors shadow-paper-sm"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
