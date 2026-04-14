import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const COL_MAP = { 'To do': 'todo', 'In progress': 'inprogress', 'Done': 'done' };

function Section({ title, items, activeItem, onSelect }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full font-bold text-[14px] mb-2 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
        {open
          ? <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
          : <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />
        }
      </button>
      {open && (
        <div className="ml-3 border-l-2 pl-3 flex flex-col gap-0.5" style={{ borderColor: 'var(--border)' }}>
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item.key)}
              className="text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
              style={{
                background: activeItem === item.key ? 'var(--border)' : 'transparent',
                color: activeItem === item.key ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="ml-1.5 text-[11px] font-bold opacity-60">({item.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectsPanel({ activePage, taskCounts, projects = [], onFilterColumn }) {
  const [activeProject, setActiveProject] = useState('all');
  const [activeTask, setActiveTask]       = useState('all');

  const projectItems = [
    { key: 'all', label: 'All projects', count: projects.length },
    ...projects.map(p => ({ key: p._id, label: p.name })),
  ];

  const taskItems = [
    { key: 'all',        label: 'All tasks',   count: taskCounts.all        },
    { key: 'todo',       label: 'To do',       count: taskCounts.todo       },
    { key: 'inprogress', label: 'In progress', count: taskCounts.inprogress },
    { key: 'done',       label: 'Done',        count: taskCounts.done       },
  ];

  const handleTaskSelect = (key) => {
    setActiveTask(key);
    onFilterColumn(key === 'all' ? null : key);
  };

  return (
    <aside
      style={{ background: 'var(--bg-panel)', borderColor: 'var(--border)' }}
      className="w-[240px] h-screen border-r flex flex-col px-4 py-5 shrink-0 overflow-y-auto"
    >
      <h1 className="text-xl font-extrabold mb-6" style={{ color: 'var(--text-primary)' }}>
        Projects
      </h1>

      <nav className="flex flex-col gap-5 flex-1">
        <Section
          title="Projects"
          items={projectItems}
          activeItem={activeProject}
          onSelect={setActiveProject}
        />

        {/* Always show task filter — not just on board page */}
        <Section
          title="Tasks"
          items={taskItems}
          activeItem={activeTask}
          onSelect={handleTaskSelect}
        />
      </nav>
    </aside>
  );
}
