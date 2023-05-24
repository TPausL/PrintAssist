import { useState } from 'react';
import classNames from 'classnames';
import styles from './part-select.module.scss';
import { Select2 } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';
import { PartType } from '../../types';
import parts from '../../../part-list.json';

export interface PartSelectProps {
    className?: string;
    onPartAdded: (part: PartType) => void;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelect = ({ className, onPartAdded }: PartSelectProps) => {
    console.log(parts);
    const [selectedPart, setSelectedPart] = useState<PartType | undefined>();
    console.log(selectedPart);
    return (
        <div className={classNames(styles.root, className)}>
            <Select2<PartType>
                filterable={false}
                items={parts}
                itemRenderer={(p, { handleClick, handleFocus }) => (
                    <MenuItem
                        onClick={handleClick}
                        onFocus={handleFocus}
                        key={p.name}
                        text={p.name}
                    />
                )}
                onItemSelect={(s) => {
                    console.log(s);
                    setSelectedPart(s);
                }}
            >
                <Button rightIcon="double-caret-vertical">
                    {selectedPart?.name ?? 'Select a part'}
                </Button>
            </Select2>
            <Button onClick={() => selectedPart && onPartAdded(selectedPart)} icon="add">
                {'Add'}
            </Button>
        </div>
    );
};
