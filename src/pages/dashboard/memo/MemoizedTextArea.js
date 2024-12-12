// components/MemoizedTextArea.js
import React, {memo} from 'react';

export const MemoizedTextArea = memo(
    ({value, onChange, disabled = true, rows = 5, textareaRef, field}) => (
        <textarea
            ref={textareaRef}
            value={value || ''}
            onInput={(e) => onChange(e.target.value)}
            disabled={disabled}
            rows={rows}
            className={`w-full px-4 py-2 rounded-lg border border-[#CDC1FF]/20 focus:ring-2 focus:ring-[#CDC1FF]/50 focus:border-transparent ${
                disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } transition-all duration-300`}
            data-field-id={field}
        />
    ),
);
