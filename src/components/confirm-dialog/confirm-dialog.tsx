import classNames from 'classnames';
import styles from './confirm-dialog.module.scss';
import { Button, Dialog, DialogBody, DialogFooter, DialogProps, Text } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { set } from 'lodash';
import SettingsDialog_module from '../settings-dialog/settings-dialog.module.scss';
import { SpoolColorPicker } from '../spool-color-picker/spool-color-picker';

export interface ConfirmDialogProps extends Omit<DialogProps, 'title' | 'onClosed'> {
    className?: string;
    onClosed?: () => void;
    onCanceled?: () => void;
    onConfirmed?: () => void;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const ConfirmDialog = ({
    className,
    isOpen,
    onClosed,
    onCanceled,
    onConfirmed,
    ...props
}: ConfirmDialogProps) => {
    const [open, setOpen] = useState<boolean>(true);
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen]);
    useEffect(() => {
        if (!open) {
            onClosed?.();
        }
    }, [open]);
    return (
        <Dialog isOpen={open} title="Confirm starting print!" onClose={() => setOpen(false)}>
            <DialogBody>
                <div className={SettingsDialog_module['list-item']}>
                    <Text>What color do you want to print in?</Text>
                    <SpoolColorPicker />
                </div>
            </DialogBody>
            <DialogFooter
                actions={[
                    <Button intent="danger" onClick={onCanceled}>
                        Cancel
                    </Button>,
                    <Button intent="success" onClick={onConfirmed}>
                        Confirm
                    </Button>,
                ]}
            />
        </Dialog>
    );
};
