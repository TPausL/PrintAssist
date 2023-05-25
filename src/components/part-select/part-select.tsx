import { useState } from 'react';
import classNames from 'classnames';
import styles from './part-select.module.scss';
import { Select2 } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';
import { PartType, PartGroup } from '../../types';
import parts from '../../../part-list.json';
import { PartSelectMenu } from '../part-select-menu/part-select-menu';

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
            <PartSelectMenu
                items={[
                    {
                        group: 'bikes',
                        index: 1,
                        items: [
                            {
                                file: 'bla',
                                name: 'Small',
                                price: 200,
                                time: 60,
                                weight: 5,
                            },
                            {
                                file: 'sdfsdf',
                                name: 'middle',
                                price: 6,
                                time: 300,
                                weight: 6,
                            },
                        ],
                        name: 'Test',
                        icon: 'presentation',
                    },
                ]}
            />
            <Select2<PartType>
                filterable={false}
                items={parts}
                itemListRenderer={PartSelectMenu}
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
