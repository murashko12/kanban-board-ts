import { useState } from "react";
import { Id, Task } from "../types"
import { ImBin } from "react-icons/im";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
    updateTask: (id: Id, content: string) => void;
}

const TaskCard = ( props : Props) => {
    const {task, deleteTask, updateTask} = props

    const [mouseIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    if (editMode) {
        return (
            <div className="bg-mainBackgroundColor relative cursor-grab p-2.5 h-24 min-h-24 rounded-xl items-center flex text-left hover:ring-2 hover:ring-inset hover:ring-rose-500">
                <textarea 
                    className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
                    value={task.content}
                    autoFocus
                    placeholder="Task content here"
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) toggleEditMode()
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                >

                </textarea>
            </div>
        )
    }

    return (
        <div 
            onClick={toggleEditMode}
            className="bg-mainBackgroundColor relative cursor-grab p-2.5 h-24 min-h-24 rounded-xl items-center flex text-left hover:ring-2 hover:ring-inset hover:ring-rose-500 task"
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
        >
            <p className="my-auto h-[90%] w-full overflow-y-hidden overflow-x-auto whitespace-pre-wrap">
                {task.content}
            </p>
            {mouseIsOver && (
                <button 
                    className="absolute stroke-white right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded-md opacity-60 hover:opacity-100"
                    onClick={() => deleteTask(task.id)}
                >
                    <ImBin />
                </button>
            )}
        </div>
    )
}

export default TaskCard
