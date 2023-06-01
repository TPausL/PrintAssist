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
export type ListPart = PartType & { count: number }
export interface PartGroup {
    id: string;
    name: string;
    icon?: IconName;
    index: number;
}


export interface TypedRequestBody<T> extends Express.Request {
    body: T
}

export type SliceRequest = TypedRequestBody<{
    parts: ListPart[];
}>
