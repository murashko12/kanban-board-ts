import { RiAddCircleLine } from "react-icons/ri";
import { Column, Id } from "../types";
import {useState} from 'react'
import ColumnContainer from "./ColumnContainer";

const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([])
    
// ========== FUNCTION IMPLEMENTATION ==========
    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd])
    }

    const deleteColumn = (id: Id) => {
        setColumns(columns.filter((col) => col.id !== id))
    }

    const generateId = () => {
        return Math.floor(Math.random() * 10001)
    }
// =============================================

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                {   
                    columns.map((column) => (
                        <ColumnContainer
                            key={column.id} 
                            column={column}
                            deleteColumn={deleteColumn}
                        />
                    ))
                }
                </div>
                <button
                    onClick={() => createNewColumn()}
                    className="h-[60px] w-[350px] min-w-[350px] flex items-center justify-center gap-3 cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2"
                >
                    <RiAddCircleLine size={20} />
                    Add Column
                </button>
            </div>
        </div>
    )
}

export default KanbanBoard
