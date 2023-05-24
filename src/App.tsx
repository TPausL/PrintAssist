import { useState } from 'react';
import styles from './App.module.scss';
import { PartList } from './components/part-list/part-list';
import { PartSelect } from './components/part-select/part-select';
import { PartType } from './types';

function App() {
   
    const [parts, setParts] = useState<PartType[]>([]);

    return (
        <div className={styles.App}>
            <PartSelect onPartAdded={(part) => setParts([...parts, part])} />
            <PartList
                parts={parts}
            />
        </div>
    );
}

export default App;
