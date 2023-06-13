import classNames from 'classnames';
import styles from './settings-dialog.module.scss';
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogProps,
    InputGroup,
    Spinner,
    Text,
} from '@blueprintjs/core';
import { Settings } from '../../types';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
    const [settings, setSettings] = useState<Settings | undefined>(undefined);
    useEffect(() => {
        axios.get('http://localhost:3000/settings').then((res) => {
            setSettings(res.data);
            setLoading(false);
        });
    }, []);
    useEffect(() => {
        if (settings) {
            setLoading(false);
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

    return (
        <Dialog {...rest} title={'Settings'} isOpen={open} onClose={() => setOpen(false)}>
            {!loading ? (
                <DialogBody>
                    <div className={classNames(styles.root, styles.root)}>
                        <div className={styles['list-item']}>
                            <div>
                                <Text>Enter hostname of your server</Text>
                            </div>
                            <div>
                                <InputGroup
                                    value={settings?.printer.hostname}
                                    onChange={(e) =>
                                        setSettings({
                                            ...(settings as Settings),
                                            printer: {
                                                ...(settings as Settings).printer,
                                                hostname: e.target.value,
                                            },
                                        })
                                    }
                                ></InputGroup>
                            </div>
                        </div>
                        <div className={styles['list-item']}>
                            <div>
                                <Text>Enter api key of your server</Text>
                            </div>
                            <div>
                                <InputGroup
                                    value={settings?.printer.api_key}
                                    onChange={(e) =>
                                        setSettings({
                                            ...(settings as Settings),
                                            printer: {
                                                ...(settings as Settings).printer,
                                                api_key: e.target.value,
                                            },
                                        })
                                    }
                                ></InputGroup>
                            </div>
                        </div>
                        <DialogFooter
                            minimal
                            actions={
                                <Button
                                    intent="success"
                                    onClick={async () => {
                                        await axios.post(
                                            'http://localhost:3000/settings',
                                            settings
                                        );
                                        setOpen(false);
                                    }}
                                >
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
