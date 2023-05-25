import { Menu, MenuDivider, MenuItem, Icon, Divider } from '@blueprintjs/core';
import { MenuItem2 } from '@blueprintjs/popover2';
import { ItemListRendererProps } from '@blueprintjs/select';
import classNames from 'classnames';
import { PartGroup, PartType } from '../../types';
import styles from './part-select-menu.module.scss';
import { sortBy } from 'lodash';
import moment from 'moment';
import { render } from 'react-dom';

export type PartSelectMenuProps = ItemListRendererProps<PartGroup> & {
    className?: string;
};

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelectMenu = ({ className, items, renderItem }: PartSelectMenuProps) => {
    return (
        <Menu role="listbox" className={classNames(styles.root, className)}>
            {sortBy(items, 'index').map((g) => (
                <>
                    <div className={styles.menuGroupContainer}>
                        {g.icon && <Icon icon={g.icon} className={styles.groupIcon} size={43} />}
                        <span className={styles['group-headline']}>{g.name}</span>
                    </div>
                        <Divider />
                    {g.items.map((p, i) => (        <>
            <div className={styles.part}>
                <div className={styles['part-top-row']}>
                    <span className={styles['part-name']}>{p.name}</span>
                </div>
                <div className={styles['part-right-col']}>
                    <span className={styles['part-time']}>
                        <Icon icon={'time'} className={styles.icon} />
                        {moment.duration(p.time, 's').humanize()}
                    </span>
                    <span className={styles['part-weight']}>
                        <Icon icon={'dot'} className={styles.icon} />
                        {p.weight}g
                    </span>
                    <span className={styles['part-price']}>
                        <Icon icon={'euro'} className={styles.icon} />
                        {p.price.toFixed(2)}
                    </span>
                </div>
            </div>
            <Divider className={styles['part-divider']} />
        </>))}
                </>
            ))}
        </Menu>
    );
};
