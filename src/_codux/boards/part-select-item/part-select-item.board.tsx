import { createBoard } from '@wixc3/react-board';
import { PartSelectItem } from '../../../components/part-select-item/part-select-item';

export default createBoard({
    name: 'PartSelectItem',
    Board: () => <PartSelectItem size="groß" />,
    environmentProps: {
        canvasWidth: 653,
        canvasHeight: 166,
    },
});
