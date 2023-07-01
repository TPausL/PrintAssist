import classNames from 'classnames';
import styles from './spool-color-picker.module.scss';
import { ItemRenderer, Select2 } from '@blueprintjs/select';
import { Spool } from '../../types';
import { Button, Icon, MenuItem, Spinner } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { usePrinter } from '../../contexts/contextHooks';
import { isEqual } from 'lodash';
import { Menu } from '@blueprintjs/icons/lib/esm/generated-icons/16px/paths';

export interface SpoolColorPickerProps {
    className?: string;
    onChange?: (spool: Spool) => void;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const SpoolColorPicker = ({ className, onChange }: SpoolColorPickerProps) => {
    const printer = usePrinter();
    console.log(printer?.spools);
    const [spool, setSpool] = useState<Spool | undefined>(undefined);

    useEffect(() => {
        if (printer?.spools) {
            if (printer?.spools?.selectedSpools?.length) {
                setSpool(printer.spools.selectedSpools[0]);
            } else if (
                !printer?.spools?.selectedSpools?.length &&
                printer?.spools?.allSpools?.length
            ) {
                printer?.selectSpool(printer.spools.allSpools[0].databaseId);
                setSpool(printer.spools.allSpools[0]);
            }
        }
    }, [printer?.spools]);

    useEffect(() => {
        if (spool) {
            onChange?.(spool);
            const spoolSettingsDirty = !isEqual(
                spool,
                printer?.spools?.selectedSpools ? printer.spools.selectedSpools[0] : undefined
            );
            if (spoolSettingsDirty) {
                printer?.selectSpool(spool.databaseId);
            }
        }
    }, [spool]);
    return (
        <Select2
            className={!printer?.spools?.allSpools?.length ? 'bp4-skeleton' : undefined}
            items={printer?.spools?.allSpools ?? []}
            itemRenderer={(spool, { handleClick }) => (
                <MenuItem
                    icon={<Icon icon="full-circle" color={spool.color} />}
                    onClick={handleClick}
                    role="listoption"
                    className={styles['color-item']}
                    //labelElement={<Icon icon="caret-right" />}
                    text={
                        <>
                            {' '}
                            {spool?.displayName}
                            <span style={{ color: '#9A9A9A' }}> - {spool?.remainingWeight}g</span>
                        </>
                    }
                >
                    <MenuItem icon="build" text={spool.vendor} />
                    <MenuItem icon="temperature" text={spool.temperature + '°C'} />
                    <MenuItem icon="new-object" text={spool.totalWeight + 'g'} />
                    <MenuItem icon="euro" text={spool.cost + '€'} />
                </MenuItem>
            )}
            onItemSelect={(spool) => setSpool(spool)}
            itemPredicate={(query, spool) =>
                spool.displayName.toLowerCase().includes(query.toLowerCase())
            }
        >
            <Button
                text={
                    <div className={classNames(styles['color-select-text'])}>
                        <Icon
                            icon="full-circle"
                            color={spool?.color}
                            className={styles['color-dot']}
                        />
                        <div className={styles['color-text']}>
                            <p
                                style={{
                                    alignItems: 'center',
                                    justifyItems: 'center',
                                    alignContent: 'center',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    marginBottom: 0,
                                }}
                            >
                                {spool?.displayName}
                                <span style={{ color: '#9A9A9A' }}>
                                    {' '}
                                    - {spool?.remainingWeight}g
                                </span>
                            </p>
                        </div>
                    </div>
                }
            />
        </Select2>
    );
};
