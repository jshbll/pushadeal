import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  color: transparent;
  background-color: transparent;
  caret-color: #4f46e5;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const EmojiDisplay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  pointer-events: none;
  gap: 4px;
`;

const SpinningEmoji = styled.span<{ delay: number }>`
  display: inline-block;
  animation: ${spin} 1s infinite linear;
  animation-delay: ${props => props.delay}s;
  font-size: 1rem;
  line-height: 1;
`;

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
    const emojis = value.split('').map(() => '🔒');
    setDisplayValue(emojis);
  }, [value]);

  return (
    <Container>
      <EmojiDisplay>
        {displayValue.map((emoji, index) => (
          <SpinningEmoji key={index} delay={index * 0.1}>
            {emoji}
          </SpinningEmoji>
        ))}
      </EmojiDisplay>
      <Input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Container>
  );
};

export default AnimatedPasswordInput;
