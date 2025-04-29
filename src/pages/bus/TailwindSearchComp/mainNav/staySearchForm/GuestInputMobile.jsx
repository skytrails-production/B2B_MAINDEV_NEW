import React, { useEffect, useState } from "react";
import NcInputNumber from "../../heroSection/NcInputNumber";
import { TrashIcon } from "@heroicons/react/24/outline";


const GuestsInputMobile = ({ className = "", onRoomDataChange, }) => {


    const [rooms, setRooms] = useState([
        {
            adults: 1,
            children: 0,
            childrenAges: [],
        },
    ]);

    const handleAddRoom = () => {
        setRooms([
            ...rooms,
            {
                adults: 1,
                children: 0,
                childrenAges: [],
            },
        ]);
    };

    const handleRemoveRoom = (roomIndex) => {
        setRooms(rooms.filter((_, index) => index !== roomIndex));
    };

    const handleChangeRoomData = (value, roomIndex, type) => {
        const updatedRooms = [...rooms];
        if (type === "adults") {
            updatedRooms[roomIndex].adults = value;
        } else if (type === "children") {
            const prevChildren = updatedRooms[roomIndex].children;
            updatedRooms[roomIndex].children = value;
            if (value > prevChildren) {
                updatedRooms[roomIndex].childrenAges = [
                    ...updatedRooms[roomIndex].childrenAges,
                    ...Array(value - prevChildren).fill(""),
                ];
            } else {
                updatedRooms[roomIndex].childrenAges = updatedRooms[roomIndex].childrenAges.slice(
                    0,
                    value
                );
            }
        } else if (type === "childAge") {
            updatedRooms[roomIndex].childrenAges[value.index] = value.age;
        }

        setRooms(updatedRooms);
    };

    const totalGuests = rooms.reduce(
        (acc, room) => acc + room.adults + room.children,
        0
    );

    useEffect(() => {
        const payload = rooms.map(room => ({
            adults: room.adults,
            childrenAges: room.childrenAges,
        }));
        onRoomDataChange(payload);
    }, [rooms]);

    return (
        <div className={`flex flex-col relative p-5 ${className}`}>
            <span className="mb-5 block font-semibold text-xl sm:text-2xl">
                {`Who's coming?`}
            </span>
            {rooms.map((room, roomIndex) => (
                <div key={roomIndex} className="mb-6">
                    <div className="flex justify-between mb-2">
                        <h3 className="font-semibold">Room {roomIndex + 1}</h3>
                        {roomIndex > 0 && (
                            <button
                                className="text-red-500"
                                onClick={() => handleRemoveRoom(roomIndex)}
                            >
                                <TrashIcon className="h-5 w-5" /> {/* Add Trash Icon here */}
                            </button>
                        )}
                    </div>


                    <NcInputNumber
                        className="w-full"
                        defaultValue={room.adults}
                        onChange={(value) => handleChangeRoomData(value, roomIndex, "adults")}
                        max={10}
                        min={1}
                        label="Adults"
                    />
                    <NcInputNumber
                        className="w-full mt-4"
                        defaultValue={room.children}
                        onChange={(value) => handleChangeRoomData(value, roomIndex, "children")}
                        max={4}
                        label="Children"
                        desc="Ages 2–12"
                    />

                    {room.children > 0 &&
                        room.childrenAges.map((age, childIndex) => (
                            <div key={childIndex} className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Age of Child {childIndex + 1}
                                </label>
                                <input
                                    type="number"
                                    className="mt-1 p-2 block w-full shadow-sm sm:text-sm border border-gray-200 rounded-md"
                                    value={age}
                                    onChange={(e) =>
                                        handleChangeRoomData(
                                            { index: childIndex, age: e.target.value },
                                            roomIndex,
                                            "childAge"
                                        )
                                    }
                                    min={2}
                                    max={12}
                                />
                            </div>
                        ))}
                </div>
            ))}

            <button
                type="button"
                className="w-full mt-4 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleAddRoom}
            >
                Add Room
            </button>

        </div>
    );
};

export default GuestsInputMobile;
