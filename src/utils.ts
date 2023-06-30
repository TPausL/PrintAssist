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
