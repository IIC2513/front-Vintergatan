import Word from "./Word";
import './Board.css';
import { useState } from 'react';

export default function Board() {
    const [currentRow, setCurrentRow] = useState(0);

    const handleEnter = () => {
        setCurrentRow((prevRow) => prevRow + 1);
        const nextInput = document.getElementById(`input-${currentRow + 1}-0`);
        if (nextInput) {
            nextInput.focus();
        }
    };

    return (
        <>
            {[0, 1, 2, 3, 4, 5].map(row => (
                <div className="row" key={row}>
                    <Word row={row} onEnter={handleEnter} />
                </div>
            ))}
        </>
    );
}
