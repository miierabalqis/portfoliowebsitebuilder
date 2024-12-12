import React, {memo} from 'react';

export const MemoizedInput = memo(
    ({
        type = 'text',
        value,
        onChange,
        disabled = true,
        className = '',
        field,
        inputRef,
    }) => (
        <input
            ref={inputRef}
            type={type}
            value={value || ''}
            onInput={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-4 py-2 rounded-lg border border-[#CDC1FF]/20 focus:ring-2 focus:ring-[#CDC1FF]/50 focus:border-transparent ${
                disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
            } transition-all duration-300 ${className}`}
            data-field-id={field}
        />
    ),
);
