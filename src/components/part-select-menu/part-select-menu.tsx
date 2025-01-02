import { Menu, MenuDivider, MenuItem, Icon, Divider, IconName, Text } from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import { ItemListRendererProps } from '@blueprintjs/select';
import classNames from 'classnames';
import { PartGroup, PartType } from '../../types';
import styles from './part-select-menu.module.scss';
import { filter, sortBy, upperFirst } from 'lodash';
import moment from 'moment';
import { render } from 'react-dom';
import { useState } from 'react';
import partList from '../../../part-list.json';

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelectMenu = ({ renderItem, ...rest }: ItemListRendererProps<PartType>) => {
    return (
        <Menu className={styles.root}>
            {sortBy(partList.groups, 'index').map((g, gi) => (
                <>
                    <Text tagName="h3" className={styles.heading}>
                        {upperFirst(g.name)}
                    </Text>
                    {renderItem &&
                        filter(partList.parts, (i) => i.group == g.id).map((p, i) =>
                            renderItem(p as PartType, i + 1)
                        )}
                    {gi + 1 < partList.groups.length && <Divider className={styles.divider} />}
                </>
            ))}
        </Menu>
    );
};
