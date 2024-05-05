import { createBoard } from '@wixc3/react-board';
import { PrinterSettingsCard } from '../../../components/printer-settings-card/printer-settings-card';
import { BrowserStoreContextProvider } from '../../../contexts/BrowserStoreContext';
import { SettingsContextProvider } from '../../../contexts/SettingsContext';

export default createBoard({
    name: 'PrinterSettingsCard',
    Board: () => (
        <BrowserStoreContextProvider>
            <SettingsContextProvider>
                <PrinterSettingsCard />
            </SettingsContextProvider>
        </BrowserStoreContextProvider>
    ),
    isSnippet: true,
    environmentProps: {
        canvasWidth: 190,
        windowWidth: 1216,
        windowHeight: 699,
    },
});
