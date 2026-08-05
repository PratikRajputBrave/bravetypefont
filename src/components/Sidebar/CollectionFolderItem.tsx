import React, { useState } from 'react';
import { Folder, MoreVertical, Edit2, Trash2, Copy, Check, X } from 'lucide-react';
import { Collection } from '../../types/store';

interface CollectionFolderItemProps {
  collection: Collection;
  isSelected: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDropFont: (fontId: string) => void;
}

export const CollectionFolderItem: React.FC<CollectionFolderItemProps> = ({
  collection,
  isSelected,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
  onDropFont,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(collection.name);
  const [showMenu, setShowMenu] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (nameInput.trim()) {
      onRename(nameInput.trim());
      setIsEditing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const fontId = e.dataTransfer.getData('text/plain');
    if (fontId) {
      onDropFont(fontId);
    }
  };

  return (
    <div
      onClick={onSelect}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
        isDragOver
          ? 'bg-accent-orangeLight border-2 border-dashed border-accent-orange text-accent-orange'
          : isSelected
          ? 'bg-paper-card text-accent-orange shadow-paper-sm border border-paper-border'
          : 'text-charcoal-muted hover:bg-paper-border/50 hover:text-charcoal-main'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <Folder
          size={16}
          className={`${
            isSelected ? 'text-accent-orange fill-accent-orange/10' : 'text-charcoal-subtle group-hover:text-charcoal-muted'
          }`}
        />
        {isEditing ? (
          <form onSubmit={handleSave} className="flex items-center gap-1 flex-1 min-w-0" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="w-full bg-white px-2 py-0.5 text-xs rounded border border-accent-orange focus:outline-none"
              autoFocus
            />
            <button type="submit" className="p-0.5 text-green-600 hover:text-green-700">
              <Check size={14} />
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="p-0.5 text-charcoal-subtle hover:text-charcoal-main">
              <X size={14} />
            </button>
          </form>
        ) : (
          <span className="truncate">{collection.name}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-accent-orangeLight text-accent-orange font-semibold' : 'bg-paper-border/60 text-charcoal-subtle'}`}>
          {collection.fontIds.length}
        </span>

        {!isEditing && (
          <div className="relative">
            <button
              onClick={e => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-charcoal-subtle hover:text-charcoal-main rounded-md hover:bg-paper-border/80 transition-opacity"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-6 z-20 w-36 bg-white rounded-xl shadow-paper-md border border-paper-border py-1 text-xs text-charcoal-main"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsEditing(true);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-paper-cream flex items-center gap-2"
                >
                  <Edit2 size={12} className="text-charcoal-muted" />
                  Rename
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDuplicate();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-paper-cream flex items-center gap-2"
                >
                  <Copy size={12} className="text-charcoal-muted" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
