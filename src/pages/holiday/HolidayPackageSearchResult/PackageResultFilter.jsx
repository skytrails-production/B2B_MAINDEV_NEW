import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Select, Slider } from "antd";
import { Checkbox, Field, Label } from "@headlessui/react";
import "./packageResultFilter.scss";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import debounce from "lodash/debounce";
const { Option } = Select;

const PackageResultFilter = ({
  uniqueDestinations,
  onFilterChange,
  onPriceChange,
  minPrice,
  maxPrice,
  priceRange,
  selectedTag,
  onTagChange,
  flightIncluded,
  onFlightChange,
  selectedDays,
  onDaysChange,
  onSearchTermChange,
  searchTerm,
  onClearFilters, // New prop
  selectedDestinations, // Add this line
  setSelectedDestinations, // Add this line
}) => {
  const [currentPriceRange, setCurrentPriceRange] = useState(priceRange);

  useEffect(() => {
    onFilterChange(
      selectedDestinations,
      currentPriceRange,
      selectedTag,
      flightIncluded,
      selectedDays
    );
  }, [
    selectedDestinations,
    currentPriceRange,
    selectedTag,
    flightIncluded,
    selectedDays,
  ]);

  const handleDestinationChange = (values) => {
    setSelectedDestinations(values);
  };

  const handlePriceChange = (value) => {
    setCurrentPriceRange(value);
    onPriceChange(value);
  };

  const handleTagChange = (e) => {
    onTagChange(e.target.value);
    console.log("value in the pack res fil", e.target.value);
  };

  const handleFlightOptionChange = (e) => {
    const isChecked = e.target.checked;
    const value = e.target.value;
    onFlightChange(isChecked ? value : ""); // or null/false if you prefer
  };

  const handleDaysChange = (e) => {
    const value = e.target.value;
    onDaysChange(value);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    onSearchTermChange(value);
    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearchTermChange(value);
    }, 300),
    []
  );

  const handleClear = () => {
    setSelectedDestinations([]);
    onClearFilters();
  };

  return (
    <div className="holidayFilterMainBox shadow-md bg-white border-1 border-gray-300">
      <div className="holidayFilterClear">
        <h5
          // style={{ cursor: "pointer", fontSize: "15px", fontWeight: "700" }}
          className="cursor-pointer text-sm font-bold text-gray-800"
          onClick={handleClear}
        >
          Clear Filters
        </h5>
      </div>
      <div className=" my-4 mx-0 flex flex-col justify-start gap-2">
        <p className="text-sm font-medium text-gray-700">Search By Name</p>
        <input
          type="text"
          placeholder="Search by Package Name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="rounded-md border-1 border-gray-300 text-xs font-medium"
        />
      </div>

      <div className="holidayFilterSelectMulti">
        <p className="text-sm font-medium text-gray-700 mb-1">Cities</p>
        <Listbox
          value={selectedDestinations}
          onChange={handleDestinationChange}
          multiple
        >
          {({ open }) => (
            <div className="relative">
              <Listbox.Button className="w-full cursor-default rounded-md border-1 border-gray-300  py-2 pl-3 pr-10 text-left   sm:text-sm">
                {selectedDestinations.length > 0
                  ? selectedDestinations.join(", ")
                  : "Please select destinations"}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon className="h-5 w-5 " aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {uniqueDestinations.map((destination, idx) => (
                    <Listbox.Option
                      key={idx}
                      value={destination}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {destination}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>

      <div className="PackagetagFilters">
        <p className="text-sm font-medium text-gray-700">Flight Options</p>

        <Field className="flex items-center gap-2">
          <Checkbox
            // value="flight"
            checked={flightIncluded === "flight"}
            onChange={() =>
              onFlightChange(flightIncluded === "flight" ? "" : "flight")
            }
            data-checked={flightIncluded === "flight" ? "true" : undefined}
            className="group block size-4 rounded  border-1 border-gray-300 bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Flight Included</Label>
        </Field>
        <Field className="flex items-center gap-2">
          <Checkbox
            // value="no-flight"
            checked={flightIncluded === "no-flight"}
            // onChange={handleFlightOptionChange}
            onChange={() =>
              onFlightChange(flightIncluded === "no-flight" ? "" : "no-flight")
            }
            data-checked={flightIncluded === "no-flight" ? "true" : undefined}
            className="group block size-4 rounded border-1 border-gray-300 bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Flight not included</Label>
        </Field>
      </div>

      <div className="holidayFilterSlider">
        <p className="text-sm font-medium text-gray-800">Filter By Price</p>
        <Slider
          range
          step={400}
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={handlePriceChange}
        />

        <div className="flex-row d-flex justify-content-between align-items-center ">
          <span className="cursor-pointer text-sm font-bold text-gray-800">
            ₹ {priceRange?.[0]}
          </span>
          <span className="cursor-pointer text-sm font-bold text-gray-800">
            ₹ {priceRange?.[1]}
          </span>
        </div>
      </div>

      <div className="PackagetagFilters">
        <p className="text-sm font-medium text-gray-800">Themes</p>
        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedTag === "honeymoon"}
            onChange={() =>
              onTagChange(selectedTag === "honeymoon" ? "" : "honeymoon")
            }
            data-checked={selectedTag === "honeymoon" ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Honeymoon</Label>
        </Field>
        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedTag === "family"}
            onChange={() =>
              onTagChange(selectedTag === "family" ? "" : "family")
            }
            data-checked={selectedTag === "family" ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-700">Family</Label>
        </Field>
        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedTag === "luxury"}
            onChange={() =>
              onTagChange(selectedTag === "luxury" ? "" : "luxury")
            }
            data-checked={selectedTag === "luxury" ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Luxury</Label>
        </Field>
        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedTag === "budget"}
            onChange={() =>
              onTagChange(selectedTag === "budget" ? "" : "budget")
            }
            data-checked={selectedTag === "budget" ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Budget</Label>
        </Field>
        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedTag === "group"}
            onChange={() => onTagChange(selectedTag === "group" ? "" : "group")}
            data-checked={selectedTag === "group" ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Group</Label>
        </Field>
        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedTag === "couples"}
            onChange={() =>
              onTagChange(selectedTag === "couples" ? "" : "couples")
            }
            data-checked={selectedTag === "couples" ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Couples</Label>
        </Field>

        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedTag === "solo"}
            onChange={() => onTagChange(selectedTag === "solo" ? "" : "solo")}
            data-checked={selectedTag === "solo" ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">Solo</Label>
        </Field>
      </div>
      <div className="PackagetagFilters">
        <p className="text-sm font-medium text-gray-800">Filter By Days</p>
        {/* <Checkbox
          value="0-5"
          checked={selectedDays.includes("0-5")}
          onChange={handleDaysChange}
        >
          0-5 days
        </Checkbox> */}

        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedDays.includes("0-5")}
            onChange={() =>
              onDaysChange(selectedDays.includes("0-5") ? "0-5" : "0-5")
            }
            data-checked={selectedDays.includes("0-5") ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">0-5 days</Label>
        </Field>

        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedDays.includes("5-7")}
            onChange={() =>
              onDaysChange(selectedDays.includes("5-7") ? "5-7" : "5-7")
            }
            data-checked={selectedDays.includes("5-7") ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">5-7 days</Label>
        </Field>

        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedDays.includes("7-10")}
            onChange={() =>
              onDaysChange(selectedDays.includes("7-10") ? "7-10" : "7-10")
            }
            data-checked={selectedDays.includes("7-10") ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">7-10 days</Label>
        </Field>
        <Field className="flex items-center gap-2">
          <Checkbox
            checked={selectedDays.includes("10+")}
            onChange={() =>
              onDaysChange(selectedDays.includes("10+") ? "10+" : "10+")
            }
            data-checked={selectedDays.includes("10+") ? "true" : undefined}
            className="group block size-4 rounded border bg-white data-[checked=true]:bg-blue-500"
          >
            <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
          </Checkbox>
          <Label className="text-gray-800">10+ days</Label>
        </Field>
      </div>
    </div>
  );
};

export default PackageResultFilter;
