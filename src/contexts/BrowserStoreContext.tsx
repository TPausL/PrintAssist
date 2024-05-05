import React, { createContext, useEffect, useState } from 'react';
import { Printer } from '../types';

// Define the initial state and types for your context here

// Create the context
const BrowserStoreContext = createContext<
    | {
          currentPrinter: string | undefined;
          setCurrentPrinter: (printer: string) => void;
      }
    | undefined
>(undefined);

// Create a provider component for your context
function BrowserStoreContextProvider(props: { children: React.ReactNode }) {
    const [currentPrinter, setCurrentPrinterState] = useState<string | undefined>(undefined);
    //store hostname
    const getCurrentPrinter = (): string | undefined => {
        return localStorage.getItem('currentPrinter') ?? undefined;
    };

    const setCurrentPrinter = (printer: string) => {
        setCurrentPrinterState(printer);
        localStorage.setItem('currentPrinter', printer);
    };

    useEffect(() => {
        setCurrentPrinter(getCurrentPrinter() as string);
    }, []);
    return (
        <BrowserStoreContext.Provider
            value={{
                currentPrinter: currentPrinter,
                setCurrentPrinter: setCurrentPrinter,
            }}
        >
            {props.children}
        </BrowserStoreContext.Provider>
    );
}

export { BrowserStoreContext as BrowserStoreContext, BrowserStoreContextProvider };
