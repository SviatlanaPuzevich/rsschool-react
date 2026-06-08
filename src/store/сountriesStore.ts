import { create } from "zustand";

export const useCountriesStore = create(() => ({
    countries: [
        "Lithuania",
        "Latvia",
        "Estonia",
        "Poland",
        "Germany",
        "France",
        "Italy",
        "Spain",
        "Portugal",
        "Belgium",
        "Netherlands",
        "Sweden",
        "Norway",
        "Finland",
        "Denmark",
    ],
}));