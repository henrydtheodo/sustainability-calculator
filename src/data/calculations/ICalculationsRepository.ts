import { DeviceName } from "data/constants/DeviceEmissions";
import { JSONtoMap, maptoJSON } from "../../utils/helpers/jsonHelpers";
import { CountryName } from "../constants/CountryEmissions";
import { CalculationsRepository } from "./CalculationsRepository";
import { TestCalculationsRepository } from "./TestCalculationsRepository";

export abstract class ICalculationsRepository {
    private static _instance: ICalculationsRepository;
    static get instance(): ICalculationsRepository {
        if (!this._instance) {
            switch (process.env.ENV) {
                case "development":
                    this._instance = new CalculationsRepository();
                    break;
                case "test":
                    this._instance = new TestCalculationsRepository();
                    break;
                default:
                    throw new Error(`Unknown environment: ${process.env.ENV}`);
            }
        }

        return this._instance;
    }

    abstract storeCalculation(calculationData: CalculationData): Promise<void>;

    abstract getLastCalculation(): Promise<CalculationData | null>;

    abstract getAllCalculations(): Promise<CalculationData[]>;
}

export type UserType = "new user" | "returning user";

export class CalculationData {
    constructor(
        public bytes: number,
        public selectedCountries: Map<CountryName, number>,
        public selectedDevices: Map<CountryName, number>,
        public startUnixTimeMs: number,
        public endUnixTimeMs: number,
        public userType: UserType
    ) {}

    public toJSON(): string {
        return JSON.stringify({
            bytes: this.bytes,
            selectedCountries: maptoJSON(this.selectedCountries),
            selectedDevices: maptoJSON(this.selectedDevices),
            startUnixTimeMs: this.startUnixTimeMs,
            endUnixTimeMs: this.endUnixTimeMs,
            userType: this.userType,
        });
    }

    public static fromJSON(json: string): CalculationData {
        const obj = JSON.parse(json);
        const selectedCountries = JSONtoMap<CountryName, number>(
            obj.selectedCountries
        );
        const selectedDevices = JSONtoMap<DeviceName, number>(
            obj.selectedDevices
        );
        return new CalculationData(
            obj.bytes,
            selectedCountries,
            selectedDevices,
            obj.startUnixTimeMs,
            obj.endUnixTimeMs,
            obj.userType
        );
    }
}
