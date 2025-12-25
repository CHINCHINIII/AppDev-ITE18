import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  icon: LucideIcon;
  label?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  compact?: boolean;
}

export function ActionButton({ 
  onClick,
  icon: Icon,
  label,
  variant = 'primary',
  className = '',
  compact = false
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`action-button-compact ${isPrimary ? 'primary' : 'secondary'} ${className}`}
        aria-label={label}
      >
        <Icon className="action-button-icon" size={16} />
        
        <style>{`
          .action-button-compact {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            box-shadow: 0 4px 12px rgba(0, 208, 132, 0.2);
            position: relative;
            overflow: hidden;
          }

          .action-button-compact.primary {
            background: linear-gradient(135deg, #00D084, #00966A);
            color: white;
          }

          .action-button-compact.secondary {
            background: white;
            color: #00D084;
            border: 2px solid #00D084;
            box-shadow: 0 4px 12px rgba(0, 208, 132, 0.15);
          }

          .action-button-compact::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
            transform: scale(0);
            transition: transform 0.4s ease-out;
          }

          .action-button-compact:hover::before {
            transform: scale(1);
          }

          .action-button-compact:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 208, 132, 0.3);
          }

          .action-button-compact.secondary:hover {
            background: linear-gradient(135deg, #00D084, #00966A);
            color: white;
            border-color: #00D084;
          }

          .action-button-compact:active {
            transform: scale(1.05);
          }

          .action-button-icon {
            transition: transform 0.3s ease;
          }

          @media (max-width: 640px) {
            .action-button-compact {
              width: 32px;
              height: 32px;
            }
          }
        `}</style>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`action-button-full ${isPrimary ? 'primary' : 'secondary'} ${className}`}
    >
      <Icon className="action-button-full-icon" size={18} />
      {label && <span className="action-button-label">{label}</span>}
      
      <style>{`
        .action-button-full {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          position: relative;
          overflow: hidden;
          min-height: 44px;
        }

        .action-button-full.primary {
          background: linear-gradient(135deg, #00D084, #00966A);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 208, 132, 0.2);
        }

        .action-button-full.secondary {
          background: white;
          color: #00D084;
          border: 2px solid #00D084;
          box-shadow: 0 4px 12px rgba(0, 208, 132, 0.15);
        }

        .action-button-full::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
          transform: scale(0);
          transition: transform 0.4s ease-out;
        }

        .action-button-full:hover::before {
          transform: scale(1);
        }

        .action-button-full:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 208, 132, 0.3);
        }

        .action-button-full.secondary:hover {
          background: linear-gradient(135deg, #00D084, #00966A);
          color: white;
          border-color: #00D084;
        }

        .action-button-full:active {
          transform: translateY(0);
        }

        .action-button-full-icon {
          transition: transform 0.3s ease;
          z-index: 1;
        }

        .action-button-label {
          font-weight: 500;
          z-index: 1;
        }

        @media (max-width: 640px) {
          .action-button-full {
            padding: 10px 20px;
            min-height: 40px;
          }
        }
      `}</style>
    </button>
  );
}
