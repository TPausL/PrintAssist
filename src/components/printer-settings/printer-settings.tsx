import {
    Button,
    Checkbox,
    Divider,
    InputGroup,
    MenuItem,
    Tab,
    TabId,
    Tabs,
    Text,
} from '@blueprintjs/core';
import { Select2 } from '@blueprintjs/select';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useBrowserStore, usePrinter, useSettings } from '../../contexts/contextHooks';
import { Printer, PrinterFunction, PrinterType, ServerType } from '../../types';
import { toast } from '../../utils';
import functionButtons from '../function-buttons';
import styles from './printer-settings.module.scss';

export interface PrinterSettingsProps {
    className?: string;
    printer: Printer;
}

export const PrinterSettings = ({ className, printer }: PrinterSettingsProps) => {
    const browserStore = useBrowserStore();
    const settings = useSettings();

    const [innerTabId, setInnerTabId] = useState<TabId>('functions');

    const handleInnerTabChange = (innerTabId: TabId) => setInnerTabId(innerTabId);
    const submit = (p: Printer) => {
        settings?.updatePrinter(p);
    };

    const SetttingsPanel = () => {
        const [changedPrinter, setChangedPrinter] = useState<Printer>(printer);
        const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
        useEffect(() => {
            if (!isEqual(changedPrinter, printer)) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    submit(changedPrinter);
                }, 1500);
            }
        }, [changedPrinter]);

        return (
            <>
                <div className={styles['list-item']}>
                    <div>
                        <Text>Name</Text>
                    </div>
                    <div>
                        <InputGroup
                            value={changedPrinter.name}
                            onChange={(e) => {
                                setChangedPrinter({ ...changedPrinter, name: e.target.value });
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') submit(changedPrinter);
                            }}
                        />
                    </div>
                </div>
                <div className={styles['list-item']}>
                    <div>
                        <Text>Hostname</Text>
                    </div>
                    <div>
                        <InputGroup
                            value={changedPrinter.hostname}
                            onChange={(e) => {
                                setChangedPrinter({ ...changedPrinter, hostname: e.target.value });
                            }}
                            onKeyDown={(e) => {
                                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                if (e.key === 'Enter') submit(changedPrinter);
                            }}
                        />
                    </div>
                </div>
                <div className={styles['list-item']}>
                    <div>
                        <Text>API Key</Text>
                    </div>
                    <div>
                        <InputGroup
                            value={changedPrinter.api_key}
                            onChange={(e) => {
                                setChangedPrinter({ ...changedPrinter, api_key: e.target.value });
                            }}
                            onKeyDown={(e) => {
                                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                if (e.key === 'Enter') submit(changedPrinter);
                            }}
                        />
                    </div>
                </div>
                <div className={styles['list-item']}>
                    <div>
                        <Text>Druckertyp</Text>
                    </div>
                    <div>
                        <Select2
                            items={Object.values(PrinterType)}
                            itemRenderer={(item, { handleClick }) => (
                                <MenuItem
                                    key={item}
                                    onClick={handleClick}
                                    role="listoption"
                                    text={item}
                                />
                            )}
                            onItemSelect={(item) => {
                                setChangedPrinter({ ...changedPrinter, printerType: item });
                            }}
                        >
                            <Button text={printer.printerType} rightIcon="double-caret-vertical" />
                        </Select2>
                    </div>
                </div>
                <div className={styles['list-item']}>
                    <div>
                        <Text>Servertyp</Text>
                    </div>
                    <div>
                        <Select2
                            items={Object.values(ServerType)}
                            itemRenderer={(item, { handleClick }) => (
                                <MenuItem
                                    key={item}
                                    onClick={handleClick}
                                    role="listoption"
                                    text={item}
                                />
                            )}
                            onItemSelect={(item) => {
                                setChangedPrinter({ ...changedPrinter, serverType: item });
                            }}
                        >
                            <Button text={printer.serverType} rightIcon="double-caret-vertical" />
                        </Select2>
                    </div>
                </div>
                <Divider />
                <div className={styles['list-item']}>
                    <div>
                        <Text>Funktionen</Text>
                    </div>
                    <div>
                        {Object.values(PrinterFunction).map((f) => (
                            <Checkbox
                                checked={changedPrinter?.functions?.includes(f)}
                                label={f}
                                onChange={(e) => {
                                    let newFunctions = [...(changedPrinter?.functions ?? [])];
                                    //@ts-ignore
                                    if (e.target.checked) {
                                        newFunctions.push(f);
                                    } else {
                                        newFunctions = newFunctions.filter((x) => x !== f);
                                    }
                                    setChangedPrinter({
                                        ...changedPrinter,
                                        functions: newFunctions,
                                    });
                                }}
                            />
                        ))}
                    </div>
                </div>
                <Button
                    intent="danger"
                    large
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this printer?')) {
                            settings?.deletePrinter(printer.id);
                        }
                    }}
                    style={{ marginTop: 24 }}
                >
                    Delete Printer
                </Button>
            </>
        );
    };

    const FunctionsPanel = () => {
        const p = usePrinter();

        if (p?.live) {
            return (
                <>
                    <div className={styles['list-item']}>
                        <div></div>
                    </div>
                    <div className={styles['button-container']}>
                        {printer.functions?.map((f) => {
                            //@ts-ignore
                            return functionButtons[f];
                        })}
                    </div>
                </>
            );
        } else {
            return (
                <div className={styles['list-item']}>
                    <div>
                        <Text>
                            Drucker nicht eingeschaltet! Schalte den Drucker ein um die Funktionen
                            zu verwenden oder überprüfe die Verbindungseinstellungen
                        </Text>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={classNames(styles.root, className)}>
            <Button
                intent={browserStore?.currentPrinter == printer.id ? 'none' : 'primary'}
                disabled={browserStore?.currentPrinter == printer.id}
                large
                onClick={() => {
                    if (browserStore?.currentPrinter == printer.id) {
                        toast((printer?.name ?? printer.hostname) + ' bereits aktiv!', 'warning');
                    } else {
                        browserStore?.setCurrentPrinter(printer.id);
                        toast((printer?.name ?? printer.hostname) + ' ausgewählt!', 'success');
                    }
                }}
                style={{ marginBottom: 24 }}
            >
                Zum Drucken benutzen
            </Button>
            <Tabs
                animate={false}
                fill
                id="navbar"
                onChange={handleInnerTabChange}
                selectedTabId={innerTabId}
            >
                <Tab icon="build" id="functions" panel={<FunctionsPanel />}>
                    <span style={{ transform: 'translateY(-1px)' }}>Funktionen</span>
                </Tab>
                <Tab icon="cog" id="settings" panel={<SetttingsPanel />}>
                    <span style={{ transform: 'translateY(-1px)' }}>Einstellungen</span>
                </Tab>
            </Tabs>
        </div>
    );
};
