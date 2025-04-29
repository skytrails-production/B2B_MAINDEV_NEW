import React from "react";
import { Filter, RefreshCw, Search, X } from "lucide-react";

const NoResult = ({ handleClearAllFilter, activeFilterLabels }) => {
  return (
    <div>
      {/* Applied Filters Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Applied Filters
          </h3>
          <button
            onClick={() => handleClearAllFilter("All")}
            className="h-8 px-3 py-1 flex items-center gap-2 text-sm font-medium text-red-600 border border-red-500 rounded-md hover:bg-red-100 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Clear All
          </button>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(activeFilterLabels).map((filter) =>
            activeFilterLabels[filter]?.isApplied ? (
              <div
                key={filter}
                className="px-3 py-1 flex items-center gap-2 border border-gray-300 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer"
              >
                {activeFilterLabels[filter]?.title}
                <button
                  onClick={() => handleClearAllFilter(filter)}
                  className="p-1 rounded-full hover:bg-gray-300 transition-all"
                  aria-label={`Remove ${activeFilterLabels[filter]?.title} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* No Result Message */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 text-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No matching flights found
          </h3>
          <p className="text-gray-500 max-w-md mb-6">
            We couldn't find any flights that match your current filters. Try
            adjusting or removing some filters to see more results.
          </p>
          <button
            className="px-4 py-2 text-white bg-primary-700 hover:bg-primary-6000 font-medium rounded-md flex items-center gap-2 transition-all"
            onClick={() => handleClearAllFilter("All")}
          >
            <RefreshCw className="h-4 w-4" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoResult;
