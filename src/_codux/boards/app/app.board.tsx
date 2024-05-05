import React from 'react';
import { createBoard } from '@wixc3/react-board';
import App from '../../../App';
import { PrinterContext, PrinterContextProvider } from '../../../contexts/PrinterContext';
import { Settings } from '@blueprintjs/icons/lib/esm/generated-icons/16px/paths';
import { SettingsContextProvider } from '../../../contexts/SettingsContext';

export default createBoard({
    name: 'App',
    Board: () => (
        <BrowserStoreContextProvider>
            <SettingsContextProvider>
                <PrinterWrapper />
            </SettingsContextProvider>
        </BrowserStoreContextProvider>
    ),
    environmentProps: {
        canvasHeight: 784,
        canvasWidth: 1148,
        windowHeight: 822,
        windowWidth: 1180,
    },
});
