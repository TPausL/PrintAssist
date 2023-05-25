import { IconName } from "@blueprintjs/icons";

export interface PartType {
    name: string;
    file: string;
    time: number;
    weight: number;
    price: number;

}
export interface PartGroup {
    group: string,
    name: string,
    icon?: IconName,
    index: number,
    items: PartType[]
}