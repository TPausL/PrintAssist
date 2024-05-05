import {
    Button,
    Checkbox,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogProps,
    Divider,
    InputGroup,
    Spinner,
    Text,
} from '@blueprintjs/core';
import classNames from 'classnames';
import { isEqual, pickBy, toArray } from 'lodash';
import { useEffect, useState } from 'react';
import { usePrinter, useSettings } from '../../contexts/contextHooks';
import { PrinterFunction, Settings, Spool } from '../../types';
import styles from './settings-dialog.module.scss';

export interface SettingsDialogProps extends Omit<DialogProps, 'title' | 'onClosed'> {
    className?: string;
    onClosed?: () => void;
}

/*
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SettingsDialog = ({ className, isOpen, onClosed, ...rest }: SettingsDialogProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const settings = useSettings();
    const [values, setValues] = useState<Settings | undefined>(undefined);
    const printer = usePrinter();
    const [spool, setSpool] = useState<Spool | undefined>(
        printer?.spools?.selectedSpools ? printer?.spools?.selectedSpools[0] : undefined
    );

    useEffect(() => {
        if (settings) {
            setLoading(false);
            setValues(settings.values);
        }
    }, [settings]);
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);
    useEffect(() => {
        if (!open) {
            onClosed?.();
        }
    }, [open]);

    const submit = async () => {
        const conSettingsDirty = !isEqual(values, settings?.values);

        if (conSettingsDirty) {
            try {
                await settings?.updateSettings(values as Settings);
            } catch (e) {}
        }
        setOpen(false);
    };

    return (
        <Dialog {...rest} title={'Settings'} isOpen={open} onClose={() => setOpen(false)}>
            {!loading ? (
                <DialogBody>
                    <h1>Printer Connections</h1>
                    {values?.printers?.map((printer, i) => (
                        <>
                            <h3>{printer.name ?? printer.serverType}</h3>
                            <div className={classNames(styles.root, styles.root)}>
                                <div className={styles['list-item']}>
                                    <div>
                                        <Text>Enter url of your server</Text>
                                    </div>
                                    <div>
                                        <InputGroup
                                            value={printer?.hostname}
                                            onChange={(e) => {
                                                let before = toArray(
                                                    pickBy(
                                                        values.printers,
                                                        (p, index) => parseInt(index) < i
                                                    )
                                                );

                                                let after = toArray(
                                                    pickBy(
                                                        values.printers,
                                                        (p, index) => parseInt(index) > i
                                                    )
                                                );

                                                setValues({
                                                    ...(values as Settings),
                                                    printers: [
                                                        ...before,
                                                        {
                                                            ...values.printers[i],
                                                            hostname: e.target.value,
                                                        },
                                                        ...after,
                                                    ],
                                                });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    submit();
                                                }
                                            }}
                                        ></InputGroup>
                                    </div>
                                </div>
                                <div className={styles['list-item']}>
                                    <div>
                                        <Text>Enter api key of your server</Text>
                                    </div>
                                    <div>
                                        <InputGroup
                                            value={printer?.api_key}
                                            onChange={(e) => {
                                                let before = toArray(
                                                    pickBy(
                                                        values.printers,
                                                        (p, index) => parseInt(index) < i
                                                    )
                                                );

                                                let after = toArray(
                                                    pickBy(
                                                        values.printers,
                                                        (p, index) => parseInt(index) > i
                                                    )
                                                );

                                                setValues({
                                                    ...(values as Settings),
                                                    printers: [
                                                        ...before,
                                                        {
                                                            ...values.printers[i],
                                                            api_key: e.target.value,
                                                        },
                                                        ...after,
                                                    ],
                                                });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    submit();
                                                }
                                            }}
                                        ></InputGroup>
                                    </div>
                                </div>
                                <div className={styles['list-item']}>
                                    <div>
                                        <Text>Chosse supported functions</Text>
                                    </div>
                                    <div>
                                        {Object.keys(PrinterFunction).map((f) => (
                                            <Checkbox
                                                checked={printer.functions.includes(
                                                    f as PrinterFunction
                                                )}
                                                label={f}
                                                onChange={(e) => {
                                                    //@ts-ignore
                                                    let before = toArray(
                                                        pickBy(
                                                            values.printers,
                                                            (p, index) => parseInt(index) < i
                                                        )
                                                    );
                                                    let functions = [
                                                        ...values.printers[i].functions,
                                                    ];
                                                    if (functions.includes(f as PrinterFunction)) {
                                                        functions.splice(
                                                            functions.indexOf(f as PrinterFunction),
                                                            1
                                                        );
                                                    } else {
                                                        functions.push(f as PrinterFunction);
                                                    }

                                                    let after = toArray(
                                                        pickBy(
                                                            values.printers,
                                                            (p, index) => parseInt(index) > i
                                                        )
                                                    );

                                                    setValues({
                                                        ...(values as Settings),
                                                        printers: [
                                                            ...before,
                                                            {
                                                                ...values.printers[i],
                                                                functions,
                                                            },
                                                            ...after,
                                                        ],
                                                    });
                                                }}
                                            ></Checkbox>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {i < values.printers.length - 1 && (
                                <Divider style={{ borderWidth: 5 }}></Divider>
                            )}
                        </>
                    ))}
                    <DialogFooter
                        minimal
                        actions={
                            <Button intent="success" onClick={submit}>
                                save
                            </Button>
                        }
                    />
                </DialogBody>
            ) : (
                <Spinner></Spinner>
            )}
        </Dialog>
    );
};
