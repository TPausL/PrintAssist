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

    return (
        <div className={classNames(styles.root, className)}>
            <Tabs vertical={!isMobile} large className={styles['part-select-tabs']}>
                <Tab
                    id={'klein'}
                    title={
                        <>
                            Klein {!isMobile && <span style={{ opacity: '50%' }}> - 3cm</span>}
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
                    tagContent={isMobile ? undefined: sum(map(partList.parts, (part) => (part.size == 'klein' ? 1 : 0)))}
                    panel={<PartSelectItem onPartAdded={onPartAdded} size={'klein'} />}
                    panelClassName={styles['tab-panel']}
                />
                <Tab
                    id={'mittel'}
                    title={
                        <>
                            Mittel{!isMobile && <span style={{ opacity: '50%' }}> - 4cm</span>}
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
                    tagContent={isMobile ? undefined: sum(map(partList.parts, (part) => (part.size == 'mittel' ? 1 : 0)))}
                    panel={<PartSelectItem onPartAdded={onPartAdded} size={'mittel'} />}
                    panelClassName={styles['tab-panel']}
                />{' '}
                <Tab
                    id={'gross'}
                    title={
                        <>
                            Groß{!isMobile && <span style={{ opacity: '50%' }}> - 5cm</span>}
                        </>
                    }
                    icon={
                        <div className={styles['tab-icon-wrapper']}>
                            <Icon icon={'arrows-vertical'} size={24} />
                        </div>
                    }
                    tagContent={isMobile ? undefined: sum(map(partList.parts, (part) => (part.size == 'groß' ? 1 : 0)))}
                    panel={<PartSelectItem onPartAdded={onPartAdded} size={'groß'} />}
                    panelClassName={styles['tab-panel']}
                />
            </Tabs>
        </div>
    );
};
