import { IconName } from '@blueprintjs/icons';

export interface PartType {
    name: string;
    size: string;
    file: string;
    time: number;
    weight: number;
    price: number;
    group: PartGroup['id'];
    custom?: {
        icon: string;
        [key: string]: any;
    };
}
export type ListPart = PartType & { count: number };
export interface PartGroup {
    id: string;
    name: string;
    icon?: IconName;
    index: number;
}
export interface PartSize {
    id: string;
    name: {
        mobile?: string;
        desktop: string;
    };
    index: number;
    icon?: {
        icon: IconName;
        size: number | undefined;
    };
}

export interface Settings {
    printer: {
        hostname: string;
        api_key: string;
    };
}

export interface TypedRequestBody<T> extends Express.Request {
    body: T;
}

export type SliceRequest = TypedRequestBody<{
    parts: ListPart[];
}>;

export type Spool = {
    bedTemperature: number;
    code: string | null;
    color: string;
    colorName: string;
    cost: number;
    costUnit: string;
    created: string;
    databaseId: number;
    density: number;
    diameter: number;
    diameterTolerance: string | null;
    displayName: string;
    enclosureTemperature: number | null;
    firstUse: string;
    flowRateCompensation: number | null;
    isActive: boolean;
    isTemplate: boolean | null;
    labels: string;
    lastUse: string;
    material: string;
    materialCharacteristic: string | null;
    noteDeltaFormat: string;
    noteHtml: string;
    noteText: string;
    offsetBedTemperature: number | null;
    offsetEnclosureTemperature: number | null;
    offsetTemperature: number | null;
    originator: string | null;
    purchasedFrom: string | null;
    purchasedOn: string;
    remainingLength: string;
    remainingLengthPercentage: string;
    remainingPercentage: string;
    remainingWeight: string;
    spoolWeight: string;
    temperature: number;
    totalLength: number;
    totalWeight: string;
    updated: string;
    usedLength: number;
    usedLengthPercentage: string;
    usedPercentage: string;
    usedWeight: string;
    vendor: string;
    version: number;
};

export type ColorsCatalog = {
    color: string;
    colorId: string;
    colorName: string;
};

export type Catalogs = {
    colors: ColorsCatalog[];
    labels: string[];
    materials: string[];
    vendors: string[];
};

export type SelectedSpool = Spool;

export type Spools = {
    allSpools: Spool[];
    catalogs: Catalogs;
    selectedSpools: SelectedSpool[];
};
