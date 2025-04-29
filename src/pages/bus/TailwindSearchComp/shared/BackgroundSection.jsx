import React from "react";
import PropTypes from "prop-types";

const BackgroundSection = ({
    className = "bg-neutral-100",
    children,
}) => {
    return (
        <div
            className={`nc-BackgroundSection absolute inset-y-0 w-screen xl:max-w-[1300px] 2xl:max-w-[1400px] left-1/2 transform -translate-x-1/2 xl:rounded-[40px] z-0 ${className}`}
            data-nc-id="BackgroundSection"
        >
            {children}
        </div>
    );
};

// PropTypes for type-checking props
BackgroundSection.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
};

export default BackgroundSection;
