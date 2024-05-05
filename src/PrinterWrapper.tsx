import React from 'react';
import { PrinterContextProvider } from './contexts/PrinterContext';
import App from './App';
import { useBrowserStore, useSettings } from './contexts/contextHooks';
import { find } from 'lodash';
import { Printer } from './types';
import { PrinterSettingsCard } from './components/printer-settings-card/printer-settings-card';
import { Button } from '@blueprintjs/core';

type PrinterWrapperProps = {
    // Define your component props here
};

const PrinterWrapper: React.FC<PrinterWrapperProps> = (props) => {
    const settings = useSettings();
    const browserStore = useBrowserStore();

    const printer = find(
        settings?.values?.printers,
        (p: Printer) => p.id == browserStore?.currentPrinter
    );


    if (printer) {
        return (
            <PrinterContextProvider
                printer={
                    find(
                        settings?.values?.printers,
                        (p: Printer) => p.id == browserStore?.currentPrinter
                    ) as Printer
                }
            >
                <App />
            </PrinterContextProvider>
        );
    } else {
        return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '60vw' }}>
                    <h2>Choose a printer</h2>
                    {settings?.values?.printers.map((printer) => (
                        <Button large onClick={() => browserStore?.setCurrentPrinter(printer.id)}>
                            {printer.name}
                        </Button>
                    ))}
                </div>
            </div>
        );
    }
};

export default PrinterWrapper;
