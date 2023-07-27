import { Combobox, Transition } from "@headlessui/react";
import React from "react";
import { useDeviceDropdown } from "./useDeviceDropdown";

export const DeviceDropdown = () => {
    const { displayedDevices, addSelectedDevice, query, setQuery } =
        useDeviceDropdown();

    return (
        <div className="relative w-full">
            <Combobox value={""} onChange={addSelectedDevice}>
                <Combobox.Input
                    className="w-full px-3 py-2 text-black bg-rose-quartz bg-opacity-20 rounded-md shadow-sm border border-gray-100 focus:outline-none focus:ring-myrtle-green focus:border-myrtle-green sm:text-sm"
                    placeholder="Add a device"
                    onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="inset-y-0 country-tile-button">
                    +
                </Combobox.Button>
                <Transition
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="absolute overflow-auto w-full max-h-60 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {displayedDevices.length === 0 && query !== "" ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                            </div>
                        ) : (
                            displayedDevices.map((country) => (
                                <Combobox.Option
                                    key={country}
                                    className="relative cursor-default select-none py-2 px-4 ui-active:bg-nyanza ui-active:text-myrtle-green ui-not-active:text-gray-900"
                                    value={country}
                                >
                                    {country}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </Combobox>
        </div>
    );
};
