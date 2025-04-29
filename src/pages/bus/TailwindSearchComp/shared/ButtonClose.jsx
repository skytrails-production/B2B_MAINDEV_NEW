import React from "react";

const ButtonClose = ({ className = "", onClick = () => { } }) => {
    return (
        <button
            className={`w-8 h-8 flex items-center justify-center rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 ${className}`}
            onClick={onClick}
        >
            <span className="sr-only">Close</span>
            {/* Replace XMarkIcon with a simple "X" or an SVG icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
};

export default ButtonClose;
