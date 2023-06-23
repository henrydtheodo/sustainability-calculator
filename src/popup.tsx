import React from "react";
import { createRoot } from "react-dom/client";
import { CountryDropdown } from './components/CountryDropdown'
import { usePopup } from "./components/usePopup";
import { SelectedCountries } from "./components/selected-countries/SelectedCountries";

export const Popup = () => {
  const {
    totalBytesReceived,
    emissions,
    selectedCountries,
    addSelectedCountry,
    removeSelectedCountry,
    setCountryPercentage,
    averageSpecificEmissions,
    refreshAndGetSize,
    error,
  } = usePopup();



  return (
    <div className="bg-black">
      <h1 className="text-3xl font-bold underline">
        Sustainability Calculator
      </h1>
      <button onClick={() => refreshAndGetSize()}>
        Calculate CO2 emissions
      </button>
      <p >Total Data Received: {totalBytesReceived} bytes</p>
      <p >Specific Carbon Emissions (grams of C02 per gigabyte): {Math.round(averageSpecificEmissions * 100) / 100}</p>
      <p >Software Carbon Intensity: {Math.round(emissions * 100) / 100} grams of CO2</p>
      <SelectedCountries selectedCountries={selectedCountries} removeSelectedCountry={removeSelectedCountry} setCountryPercentage={setCountryPercentage} />
      <CountryDropdown addSelectedCountry={addSelectedCountry} />
      {error && <p>{error}</p>}
    </div>
  );
};

const rootElement = document.getElementById("react-target");
// @ts-ignore
createRoot(rootElement).render(<Popup />);
