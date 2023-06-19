import axios from 'axios';
import { ListPart } from './types';
import { Intent, OverlayToaster } from '@blueprintjs/core';

export const printerAxios = axios.create({
    baseURL: 'http://octopi/',
    headers: {
        Authorization: 'Bearer 1A53572A31A24E76BC9A141B8DDD3711',
        'Content-Type': 'multipart/form-data',
    },
});

export async function slice(parts: ListPart[]) {
    const { data: file } = await axios.post(
        'http://localhost:3000/slice',
        { parts },
        { responseType: 'text' }
    );
    return file;
}

export async function toast(
    message: string,
    intent: Intent,
    action?: { text: string; onClick: () => void }
) {
    const toaster = OverlayToaster.create({ position: 'bottom' });
    toaster.show({ message, intent, action });
}
