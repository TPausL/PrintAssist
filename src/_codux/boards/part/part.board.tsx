import { createBoard } from '@wixc3/react-board';
import { Part } from '../../../components/part/part';

export default createBoard({
    name: 'Part',
    Board: () => <Part />
});
