import { createBoard } from '@wixc3/react-board';
import { PartList } from '../../../components/part-list/part-list';

export default createBoard({
    name: 'PartList',
    Board: () => <PartList />,
    environmentProps: {
        canvasHeight: 106,
    },
});
