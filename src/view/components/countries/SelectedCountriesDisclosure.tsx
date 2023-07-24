import { Disclosure } from "@headlessui/react";
import React from "react";
import { CountryName } from "../../../data/constants/CountryEmissions";
import { CountryDropdown } from "./CountryDropdown";
import { SelectedCountries } from "./SelectedCountries";

type SelectedCountriesDisclosureProps = {
    selectedCountries: Map<CountryName, number>;
    addSelectedCountry: (CountryName: string) => void;
    removeSelectedCountry: (CountryName: string) => void;
    setCountryPercentage: (CountryName: string, percentage: number) => void;
};

export const SelectedCountriesDisclosure = ({
    selectedCountries,
    addSelectedCountry,
    removeSelectedCountry,
    setCountryPercentage,
}: SelectedCountriesDisclosureProps) => {
    return (
        <div>
            <Disclosure>
                <Disclosure.Button className="px-4 flex justify-between w-full text-white bg-myrtle-green rounded-lg ui-open:rounded-b-none hover:bg-opacity-75 focus:outline-none focus-visible:ring focus-visible:ring-myrtle-green focus-visible:ring-opacity-75">
                    <h2 className="py-2 text-sm font-medium text-left">{`My users are based in... (${selectedCountries.size} selected)`}</h2>
                </Disclosure.Button>
                <Disclosure.Panel className="px-4 py-2 bg-nyanza rounded-2xl shadow">
                    <SelectedCountries
                        selectedCountries={selectedCountries}
                        removeSelectedCountry={removeSelectedCountry}
                        setCountryPercentage={setCountryPercentage}
                    />
                    <CountryDropdown
                        addSelectedCountry={addSelectedCountry}
                        selectedCountries={selectedCountries}
                    />
                </Disclosure.Panel>
            </Disclosure>
        </div>
    );
};
