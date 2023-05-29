import classNames from 'classnames';
import styles from './part-select-item.module.scss';
import { Divider, Icon } from '@blueprintjs/core';
import moment from 'moment';
import { ItemRenderer, ItemRendererProps } from '@blueprintjs/select';
import { PartType } from '../../types';
import { upperFirst } from 'lodash';

export type PartSelectItemProps = ItemRenderer<PartType> & {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelectItem: ItemRenderer<PartType> = (p ,{ handleClick  }) => {

    return <><div className={styles.part} onClick={handleClick}>
                <div className={styles['part-top-row']}>
                    <span className={styles['part-name']}>{upperFirst(p.size)}</span>
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
            </>;
};
