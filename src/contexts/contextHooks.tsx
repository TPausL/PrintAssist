import { useContext } from 'react';
import { SettingsContext } from './SettingsContext';
import { PrinterContext } from './PrinterContext';
import { BrowserStoreContext } from './BrowserStoreContext';
import { SlicerContext } from './SlicerContext';

//hook for using settings context
export function useSettings() {
    return useContext(SettingsContext);
}

export function usePrinter() {
    return useContext(PrinterContext);
}

export function useBrowserStore() {
    return useContext(BrowserStoreContext);
}

export function useSlicer() {
    return useContext(SlicerContext);
}
