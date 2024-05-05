import classNames from 'classnames';
import styles from './printer-settings-card.module.scss';
import { Card, H5, Navbar, TabId, Tabs, Tab, Colors, Icon } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { useBrowserStore, usePrinter, useSettings } from '../../contexts/contextHooks';
import { PrinterSettings } from '../printer-settings/printer-settings';
import { set } from 'lodash';
import { PrinterContext, PrinterContextProvider } from '../../contexts/PrinterContext';
import { Color } from 'three';

export interface PrinterSettingsCardProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */

export const PrinterSettingsCard = ({ className }: PrinterSettingsCardProps) => {
    const settings = useSettings();
    const browserStore = useBrowserStore();
    const [navbarTabId, setNavbarTabId] = useState<TabId | undefined>(undefined);
    const printer = usePrinter();
    const handlePrinterTabChange = (navbarTabId: TabId) => {
        setNavbarTabId(navbarTabId);
    };

    useEffect(() => {
        if (settings?.values?.printers) {
            if (settings?.values?.printers.length > 0) {
                if (!navbarTabId) setNavbarTabId(settings?.values?.printers[0].id);
            }
        }
    }, [settings]);
    return (
        <div className={classNames(styles.root, className)}>
            <Card elevation={3}>
                <H5>Drucker</H5>
                <Tabs
                    large
                    animate
                    id="printer-tabs"
                    onChange={handlePrinterTabChange}
                    selectedTabId={navbarTabId}
                >
                    {settings?.values?.printers.map((p) => (
                        <Tab
                            tagContent={browserStore?.currentPrinter === p.id ? 'Aktiv' : undefined}
                            icon={
                                <PrinterContextProvider printer={p}>
                                    <PrinterContext.Consumer>
                                        {(printer) => (
                                            <Icon
                                                style={{ marginRight: '5px' }}
                                                icon={'offline'}
                                                color={printer?.live ? Colors.GREEN2 : Colors.RED2}
                                            />
                                        )}
                                    </PrinterContext.Consumer>
                                </PrinterContextProvider>
                            }
                            key={p.id}
                            id={p.id}
                            //icon={browserStore?.currentPrinter === printer.id ? 'tick' : undefined}

                            panel={
                                <PrinterContextProvider printer={p}>
                                    <PrinterSettings printer={p} />
                                </PrinterContextProvider>
                            }
                        >
                            <span style={{ transform: 'translateY(-1px)' }}>{p.name}</span>
                        </Tab>
                    ))}
                    <Tabs.Expander />
                </Tabs>
            </Card>
        </div>
    );
};
