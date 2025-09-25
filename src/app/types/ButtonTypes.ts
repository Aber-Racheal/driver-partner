// src/types/ButtonTypes.ts

// Define the possible variants for the button
export type ButtonVariant = 'primary' | 'secondary' | 'danger';

// Define the structure of props that our Button component will accept
export interface ButtonProps {
  text: string;                // Button text (required)
  onClick?: () => void;        // Click handler (optional)
  variant?: ButtonVariant;     // Button style variant (primary, secondary, danger) (optional)
  className?: string;          // Extra classes if you want to customize button further (optional)
  disabled?: boolean;          // Disable button if true (optional)
}
