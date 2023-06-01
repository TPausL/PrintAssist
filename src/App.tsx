import { Button } from '@blueprintjs/core';
import { filter, includes, isEqual, isEqualWith, map, merge, remove } from 'lodash';
import { useState } from 'react';
import styles from './App.module.scss';
import { PartList } from './components/part-list/part-list';
import { PartSelect } from './components/part-select/part-select';
import { slice } from './slicer';
import { ListPart, PartType } from './types';
import axios from "axios"

function App() {
    const [parts, setParts] = useState<ListPart[]>([]);

    return (
        <div className={styles.App}>
            <PartSelect
                onPartAdded={(part) => {
                    {
                        console.log(parts)
                        console.log(part)
                        
                        if (includes(map(parts, "name"), part.name)) {
                            const p = remove(parts, (p) => p.name.toLowerCase() == part.name.toLowerCase())[0];
                            setParts([...parts, {...p, count: p.count + 1}])
                        } else {
                            setParts([...parts, { ...part, count: 1 }]);
                        }
                    }
                }}
            />
            <PartList
                parts={parts}
                handlers={{
                    remove: (p) => setParts(filter(parts, (v) => !isEqual(v, p))),
                    count: (p,c) => {
                        console.log(c)
                        const i = parts.indexOf(p);
                        console.log(i)
                        parts[i] = {...parts[i], count: c}
                        console.log(parts)
                        setParts([...parts])
                    }
                }}

            />
            {Boolean(parts.length) && <Button onClick={async () => console.log(await axios.post("/slice", {parts })) }>print</Button>}
        </div>
    );
}

export default App;
