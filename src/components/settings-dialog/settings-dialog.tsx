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
import { SpoolColorPicker } from '../spool-color-picker/spool-color-picker';

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
                                <SpoolColorPicker />
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
