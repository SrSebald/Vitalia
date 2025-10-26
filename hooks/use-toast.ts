import { toast as sonnerToast } from 'sonner';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function useToast() {
  const toast = ({ title, description, variant, action }: ToastProps) => {
    const message = title || description || '';
    const fullDescription = title && description ? description : undefined;

    if (variant === 'destructive') {
      sonnerToast.error(message, {
        description: fullDescription,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
    } else {
      sonnerToast.success(message, {
        description: fullDescription,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
      });
    }
  };

  return { toast };
}

