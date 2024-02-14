import { useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../types";
import { ImBin } from "react-icons/im";
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";
import TaskCard from "./TaskCard";

interface IProps {
    column: Column;
    updateColumn: (id: Id, title: string) => void;
    deleteColumn: (id: Id) => void;
    
    tasks: Task[];
    createTask: (columnId: Id) => void;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const ColumnContainer = (props: IProps) => {

    const {column, updateColumn, deleteColumn, 
           tasks, createTask, deleteTask, updateTask} = props

    const [editMode, setEditMode] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
      } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return <div
            ref={setNodeRef} 
            style={style}
            className="bg-columnBackgroundColor border-2 border-rose-500 opacity-40 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        ></div>
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-xl flex flex-col shadow-xl"
        >
            <div 
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true)
                }}
                className="bg-mainBackgroundColor px-3 h-[60px] cursor-grab rounded-lg rounded-b-none border-columnBackgroundColor border-4 flex justify-between items-center min-h-[60px]"
            >
                <div className="flex justify-center items-center bg-columnBackgroundColor h-8 w-8 text-md rounded-full">0</div>
                {!editMode && column.title}
                {editMode 
                    && 
                    <input 
                        className="outline-none bg-columnBackgroundColor border-2 py-1.5 px-2 border-rose-500 rounded-md"
                        autoFocus 
                        value={column.title}
                        onChange={(e) => updateColumn(column.id, e.target.value)}
                        onBlur={() => setEditMode(false)}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return
                            setEditMode(false)
                        }}
                    />
                }
                <button 
                    onClick={() => deleteColumn(column.id)}
                    className="text-gray-500  px-1 py-2 rounded hover:text-white hover:bg-columnBackgroundColor"
                >
                    <ImBin size={20} />
                </button>    
            </div>

            {/* column task container */}
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                {
                    tasks.map((task) => (
                        <TaskCard 
                            key={task.id} 
                            task={task} 
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    ))
                }
            </div>
            {/* column footer */}
            <button 
                className="
                    flex gap-2 items-center p-4 border-4 border-columnBackgroundColor bg-mainBackgroundColor rounded-lg border-x-columnBackgroundColor
                    hover:bg-mainBackgroundColor hover:text-rose-500
                    active:bg-black
                "
                onClick={() => createTask(column.id)}
            >
                <RiAddCircleLine size={20} />
                Add task
            </button>
        </div>
    )
}

export default ColumnContainer
