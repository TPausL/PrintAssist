import { createElement, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './part-select.module.scss';
import { ItemListRendererProps, Select2 } from '@blueprintjs/select';
import { MenuItem, Button } from '@blueprintjs/core';
import { PartType, PartGroup } from '../../types';
import { PartSelectMenu } from '../part-select-menu/part-select-menu';
import { flatten, map } from 'lodash';
import { PartSelectItem } from '../part-select-item/part-select-item';
import partList from '../../../part-list.json';

export interface PartSelectProps {
    className?: string;
    onPartAdded: (part: PartType) => void;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelect = ({ className, onPartAdded }: PartSelectProps) => {
    const [selectedPart, setSelectedPart] = useState<PartType | undefined>();
    return (
        <div className={classNames(styles.root, className)}>
            <Select2<PartType>
                filterable={false}
                items={partList.parts}
                itemListRenderer={PartSelectMenu}
                itemRenderer={PartSelectItem}
                onItemSelect={(s) => {

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
