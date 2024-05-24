import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import { SettingsContextProvider } from './contexts/SettingsContext';
import { PrinterContextProvider } from './contexts/PrinterContext';
import { Login } from './components/login/login';
import moment from 'moment';
import 'moment/dist/locale/de';
import { BrowserStoreContextProvider } from './contexts/BrowserStoreContext';
import PrinterWrapper from './PrinterWrapper';

moment.locale('de');

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <>
        <BrowserStoreContextProvider>
            <SettingsContextProvider>
                <PrinterWrapper />
            </SettingsContextProvider>
        </BrowserStoreContextProvider>
    </>
);
