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

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <Login>
        <SettingsContextProvider>
            <PrinterContextProvider>
                <App />
            </PrinterContextProvider>
        </SettingsContextProvider>
    </Login>
);
