// react constext provider

import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { Settings } from '../types';
import { toast } from '../utils';
axios.defaults.baseURL = 'http://localhost:4000';

export const SettingsContext = createContext<
    { values?: Settings; updateSettings: (s: Settings) => void } | undefined
>(undefined);

export function SettingsContextProvider(props: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings | undefined>(undefined);
    useEffect(() => {
        axios.get('/settings').then((res) => {
            console.log('settings', res.data);
            setSettings(res.data);
        });
    }, []);
    useEffect(() => {
        console.log('settings changedddddd', settings);
    }, [settings]);
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
    return (
        <SettingsContext.Provider value={{ values: settings, updateSettings }}>
            {props.children}
        </SettingsContext.Provider>
    );
}
