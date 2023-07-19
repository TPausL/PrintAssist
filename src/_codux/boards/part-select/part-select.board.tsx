import { createBoard } from '@wixc3/react-board';
import { PartSelect } from '../../../components/part-select/part-select';
import React from 'react';

export default createBoard({
    name: 'PartSelect',
    Board: () => <PartSelect onPartAdded={() => {}} />,
    environmentProps: {
        canvasWidth: 847,
        canvasHeight: 304,
    },
});
