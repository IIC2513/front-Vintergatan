import { useState } from 'react';
import PropTypes from 'prop-types';

export default function Word({ row, onEnter }) {
    const [values, setValues] = useState(Array(5).fill(""));
    const [locked, setLocked] = useState(false);

    const handleChange = (value, index) => {
        if (!locked && /^[a-zA-Z]$/.test(value)) {
            const newValues = [...values];
            newValues[index] = value;
            setValues(newValues);
            if (index < values.length - 1) {
                document.getElementById(`input-${row}-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (locked) return;

        if (e.key === "Backspace") {
            const newValues = [...values];
            
            if (index === values.length - 1 && values[index]) {
                newValues[index] = "";
            } else if (!values[index] && index > 0) {
                newValues[index - 1] = "";
                document.getElementById(`input-${row}-${index - 1}`).focus();
            }
            setValues(newValues);
        } else if (e.key === "Enter" && values.every(value => value !== "")) {
            setLocked(true);
            onEnter();
        }
    };

    return (
        <div className="row">
            {values.map((value, index) => (
                <input
                    key={index}
                    id={`input-${row}-${index}`}
                    value={value}
                    onChange={e => handleChange(e.target.value, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    maxLength="1"
                    disabled={locked}
                />
            ))}
        </div>
    );
}

Word.propTypes = {
    row: PropTypes.any.isRequired,  // roomId puede ser cualquier cosa
    onEnter: PropTypes.any.isRequired,  // players también puede ser cualquier cosa
  };