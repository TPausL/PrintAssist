import classNames from 'classnames';
import { Icon, MenuItem, Text } from '@blueprintjs/core';
import moment from 'moment';
import { ItemRenderer, ItemRendererProps } from '@blueprintjs/select';
import { PartType } from '../../types';
import { upperFirst } from 'lodash';
import PartSelectItem_module from './part-select-item.module.scss';

export type PartSelectItemProps = ItemRenderer<PartType> & {
    className?: string;
};

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const PartSelectItem: ItemRenderer<PartType> = (p, { handleClick, index, handleFocus }) => {
    return (
        <MenuItem
            key={index}
            label={p.price + '€'}
            onClick={handleClick}
            onFocus={handleFocus}
            roleStructure="listoption"
            text={`${index}. ${p.name}`}
            style={{ paddingLeft: '1rem' }}
        />
    );
};
