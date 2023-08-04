import { Id, Task } from "@/types.ts";
import Trash from "@icons/Trash.tsx";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
  onDeleteTask: (id: Id) => void;
  onTaskUpdate: (id: Id, value: string) => void;
}


function TaskCard({ task, onDeleteTask, onTaskUpdate }: Props) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<string | null>(null);

  const {
    setNodeRef,
    attributes,
    transform,
    listeners,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task
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
        bg-dark
        bg-opacity-30
        flex
        items-center
        justify-between
        px-2
        py-3
        rounded
        border
        border-dark
        border-opacity-0
        hover:border-secondary
        transition
        duration-1000
        cursor-grab
        h-[100px]
        min-h-[100px]
        task
        "
      />
    );
  }

  if (editMode) {
    return (
      <textarea
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        autoFocus
        defaultValue={task.content}
        onChange={(e) => setNewValue(e.target.value)}
        onBlur={() => {
          setEditMode(false);
          if (newValue === null) return;
          onTaskUpdate(task.id, newValue);
        }}
        className="
        outline-none
        bg-dark
        bg-opacity-30
        py-3
        px-2
        rounded
        w-[100%]
        h-[100px]
        backdrop-blur
        "
      />
    );
  }
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="
      bg-dark
      bg-opacity-30
      flex
      items-center
      justify-between
      px-2
      py-3
      rounded
      border
      border-dark
      border-opacity-0
      hover:border-secondary
      transition
      duration-1000
      cursor-grab
      h-[100px]
      min-h-[100px]
      task
      "
      onClick={() => setEditMode(true)}
    >
      <p
        className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words"
      >
        {task.content === "" && (
          <span className="text-muted">Task...</span>
        )}
        {task.content !== "" && task.content}
      </p>
      <button
        onClick={() => onDeleteTask(task.id)}
        className="
         stroke-muted
         hover:stroke-secondary
          transition
          duration-300
        "
      >
        <Trash />
      </button>
    </div>
  );
}

export default TaskCard;
