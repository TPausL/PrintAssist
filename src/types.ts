import { IconName } from '@blueprintjs/icons';

export interface PartType {
    name: string;
    size: string;
    file: string;
    time: number;
    weight: number;
    price: number;
    group: PartGroup['id'];
}
export interface PartGroup {
    id: string;
    name: string;
    icon?: IconName;
    index: number;
}
