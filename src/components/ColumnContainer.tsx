import { useSortable } from "@dnd-kit/sortable";
import { Column, Id } from "../types";
import { ImBin } from "react-icons/im";
import { CSS } from "@dnd-kit/utilities"

interface IProps {
    column: Column;
    deleteColumn: (id: Id) => void;
}

const ColumnContainer = (props: IProps) => {

    const {column, deleteColumn} = props

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
        }
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
            className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col shadow-xl"
        >
            <div 
                {...attributes}
                {...listeners}
                className="bg-mainBackgroundColor px-3 h-[60px] cursor-grab rounded-lg rounded-b-none border-columnBackgroundColor border-4 flex justify-between items-center"
            >
                <div className="flex justify-center items-center bg-columnBackgroundColor h-8 w-8 text-md rounded-full">0</div>
                {column.title}
                <button 
                    onClick={() => deleteColumn(column.id)}
                    className="text-gray-500 px-1 py-2 rounded hover:text-white hover:bg-columnBackgroundColor"
                >
                    <ImBin size={20} />
                </button>    
            </div>

            {/* column task container */}
            <div className="flex flex-grow">container</div>
            {/* column footer */}
            <div className="">footer</div>
        </div>
    )
}

export default ColumnContainer
