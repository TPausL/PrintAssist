import { Menu, MenuDivider, MenuItem, Icon, Divider, IconName } from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import { ItemListRendererProps } from '@blueprintjs/select';
import classNames from 'classnames';
import { PartGroup, PartType } from '../../types';
import styles from './part-select-menu.module.scss';
import { filter, sortBy, upperFirst } from 'lodash';
import moment from 'moment';
import { render } from 'react-dom';
import { useState } from 'react';
import partList from "../../../part-list"


/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelectMenu = ({ renderItem, ...rest }: ItemListRendererProps<PartType>) => {
    console.log(rest, "rest");
    return (
        <Menu role="listbox" className={styles.root}>
            {sortBy(partList.groups, 'index').map((g,gi) => (
                <>
                    <div className={styles.menuGroupContainer}>
                        {g.icon && <Icon icon={g.icon as IconName} className={styles.groupIcon} size={43} />}
                        <span className={styles['group-headline']}>{upperFirst(g.name)}</span>
                    </div>
                        <Divider />
                    {renderItem && filter(partList.parts, (i) => i.group == g.id).map((p, i) => renderItem(p,gi+i) )}
                </>
            ))}
        </Menu>
    );
};
