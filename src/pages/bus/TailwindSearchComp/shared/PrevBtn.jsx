import { MoveLeft } from "lucide-react";
import React from "react";

const PrevBtn = ({ className = "w-10 h-10 text-lg", ...args }) => {
    return (
        <button
            className={`PrevBtn ${className} bg-white  border border-neutral-200 rounded-full inline-flex items-center justify-center hover:border-neutral-300`}
            {...args}
        >
            {/* <i className="las la-angle-left"></i> */}
            <MoveLeft className="w-8 h-4" />
        </button>
    );
};

export default PrevBtn;
