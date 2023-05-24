import { createBoard } from '@wixc3/react-board';
import { PartSelect } from '../../../components/part-select/part-select';

export default createBoard({
    name: 'PartSelect',
    Board: () => <PartSelect />
});
