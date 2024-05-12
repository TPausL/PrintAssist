// react constext provider

import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { Printer, Settings } from '../types';
import { toast } from '../utils';

//if (import.meta.env.VITE_ENVIRONMENT === 'development') {
// axios.defaults.baseURL = 'http://TimoLaptop:4000';
//}
export const SettingsContext = createContext<
    | {
          values?: Settings;
          updateSettings: (s: Settings) => void;
          updatePrinter: (p: Printer) => void;
      }
    | undefined
>(undefined);

export function SettingsContextProvider(props: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings | undefined>(undefined);
    useEffect(() => {
        axios.get('/settings').then((res) => {
            setSettings(res.data);
        });
    }, []);
    useEffect(() => {}, [settings]);
    const updateSettings = async (settings: Settings) => {
        await axios
            .post('/settings', settings)
            .then((res) => {
                toast('Settings updated', 'success');
                setSettings(res.data.data);
            })
            .catch((err) => {
                toast(err.response.data, 'danger');
                throw err;
            });
    };

    const updatePrinter = async (printer: Printer) => {
        let printers = [...(settings?.printers ?? [])];
        let index = printers.findIndex((p) => p.id === printer.id);
        printers[index] = printer;
        let newSettings = { ...settings, printers: printers };
        await updateSettings(newSettings);
    };
    return (
        <SettingsContext.Provider value={{ values: settings, updateSettings, updatePrinter }}>
            {props.children}
        </SettingsContext.Provider>
    );
}
