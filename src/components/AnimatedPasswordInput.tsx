import React, { useState, useEffect } from 'react';
import './AnimatedPasswordInput.css';

interface AnimatedPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AnimatedPasswordInput: React.FC<AnimatedPasswordInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter password'
}) => {
  const [displayValue, setDisplayValue] = useState<string[]>([]);

  useEffect(() => {
    // Convert password to array of spinning emojis
    const emojis = value.split('').map(() => '🔒');
    setDisplayValue(emojis);
  }, [value]);

  return (
    <div className="animated-password-container">
      <div className="emoji-display">
        {displayValue.map((emoji, index) => (
          <span
            key={index}
            className="spinning-emoji"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {emoji}
          </span>
        ))}
      </div>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="password-input"
      />
    </div>
  );
};

export default AnimatedPasswordInput;
