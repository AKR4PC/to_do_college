import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const META = {
  todo:       { label: 'To do',       dot: '#888da7', accent: 'rgba(136,141,167,0.15)' },
  inprogress: { label: 'In progress', dot: '#ffa048', accent: 'rgba(255,160,72,0.12)'  },
  done:       { label: 'Done',        dot: '#78d700', accent: 'rgba(120,215,0,0.12)'   },
};

export default function Column({ columnId, tasks, onDelete, onEdit, onAddClick }) {
  const meta = META[columnId] || { label: columnId, dot: '#888', accent: 'transparent' };
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div className="flex flex-col w-[320px] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: meta.dot }} />
          <span className="text-[13px] font-bold" style={{ color: 'var(--text-muted)' }}>{meta.label}</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: meta.accent, color: meta.dot }}>
            {tasks.length}
          </span>
        </div>
        <button onClick={onAddClick}
          className="flex items-center gap-1 text-[12px] font-bold transition-opacity hover:opacity-60"
          style={{ color: 'var(--text-primary)' }}>
          <Plus size={13} strokeWidth={2.5} /> Add
        </button>
      </div>

      {/* Drop zone */}
      <div ref={setNodeRef}
        className="flex-1 rounded-2xl border-2 border-dashed p-3 flex flex-col gap-2.5 min-h-[520px] transition-all duration-200"
        style={{
          borderColor: isOver ? 'rgba(79,142,247,0.4)' : 'var(--border)',
          background:  isOver ? 'rgba(79,142,247,0.03)' : 'transparent',
        }}>
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--border)' }}>
              <Plus size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-[12px] font-semibold" style={{ color: 'var(--text-muted)' }}>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
