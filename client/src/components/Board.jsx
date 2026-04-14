import {
  DndContext, DragOverlay, PointerSensor,
  useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import Column from './Column';
import TaskCard from './TaskCard';

const COLUMNS = ['todo', 'inprogress', 'done'];

export default function Board({ tasks, getByColumn, onAdd, onDelete, onMove, onEdit, onAddToCol }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumn = (taskId) =>
    COLUMNS.find(col => getByColumn(col).some(t => t._id === taskId));

  function handleDragStart({ active }) {
    const col = findColumn(active.id);
    if (!col) return;
    setActiveTask(getByColumn(col).find(t => t._id === active.id));
  }

  function handleDragEnd({ active, over }) {
    setActiveTask(null);
    if (!over) return;

    const activeCol = findColumn(active.id);
    const overCol   = COLUMNS.includes(over.id) ? over.id : findColumn(over.id);
    if (!activeCol || !overCol) return;

    const activeItems = getByColumn(activeCol);
    const overItems   = getByColumn(overCol);
    const activeIndex = activeItems.findIndex(t => t._id === active.id);
    const overIndex   = overItems.findIndex(t => t._id === over.id);

    let updatedTasks = [...tasks];

    if (activeCol === overCol) {
      const reordered = arrayMove(activeItems, activeIndex, overIndex === -1 ? overItems.length - 1 : overIndex)
        .map((t, i) => ({ ...t, order: i }));
      updatedTasks = updatedTasks.map(t => reordered.find(r => r._id === t._id) || t);
    } else {
      const movedTask   = { ...activeItems[activeIndex], columnId: overCol };
      const newOver     = [...overItems];
      newOver.splice(overIndex === -1 ? newOver.length : overIndex, 0, movedTask);
      const reorderedOver   = newOver.map((t, i) => ({ ...t, order: i }));
      const reorderedActive = activeItems.filter(t => t._id !== active.id).map((t, i) => ({ ...t, order: i }));
      updatedTasks = updatedTasks.map(t => {
        return reorderedOver.find(r => r._id === t._id)
          || reorderedActive.find(r => r._id === t._id)
          || t;
      });
    }

    onMove(active.id, overCol, overIndex, updatedTasks);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-5 h-full">
        {COLUMNS.map(col => (
          <Column key={col} columnId={col} tasks={getByColumn(col)}
            onAdd={onAdd} onDelete={onDelete} onEdit={onEdit}
            onAddClick={() => onAddToCol && onAddToCol(col)} />
        ))}
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="drag-overlay w-[320px]">
            <TaskCard task={activeTask} onDelete={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
