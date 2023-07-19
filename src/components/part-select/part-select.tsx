import { createElement, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './part-select.module.scss';
import { ItemListRendererProps, Select2 } from '@blueprintjs/select';
import { MenuItem, Button, Tabs, Tab, Icon } from '@blueprintjs/core';
import { PartType, PartGroup } from '../../types';
import { PartSelectMenu } from '../part-select-menu/part-select-menu';
import { countBy, flatten, map, size, sum } from 'lodash';
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
            <Tabs vertical large className={styles['part-select-tabs']}>
                <Tab
                    id={'klein'}
                    title={
                        <>
                            Klein<span style={{ opacity: '50%' }}> - 3cm</span>
                        </>
                    }
                    icon={
                        <div className={styles['tab-icon-wrapper']}>
                            <Icon
                                icon={'arrows-vertical'}
                                size={16}
                                className={styles['tab-icon']}
                            />
                        </div>
                    }
                    tagContent={sum(map(partList.parts, (part) => (part.size == 'klein' ? 1 : 0)))}
                    panel={<PartSelectItem onPartAdded={onPartAdded} size={'klein'} />}
                    panelClassName={styles['tab-panel']}
                />
                <Tab
                    id={'mittel'}
                    title={
                        <>
                            Mittel<span style={{ opacity: '50%' }}> - 4cm</span>
                        </>
                    }
                    icon={
                        <div className={styles['tab-icon-wrapper']}>
                            <Icon
                                icon={'arrows-vertical'}
                                size={20}
                                className={styles['tab-icon']}
                            />
                        </div>
                    }
                    tagContent={sum(map(partList.parts, (part) => (part.size == 'mittel' ? 1 : 0)))}
                    panel={<PartSelectItem onPartAdded={onPartAdded} size={'mittel'} />}
                    panelClassName={styles['tab-panel']}
                />{' '}
                <Tab
                    id={'gross'}
                    title={
                        <>
                            Groß<span style={{ opacity: '50%' }}> - 5cm</span>
                        </>
                    }
                    icon={
                        <div className={styles['tab-icon-wrapper']}>
                            <Icon icon={'arrows-vertical'} size={24} />
                        </div>
                    }
                    tagContent={sum(map(partList.parts, (part) => (part.size == 'groß' ? 1 : 0)))}
                    panel={<PartSelectItem onPartAdded={onPartAdded} size={'groß'} />}
                    panelClassName={styles['tab-panel']}
                />
            </Tabs>
        </div>
    );
};
