import { createElement, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './part-select.module.scss';
import { ItemListRendererProps, Select2 } from '@blueprintjs/select';
import { MenuItem, Button, Tabs, Tab, Icon } from '@blueprintjs/core';
import { PartType, PartGroup, PartSize } from '../../types';
import { PartSelectMenu } from '../part-select-menu/part-select-menu';
import { countBy, flatten, map, size, sum } from 'lodash';
import { PartSelectItem } from '../part-select-item/part-select-item';
import partList from '../../../part-list.json';
import { useMediaQuery } from 'react-responsive';

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
    const isMobile = useMediaQuery({ query: '(max-width: 1224px)' });
    const GetTab = (size: PartSize) => (
        <Tab
            key={size.id}
            id={size.id}
            title={isMobile ? size.name?.mobile ?? size.name.desktop : size.name.desktop}
            icon={
                size.icon && (
                    <div className={styles['tab-icon-wrapper']}>
                        <Icon {...size.icon} className={styles['tab-icon']} />
                    </div>
                )
            }
            tagProps={{ round: true }}
            tagContent={
                isMobile
                    ? undefined
                    : sum(map(partList.parts, (part) => (part.size == size.id ? 1 : 0)))
            }
            panel={<PartSelectItem onPartAdded={onPartAdded} size={size.id} />}
            panelClassName={styles['tab-panel']}
        />
    );

    return (
        <div className={classNames(styles.root, className)}>
            <Tabs vertical={!isMobile} large className={styles['part-select-tabs']}>
                {/* @ts-ignore */}
                {partList.sizes.map((size) => GetTab(size))}
            </Tabs>
        </div>
    );
};
