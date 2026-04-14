import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import Board from '../components/Board';
import AddTaskModal from '../components/AddTaskModal';
import AddProjectModal from '../components/AddProjectModal';
import { Plus, FolderPlus } from 'lucide-react';

export default function BoardPage({ searchQuery, filterColumn, taskState, projectState }) {
  const { tasks, loading, addTask, editTask, removeTask, moveTask } = taskState;
  const { projects, addProject } = projectState;

  const boardRef = useRef(null);
  const [editingTask, setEditingTask]           = useState(null);
  const [addingToCol, setAddingToCol]           = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // Apply column filter + search filter
  const filteredTasks = tasks.filter(t => {
    const matchCol    = filterColumn ? t.columnId === filterColumn : true;
    const matchSearch = searchQuery
      ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.projectName || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchCol && matchSearch;
  });

  const getFiltered = (colId) =>
    filteredTasks.filter(t => t.columnId === colId).sort((a, b) => a.order - b.order);

  // Lenis smooth horizontal scroll
  useEffect(() => {
    if (!boardRef.current) return;
    const lenis = new Lenis({
      wrapper: boardRef.current,
      content: boardRef.current.firstElementChild,
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'horizontal',
      smoothWheel: true,
      gestureOrientation: 'horizontal',
    });
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);

  const handleEdit = async (data) => {
    if (!editingTask) return;
    await editTask(editingTask._id, data);
    setEditingTask(null);
  };

  return (
    <>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-7 py-2.5 border-b shrink-0"
        style={{ background: 'var(--bg-toolbar)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center">
          <span
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold border-b-2"
            style={{ color: 'var(--text-primary)', borderColor: 'var(--text-primary)' }}
          >
            📋 Board view
          </span>
          {filterColumn && (
            <span className="ml-3 text-[12px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(79,142,247,0.12)', color: '#4f8ef7' }}>
              Filtered: {filterColumn === 'inprogress' ? 'In progress' : filterColumn.charAt(0).toUpperCase() + filterColumn.slice(1)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddingToCol('todo')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-opacity hover:opacity-70"
            style={{ background: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <Plus size={13} strokeWidth={2.5} /> New Task
          </button>
          <button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-bold transition-opacity hover:opacity-80"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-card)' }}
          >
            <FolderPlus size={13} strokeWidth={2.5} /> New Project
          </button>
        </div>
      </div>

      {/* Board */}
      <div ref={boardRef} className="flex-1 overflow-x-auto overflow-y-hidden px-7 py-5">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--text-muted)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <Board
            tasks={filteredTasks}
            getByColumn={getFiltered}
            onAdd={addTask}
            onDelete={removeTask}
            onMove={moveTask}
            onEdit={setEditingTask}
            onAddToCol={setAddingToCol}
          />
        )}
      </div>

      {/* Add / Edit task modal */}
      {(addingToCol || editingTask) && (
        <AddTaskModal
          columnId={addingToCol || editingTask?.columnId}
          editTask={editingTask}
          projects={projects}
          onClose={() => { setAddingToCol(null); setEditingTask(null); }}
          onAdd={editingTask ? handleEdit : addTask}
        />
      )}

      {/* Add project modal */}
      {showProjectModal && (
        <AddProjectModal
          onClose={() => setShowProjectModal(false)}
          onAdd={addProject}
        />
      )}
    </>
  );
}
