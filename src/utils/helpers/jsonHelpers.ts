import { CalculationData } from "../../data/calculations/ICalculationsRepository";

export const maptoJSON = <K, V>(map: Map<K, V>): string => {
    try {
        return JSON.stringify(Object.fromEntries(map));
    } catch (e: unknown) {
        throw new Error(`Error in maptoJSON: ${e}\n${map}`);
    }
};

export const JSONtoMap = <K, V>(jsonStr: string): Map<K, V> => {
    try {
        return new Map<K, V>(
            Object.entries(JSON.parse(jsonStr)) as Array<[K, V]>
        );
    } catch (e: unknown) {
        throw new Error(`Error in JSONtoMap: ${e}\n${jsonStr}`);
    }
};

export function calculationDataArrayToJSON(
    calculationDataArray: CalculationData[]
): string {
    try {
        return JSON.stringify(
            calculationDataArray.map((calculationData) =>
                calculationData.toJSON()
            )
        );
    } catch (e: unknown) {
        throw new Error(
            `Error in calculationDataArrayToJSON: ${e}\n${calculationDataArray}`
        );
    }
}

export function JSONtoCalculationDataArray(json: string): CalculationData[] {
    try {
        return JSON.parse(json).map((jsonStr: string) =>
            CalculationData.fromJSON(jsonStr)
        );
    } catch (e: unknown) {
        throw new Error(`Error in JSONtoCalculationDataArray: ${e}\n${json}`);
    }
}
