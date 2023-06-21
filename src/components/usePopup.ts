import { useEffect, useState } from "react";
import { CO2_EMISSIONS_GRAMS_PER_GB, CountryName } from "../constants/Countries";
import { calculateAverageSpecificEmissionsHelper } from "../helpers/calculateAverageSpecificEmissions";
import { calculateCarbon } from "../helpers/calculateCarbon";

export type PopupProps = {
    totalBytesReceived: number;
    emissions: number;
    selectedCountries: Map<CountryName, number>;
    addSelectedCountry: (country: CountryName) => void;
    removeSelectedCountry: (country: CountryName) => void;
    setCountryPercentage: (country: CountryName, percentage: number) => void;
    averageSpecificEmissions: number;
    refreshAndGetSize: () => Promise<void>;
    error?: string;
}

export const usePopup = (): PopupProps => {
    const [totalBytesReceived, setTotalBytesReceived] = useState(0);
    const [emissions, setEmissions] = useState(0);
    const [selectedCountries, setSelectedCountries] = useState<Map<CountryName, number>>(new Map<CountryName, number>([["World Average", 0]]))
    const [averageSpecificEmissions, setAverageSpecificEmissions] = useState(0);
    const [error, setError] = useState<string>();

    const setCountryPercentage = (country: CountryName, percentage: number) => {
        const newMap = new Map(selectedCountries);
        newMap.set(country, percentage);
        setSelectedCountries(newMap);
    }

    const calculateAverageSpecificEmissions = () => {
        const newAverageSpecificEmissions = calculateAverageSpecificEmissionsHelper(selectedCountries);
        setAverageSpecificEmissions(newAverageSpecificEmissions)

    }

    const sumPercentages = () => {
        const percentage = Array.from(selectedCountries.values()).reduce((accumulator, country) => {
            return accumulator + country;
        }, 0);

        if (percentage > 1) {
            throw new Error(`Error: The sum of the percentages is greater than 100%. Current sum: ${percentage * 100}%`);
        }

        return percentage;
    }


    const refreshAndGetSize = async () => {
        try {
            sumPercentages();
            calculateAverageSpecificEmissions();
        } catch (e: any) {
            setError(e.message);
            return;
        }
        try {
            await chrome.storage.local.set({ ["totalBytesReceived"]: 0 });
        } catch (e: any) {
            setError(e.message);
            return;
        }


        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;
                // @ts-ignore
                chrome.tabs.reload(tabId, () => {
                    chrome.runtime.sendMessage({ command: "startStoringWebRequestPayloadSize", tabId });
                });
            }
        });
    };

    const addSelectedCountry = (country: CountryName) => {
        const newMap = new Map(selectedCountries);
        if (newMap.has(country)) {
            return
        }
        newMap.set(country, 0);
        setSelectedCountries(newMap);
    }
    const removeSelectedCountry = (country: CountryName) => {
        const newMap = new Map(selectedCountries);
        if (!newMap.has(country)) {
            return
        }
        newMap.delete(country);
        setSelectedCountries(newMap);
    }

    const totalBytesReceivedListener = (changes: {
        [key: string]: chrome.storage.StorageChange;
    }) => {
        if (changes.totalBytesReceived) {
            setTotalBytesReceived(changes.totalBytesReceived.newValue);
            setEmissions(calculateCarbon(changes.totalBytesReceived.newValue, selectedCountries));
        }

    }

    useEffect(() => {

        chrome.storage.local.onChanged.addListener(totalBytesReceivedListener);

        return () => {
            chrome.storage.local.onChanged.removeListener(totalBytesReceivedListener);
        }
    }, []);


    return {
        emissions,
        totalBytesReceived,
        selectedCountries,
        addSelectedCountry,
        removeSelectedCountry,
        setCountryPercentage,
        averageSpecificEmissions,
        refreshAndGetSize,
        error,
    }

}