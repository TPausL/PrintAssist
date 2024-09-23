import axios, { AxiosError } from 'axios';
import { createContext, useEffect, useState } from 'react';
import { Printer, Settings } from '../types';
import { toast } from '../utils';

export const SettingsContext = createContext<
    | {
          values?: Settings;
          updateSettings: (s: Settings) => void;
          updatePrinter: (p: Printer) => void;
          addPrinter: () => void;
          deletePrinter: (printerId: string) => void;
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

    const addPrinter = async () => {
        try {
            let res = await axios.post('/settings/new-printer');
            setSettings(res.data.data);
            toast('Printer added', 'success');
        } catch (err) {
            toast(err as string, 'danger');
            throw err;
        }
    };

    const deletePrinter = async (printerId: string) => {
        try {
            let res = await axios.delete(`/settings/printer/${printerId}`);
            // let printers = settings?.printers.filter((p) => p.id !== printerId) ?? [];
            let newSettings = { ...settings, printers: res.data.data.printers };
            setSettings(newSettings);
            toast('Printer deleted', 'success');
        } catch (err) {
            toast(err as string, 'danger');
            throw err;
        }
    };

    return (
        <SettingsContext.Provider
            value={{ values: settings, updateSettings, updatePrinter, addPrinter, deletePrinter }}
        >
            {props.children}
        </SettingsContext.Provider>
    );
}
