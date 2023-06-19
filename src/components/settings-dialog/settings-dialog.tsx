import classNames from 'classnames';
import styles from './settings-dialog.module.scss';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogProps,
    Divider,
    InputGroup,
    MenuItem,
    Spinner,
    Text,
} from '@blueprintjs/core';
import { Settings, Spool } from '../../types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePrinter, useSettings } from '../../contexts/contextHooks';
import { isEqual, omit, pick, set } from 'lodash';
import { Divide } from '@blueprintjs/icons/lib/esm/generated-icons/16px/paths';
import { Select2 } from '@blueprintjs/select';
import { toast } from '../../utils';

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
        if (printer?.spools?.selectedSpools) {
            setSpool(printer?.spools?.selectedSpools[0]);
        }
    }, [printer?.spools?.selectedSpools]);
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
        const spoolSettingsDirty = !isEqual(spool, printer?.spools?.selectedSpools[0]);
        if (conSettingsDirty) {
            console.log('submitting aapi connection');
            try {
                await settings?.updateSettings(values as Settings);
                setOpen(false);
            } catch (e) {}
        }
        console.log(spool, printer?.spools?.selectedSpools[0]);
        if (spoolSettingsDirty) {
            console.log('submitting spool');
            try {
                await printer?.selectSpool(spool?.databaseId as number);
                setOpen(false);
            } catch (e) {}
        }
        if (!conSettingsDirty && !spoolSettingsDirty) {
            toast('No changes were made', 'warning');
            setOpen(false);
        }
    };

    return (
        <Dialog {...rest} title={'Settings'} isOpen={open} onClose={() => setOpen(false)}>
            {!loading ? (
                <DialogBody>
                    <h3>Printer Connection</h3>
                    <div className={classNames(styles.root, styles.root)}>
                        <div className={styles['list-item']}>
                            <div>
                                <Text>Enter url of your server</Text>
                            </div>
                            <div>
                                <InputGroup
                                    value={values?.printer?.hostname}
                                    onChange={(e) =>
                                        setValues({
                                            ...(values as Settings),
                                            printer: {
                                                ...(values as Settings).printer,
                                                hostname: e.target.value,
                                            },
                                        })
                                    }
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
                                    value={values?.printer?.api_key}
                                    onChange={(e) =>
                                        setValues({
                                            ...(values as Settings),
                                            printer: {
                                                ...(values as Settings).printer,
                                                api_key: e.target.value,
                                            },
                                        })
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            submit();
                                        }
                                    }}
                                ></InputGroup>
                            </div>
                        </div>
                        <Divider></Divider>
                        <h3>Spool</h3>
                        <div className={styles['list-item']}>
                            <div>
                                <Text>Select which color to print in</Text>
                            </div>
                            <div>
                                <Select2
                                    items={printer?.spools?.allSpools as Spool[]}
                                    itemRenderer={(spool, { handleClick }) => (
                                        <MenuItem
                                            onClick={handleClick}
                                            role="listoption"
                                            text={spool.colorName}
                                        />
                                    )}
                                    onItemSelect={(spool) => setSpool(spool)}
                                >
                                    <Button text={spool?.colorName} />
                                </Select2>
                            </div>
                        </div>
                        <DialogFooter
                            minimal
                            actions={
                                <Button intent="success" onClick={submit}>
                                    save
                                </Button>
                            }
                        />
                    </div>
                </DialogBody>
            ) : (
                <Spinner></Spinner>
            )}
        </Dialog>
    );
};
