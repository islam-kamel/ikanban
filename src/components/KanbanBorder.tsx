import Plus from "../icons/Plus.tsx";
import { useEffect, useMemo, useState } from "react";
import { Column, Id, Task } from "@/types";
import { generateId } from "@utils/helpers";
import ColumnContainer from "@components/columnContainer.tsx";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { useKeySensor } from "@hooks/KanbanBorder.tsx";
import TaskCard from "@components/TaskCard.tsx";
import IslamLogo from "@components/IslamLogo.tsx";

function KanbanBorder() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columnsId = useMemo(() => columns.map(col => col.id), [columns]);

  const addColumn = () => {
    const column: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`
    };

    setColumns([...columns, column]);
  };

  const onDelete = (id: Id) => {
    setColumns(columns.filter(col => col.id !== id));
    setTasks(tasks.filter(task => task.columnId !== id));
  };

  const onUpdate = (id: Id, value: string) => {
    const index = columns.findIndex(col => col.id == id);
    columns[index] = { ...columns[index], title: value };
    setColumns([...columns]);
  };

  const addTask = (columnId: Id) => {
    const task: Task = {
      id: generateId(),
      content: "",
      columnId
    };
    setTasks([...tasks, task]);
  };

  const onTaskUpdate = (id: Id, value: string) => {
    const index = tasks.findIndex(task => task.id === id);
    tasks[index] = { ...tasks[index], content: value };
    setTasks([...tasks]);
  };

  const onDeleteTask = (id: Id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    setActiveColumn(null);
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeIndex = columns.findIndex(col => col.id === activeId);
    const overIndex = columns.findIndex(col => col.id === overId);

    setColumns(arrayMove(columns, activeIndex, overIndex));

  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex(task => task.id === activeId);
      const overIndex = tasks.findIndex(task => task.id === overId);

      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
      }
      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isOverAColumn && isActiveTask) {
      const activeIndex = tasks.findIndex(task => task.id === activeId);
      const overIndex = columns.findIndex(col => col.id === overId);

      tasks[activeIndex].columnId = columns[overIndex].id;
      setTasks([...tasks]);
    }

  };
  const sensors = useKeySensor();

  useEffect(() => {
    const baseColumn = ["To Do", "In Progress", "Done"];
    setColumns(baseColumn.map(col => ({ id: generateId(), title: col })) as Column[]);
  }, []);
  return (
    <div className="flex flex-col items-start justify-around kanban">
      <div className="py-4 px-12 flex justify-between w-full items-center">
        <IslamLogo />
        <button
          className="
          cursor-pointer
          rounded-lg
          bg-primary
          p-4
          border
          border-primary
          hover:border-buttonHoverBorderColor
          transition
          duration-300
          backdrop-blur
          flex
          items-center
          justify-center
          gap-2
          "
          onClick={addColumn}
        >
          <Plus /> Add Column
        </button>
      </div>
      <div
        className="
        m-auto
        flex
        items-center
        overflow-y-hidden
        overflow-x-auto
        px-[40px]
        w-[100%]
        h-full
        "
      >
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>

          <div className="m-auto flex gap-4">

            <div className="flex gap-4 flex-col md:flex-row">
              <SortableContext items={columnsId}>
                {columns.map(col => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    createTask={addTask}
                    tasks={tasks.filter(task => task.columnId === col.id)}
                    onDeleteTask={onDeleteTask}
                    onTaskUpdate={onTaskUpdate}
                  />
                ))}
              </SortableContext>
            </div>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  createTask={addTask}
                  tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                  onDeleteTask={onDeleteTask}
                  onTaskUpdate={onTaskUpdate}
                />
              )}
              {activeTask && <TaskCard task={activeTask} onDeleteTask={onDeleteTask} onTaskUpdate={onTaskUpdate} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
}

export default KanbanBorder;
