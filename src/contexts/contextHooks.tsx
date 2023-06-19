import { useContext } from 'react';
import { SettingsContext } from './SettingsContext';
import { PrinterContext } from './PrinterContext';

//hook for using settings context
export function useSettings() {
    return useContext(SettingsContext);
}

export function usePrinter() {
    return useContext(PrinterContext);
}
