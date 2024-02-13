import { useState } from "react";
import { Id, Task } from "../types"
import { ImBin } from "react-icons/im";

interface Props {
    task: Task;
    deleteTask: (id: Id) => void;
}

const TaskCard = ( props : Props) => {
    const {task, deleteTask} = props

    const [mouseIsOver, setMouseIsOver] = useState(false)

    return (
        <div 
            className="bg-mainBackgroundColor relative cursor-grab p-2.5 h-24 min-h-24 rounded-xl items-center flex text-left hover:ring-2 hover:ring-inset hover:ring-rose-500"
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
        >
            {task.content}
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
