import { createBoard } from '@wixc3/react-board';
import { PartSelectItem } from '../../../components/part-select-item/part-select-item';

export default createBoard({
    name: 'PartSelectItem 1',
    Board: () => <PartSelectItem />
});
