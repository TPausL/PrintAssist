import { createBoard } from '@wixc3/react-board';
import { PartSelectMenu } from '../../../components/part-select-menu/part-select-menu';

export default createBoard({
    name: 'PartSelectMenu',
    Board: () => <PartSelectMenu />
});
