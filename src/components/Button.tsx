import React from 'react';
import Spinner from './Spinner';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'medium',
  loading = false
}) => {
  const className = `btn btn-${variant} btn-${size}`;
  
  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;