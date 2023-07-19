import axios from 'axios';
import { ListPart } from './types';
import { Intent, OverlayToaster } from '@blueprintjs/core';

export async function toast(
    message: string,
    intent?: Intent,
    action?: { text: string; onClick: () => void }
) {
    intent = intent || Intent.PRIMARY;
    const toaster = OverlayToaster.create({ position: 'bottom' });
    toaster.show({ message, intent, action });
}

export function extractDataFromGcode(str: string) {
    const timeRegex = /estimated printing time \(normal mode\) = (\d+h)? ?(\d+m)? ?(\d+s)?/;
    const weightRegex = /total filament used \[g\] = (\d+\.\d+)/;
    const costRegex = /total filament cost = (\d+\.\d+)/;

    const timeMatch = str.match(timeRegex);
    const weightMatch = str.match(weightRegex);
    const costMatch = str.match(costRegex);

    if (!timeMatch) {
        return { time: 0, price: 0, weight: 0 };
    }
    const hours = timeMatch[1] ? parseInt(timeMatch[1]) : 0;
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const seconds = timeMatch[3] ? parseInt(timeMatch[3]) : 0;
    const time = timeToSeconds(hours, minutes, seconds);

    const weight = weightMatch ? parseFloat(weightMatch[1]) : 0;
    const price = costMatch ? parseFloat(costMatch[1]) : 0;

    return {
        time,
        weight,
        price,
    };
}
function timeToSeconds(hours: number, minutes: number, seconds: number) {
    return hours * 3600 + minutes * 60 + seconds;
}
