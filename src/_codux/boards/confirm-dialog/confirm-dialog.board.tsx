import { createBoard } from '@wixc3/react-board';
import { ConfirmDialog } from '../../../components/confirm-dialog/confirm-dialog';

export default createBoard({
    name: 'ConfirmDialog',
    Board: () => <ConfirmDialog />,
    environmentProps: {
        windowWidth: 1024,
        windowHeight: 768,
    },
});
