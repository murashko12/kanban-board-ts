import { RiAddCircleLine } from "react-icons/ri";
import { Column, Id } from "../types";
import { useMemo, useState } from 'react'
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { createPortal } from "react-dom";

const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([])

    const columnsId = useMemo(() => columns.map((column) => column.id),[columns])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    
// ========== FUNCTION IMPLEMENTATION ==========
    const createNewColumn = () => {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }
        setColumns([...columns, columnToAdd])
    }

    const deleteColumn = (id: Id) => {
        setColumns(columns.filter((column) => column.id !== id))
    }

    const generateId = () => {
        return Math.floor(Math.random() * 10001)
    }

    const onDragStart = (event: DragStartEvent) => {
        console.log(event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }
    }

    const onDragEnd = (event: DragEndEvent) => {

        const {active, over} = event
        
        if (!over) return

        const activeColumnId = active.id
        const overColumnId = over.id

        if (activeColumnId === overColumnId) return 

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((column) => column.id === activeColumnId)
            const overColumnIndex = columns.findIndex((column) => column.id === overColumnId)
            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })

    }
// =============================================


// ---------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
            <DndContext 
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {   
                                columns.map((column) => (
                                    <ColumnContainer
                                        key={column.id} 
                                        column={column}
                                        deleteColumn={deleteColumn}
                                    />
                                ))
                            }
                        </SortableContext>
                    </div>
                    <button
                        onClick={() => createNewColumn()}
                        className="h-[60px] w-[350px] min-w-[350px] flex items-center justify-center gap-3 cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2"
                    >
                        <RiAddCircleLine size={20} />
                        Add Column
                    </button>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}

            </DndContext>
        </div>
    )
}

export default KanbanBoard
