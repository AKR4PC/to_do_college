import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const PRIORITIES = [
  { value: 'low',    label: '🟢 Low',    color: '#78d700' },
  { value: 'medium', label: '🟠 Medium', color: '#ffa048' },
  { value: 'high',   label: '🔴 High',   color: '#ff7979' },
];

export default function AddTaskModal({ columnId, onClose, onAdd, editTask, projects = [] }) {
  const isEdit = !!editTask;

  const [form, setForm] = useState({
    title:       editTask?.title       ?? '',
    projectId:   editTask?.projectId   ?? '',
    projectName: editTask?.projectName ?? '',
    priority:    editTask?.priority    ?? 'medium',
    progress:    editTask?.progress    ?? 0,
    dueDate:     editTask?.dueDate     ?? '',
    dueDateISO:  editTask?.dueDateISO  ?? '',
    comments:    editTask?.comments    ?? 0,
    attachments: editTask?.attachments ?? 0,
  });

  const [dateVal, setDateVal] = useState('');
  const [timeVal, setTimeVal] = useState('09:00');
  const [useNewProject, setUseNewProject] = useState(false);
  const [newProject, setNewProject]       = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Rebuild dueDateISO whenever date or time changes
  useEffect(() => {
    if (!dateVal) { set('dueDate', ''); set('dueDateISO', ''); return; }
    const combined = new Date(`${dateVal}T${timeVal || '09:00'}:00`);
    set('dueDate', combined.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + combined.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    set('dueDateISO', combined.toISOString());
  }, [dateVal, timeVal]);

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const payload = { ...form, columnId };
    if (useNewProject && newProject.trim()) {
      payload.projectName = newProject.trim();
      payload.projectId   = null;
    } else if (form.projectId) {
      const proj = projects.find(p => p._id === form.projectId);
      payload.projectName = proj?.name || '';
    }
    await onAdd(payload);
    onClose();
  };

  const prioColor = PRIORITIES.find(p => p.value === form.priority)?.color || '#ffa048';
  const inputStyle = {
    background: 'var(--border)',
    color: 'var(--text-primary)',
    border: '1.5px solid transparent',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Task' : 'New Task'}
          </h3>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 transition-opacity">
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">

          {/* Title */}
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>TASK TITLE *</label>
            <input
              autoFocus
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Design landing page"
              style={inputStyle}
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors"
            />
          </div>

          {/* Project */}
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>PROJECT</label>
            {!useNewProject ? (
              <div className="flex gap-2">
                <select
                  value={form.projectId}
                  onChange={e => set('projectId', e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                  className="rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors"
                >
                  <option value="">No project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => setUseNewProject(true)}
                  className="px-3 py-2 rounded-xl text-[12px] font-bold flex items-center gap-1 hover:opacity-70 transition-opacity"
                  style={{ background: 'var(--border)', color: 'var(--text-primary)' }}
                >
                  <Plus size={12} /> New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={newProject}
                  onChange={e => setNewProject(e.target.value)}
                  placeholder="New project name"
                  style={{ ...inputStyle, flex: 1 }}
                  className="rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setUseNewProject(false)}
                  className="px-3 py-2 rounded-xl text-[12px] font-bold hover:opacity-70 transition-opacity"
                  style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="text-[11px] font-bold mb-2 block" style={{ color: 'var(--text-muted)' }}>PRIORITY</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => set('priority', p.value)}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-150"
                  style={{
                    background: form.priority === p.value ? p.color + '22' : 'var(--border)',
                    color: form.priority === p.value ? p.color : 'var(--text-muted)',
                    border: `1.5px solid ${form.priority === p.value ? p.color : 'transparent'}`,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress — improved slider */}
          <div>
            <label className="text-[11px] font-bold mb-3 flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
              PROGRESS
              <span className="font-extrabold text-[14px]" style={{ color: prioColor }}>{form.progress}%</span>
            </label>

            {/* Track + fill bar */}
            <div className="relative h-5 flex items-center mb-1">
              {/* Background track */}
              <div className="absolute w-full h-2 rounded-full" style={{ background: 'var(--border)' }} />
              {/* Filled portion */}
              <div
                className="absolute h-2 rounded-full transition-all duration-200"
                style={{ width: `${form.progress}%`, background: `linear-gradient(90deg, ${prioColor}99, ${prioColor})` }}
              />
              {/* Thumb dot */}
              <div
                className="absolute w-4 h-4 rounded-full shadow-md border-2 border-white transition-all duration-200"
                style={{
                  left: `calc(${form.progress}% - 8px)`,
                  background: prioColor,
                  boxShadow: `0 0 0 3px ${prioColor}33`,
                }}
              />
              {/* Invisible range input on top */}
              <input
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={e => set('progress', Number(e.target.value))}
                className="absolute w-full opacity-0 cursor-pointer h-5"
                style={{ zIndex: 2 }}
              />
            </div>

            {/* Step markers */}
            <div className="flex justify-between mt-1">
              {[0, 25, 50, 75, 100].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set('progress', v)}
                  className="text-[10px] font-bold transition-opacity hover:opacity-100"
                  style={{ color: form.progress === v ? prioColor : 'var(--text-muted)', opacity: form.progress === v ? 1 : 0.5 }}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>

          {/* Due date + time */}
          <div>
            <label className="text-[11px] font-bold mb-1.5 block" style={{ color: 'var(--text-muted)' }}>DUE DATE & TIME</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateVal}
                onChange={e => setDateVal(e.target.value)}
                style={{ ...inputStyle, flex: 2 }}
                className="rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors"
              />
              <input
                type="time"
                value={timeVal}
                onChange={e => setTimeVal(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
                className="rounded-xl px-3.5 py-2.5 text-[13px] font-medium outline-none focus:border-[#4f8ef7] transition-colors"
              />
            </div>
            {form.dueDate && (
              <p className="text-[11px] mt-1.5 font-semibold" style={{ color: prioColor }}>
                📅 {form.dueDate}
              </p>
            )}
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              🔔 Reminder sent 7 hours before due time
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ border: '1.5px solid var(--border)', color: 'var(--text-muted)' }}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold hover:opacity-70 transition-opacity mt-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: 'var(--text-primary)', color: 'var(--bg-card)' }}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-bold hover:opacity-80 transition-opacity mt-1"
            >
              {isEdit ? 'Save changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
