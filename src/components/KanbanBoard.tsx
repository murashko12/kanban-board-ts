import { RiAddCircleLine } from "react-icons/ri";
import { Column, Task, Id } from "../types";
import { useMemo, useState } from 'react'
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([])
    const [tasks, setTasks] = useState<Task[]>([])



    const columnsId = useMemo(() => columns.map((column) => column.id),[columns])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3
            }
        })
    )
    
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

    const updateColumn = (id: Id, title: string) => {
        const newColumns = columns.map(
            (column) => {
                if (column.id !== id) return column
                return {...column, title}
                
            }
        )
        setColumns(newColumns)
    }

    
// ====== Tasks ======
    const createTask = (columnId: Id) => {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        }
        setTasks([...tasks,newTask])
    }

    const updateTask = (id: Id, content: string) => {
        const newTasks = tasks.map(task => {
            if (task.id !== id) return task
            return {...task, content}
        })
        setTasks(newTasks)
    }

    const deleteTask = (id: Id) => {
        setTasks(tasks.filter((task) => task.id !== id))
    }

// ======= DND =======
    const generateId = () => {
        return Math.floor(Math.random() * 10001)
    }

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task)
            return
        }
    }

    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null)
        setActiveTask(null)

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

    const onDragOver = (event: DragOverEvent) => {
    
        const {active, over} = event
        
        if (!over) return

        const activeTaskId = active.id
        const overTaskId = over.id

        if (activeTaskId === overTaskId) return

        const isActiveATask = active.data.current?.type === "Task"
        const isOverATask = over.data.current?.type === "Task"

        // dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex(t => t.id === activeTaskId) 
                const overIndex = tasks.findIndex(t => t.id === overTaskId) 
                return arrayMove(tasks, activeIndex,overIndex)
            })
        }


        // dropping a Task over a column


    }
// =============================================


// ---------------------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
            <DndContext 
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {   
                                columns.map((column) => (
                                    <ColumnContainer
                                        key={column.id} 
                                        column={column}
                                        updateColumn={updateColumn}
                                        deleteColumn={deleteColumn}
                                        createTask={createTask}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                        tasks={tasks.filter((task) => task.columnId === column.id)}
                                        
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
                                updateColumn={updateColumn}
                                deleteColumn={deleteColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}    
                            />
                        )}
                        {activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>}
                    </DragOverlay>,
                    document.body
                )}

            </DndContext>
        </div>
    )
}

export default KanbanBoard
