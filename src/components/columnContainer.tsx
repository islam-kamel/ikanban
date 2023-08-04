import { Column, Id, Task } from "@/types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusCircle from "@icons/PlusCircle.tsx";
import TaskCard from "@components/TaskCard.tsx";
import X from "@icons/X.tsx";

interface Props {
  column: Column;
  onDelete: (id: Id) => void;
  onUpdate: (id: Id, value: string) => void;
  createTask: (columnId: Id) => void;
  onDeleteTask: (id: Id) => void;
  tasks: Task[];
  onTaskUpdate: (id: Id, value: string) => void;
}

function ColumnContainer({ column, onDelete, onUpdate, tasks, createTask, onDeleteTask, onTaskUpdate }: Props) {


  const [newValue, setNewValue] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    transform,
    listeners,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column
    },
    disabled: editMode
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        bg-primary
        w-[350px]
        h-[500px]
        backdrop-blur
        opacity-80
        max-h-[500px]
        rounded-md
        flex
        flex-col
        gap-4
        border
        border-muted
      "
      >
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        bg-primary
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        gap-4
        backdrop-blur
      "
    >
      <div
        {...attributes}
        {...listeners}

        className="
        bg-primary
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        border-b-2
        border-secondary
        p-3
        backdrop-blur
        flex
        items-center
        justify-between
        gap-2
        "
      >
        <div
          className="flex gap-2 items-center w-[100%]"
          onClick={() => setEditMode(true)}
        >
          <div
            className="
          flex
          justify-center
          items-center
          bg-muted
          px-2.5
          py-1
          text-sm
          backdrop-blur
          rounded-full
          "
          >
            {tasks.length}
          </div>
          {!editMode && (
            <span className="font-semibold">{column.title}</span>
          )}
          {editMode && (
            <input
              autoFocus
              defaultValue={column.title}
              onChange={(e) => setNewValue(e.target.value)}
              onBlur={(e) => {
                onUpdate(column.id, e.target.value);
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditMode(false);
                  if (newValue === null) return;
                  onUpdate(column.id, newValue);
                }
              }}
              className="
                outline-none
                bg-dark
                bg-opacity-30
                py-1
                px-2
                rounded
                w-[100%]
                backdrop-blur
              "
            />
          )}
        </div>
        <button
          className="
          stroke-muted
          hover:stroke-secondary
          transition
          duration-300
          "
          onClick={() => onDelete(column.id)}
        >
          <X />
        </button>
      </div>
      <div className="flex flex-col p-2 overflow-y-hidden gap-2 h-[100%]">
        <div className="h-[100%] overflow-y-auto flex flex-col gap-2">
          <SortableContext items={tasksId}>
            {tasks.map(task => (
              <TaskCard task={task} key={task.id} onDeleteTask={onDeleteTask} onTaskUpdate={onTaskUpdate} />
            ))}
          </SortableContext>
        </div>
        <button
          onClick={() => createTask(column.id)}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-dark
            bg-opacity-30
            py-1
            rounded
            backdrop-blur
            hover:text-secondary
            transition
            duration-300
          "
        >
          <PlusCircle />
          Add Task
        </button>

      </div>
    </div>
  );
}

export default ColumnContainer;
