import React from "react";

const TravelerCounter = ({
  label,
  sublabel,
  count,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {sublabel && (
          <small className="block text-xs text-gray-500 mt-1">{sublabel}</small>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onDecrement}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Decrease ${label}`}
        >
          <span className="text-lg font-medium">-</span>
        </button>
        <span className="w-8 text-center text-gray-900 font-medium">
          {count}
        </span>
        <button
          onClick={onIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Increase ${label}`}
        >
          <span className="text-lg font-medium">+</span>
        </button>
      </div>
    </div>
  );
};

export default TravelerCounter;
