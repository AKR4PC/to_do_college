import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MessageSquare, Paperclip, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';

const PRIORITY = {
  high:   { color: '#ff7979', bg: 'rgba(255,121,121,0.12)', label: 'High' },
  medium: { color: '#ffa048', bg: 'rgba(255,160,72,0.12)',  label: 'Medium' },
  low:    { color: '#78d700', bg: 'rgba(120,215,0,0.12)',   label: 'Low' },
};

export default function TaskCard({ task, onDelete, onEdit }) {
  const [showMenu, setShowMenu] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const prio = PRIORITY[task.priority] || PRIORITY.medium;
  const pct  = Math.min(100, Math.max(0, task.progress ?? 0));

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="task-card rounded-xl p-4 select-none relative">

      {/* Priority badge + menu row */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{ background: prio.bg, color: prio.color }}>
          {prio.label}
        </span>
        <div className="relative">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setShowMenu(m => !m); }}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}>
            <MoreHorizontal size={11} />
          </button>
          {showMenu && (
            <div onPointerDown={e => e.stopPropagation()}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
              className="absolute right-0 top-8 rounded-xl shadow-xl z-50 overflow-hidden min-w-[120px]">
              {onEdit && (
                <button onClick={e => { e.stopPropagation(); setShowMenu(false); onEdit(task); }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-[13px] font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--text-primary)' }}>
                  <Pencil size={12} /> Edit
                </button>
              )}
              <button onClick={e => { e.stopPropagation(); setShowMenu(false); onDelete(task._id); }}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title + project */}
      <p className="font-bold text-[14px] leading-snug mb-0.5" style={{ color: 'var(--text-primary)' }}>
        {task.title}
      </p>
      {task.projectName && (
        <p className="text-[12px] font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
          {task.projectName}
        </p>
      )}

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Progress</span>
          <span className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>{pct}%</span>
        </div>
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: prio.color }} />
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        {task.dueDate ? (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: prio.bg, color: prio.color }}>
            {task.dueDate}
          </span>
        ) : <span />}
        <div className="flex items-center gap-2.5" style={{ color: 'var(--text-muted)' }}>
          {task.comments > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold">
              <MessageSquare size={11} /> {task.comments}
            </span>
          )}
          {task.attachments > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-semibold">
              <Paperclip size={11} /> {task.attachments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
