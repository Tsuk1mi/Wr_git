// Адаптировано из библиотеки shadcn/ui (https://ui.shadcn.com/docs/components/toast)
import { useState, useEffect, useCallback } from "react";

export type ToastProps = {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  actionAltText?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  onClose?: () => void;
};

export type Toast = ToastProps & {
  id: string;
  createdAt: number;
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000;

type ToasterToast = Toast & {
  visible: boolean;
  height?: number;
  position?: "bottom-right" | "top-right" | "top-center" | "bottom-center";
};

let count = 0;

function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();
const listeners: Array<(toast: ToasterToast) => void> = [];

let memoryToasts: ToasterToast[] = [];

function addToast(toast: ToastProps): Toast {
  const id = toast.id || generateId();
  const newToast: ToasterToast = {
    ...toast,
    id,
    createdAt: Date.now(),
    visible: true,
    position: "bottom-right",
  };

  const existingToast = memoryToasts.find((t) => t.id === id);
  if (existingToast) {
    memoryToasts = memoryToasts.map((t) => (t.id === id ? newToast : t));
  } else {
    memoryToasts = [newToast, ...memoryToasts].slice(0, TOAST_LIMIT);
  }

  listeners.forEach((listener) => {
    listener(newToast);
  });

  const timeout = setTimeout(() => {
    dismissToast(id);
  }, toast.duration || 5000);

  toastTimeouts.set(id, timeout);

  return newToast;
}

function updateToast(toast: ToastProps): Toast {
  if (!toast.id) {
    return addToast(toast);
  }

  const newToast: ToasterToast = {
    ...toast,
    id: toast.id,
    createdAt: Date.now(),
    visible: true,
    position: "bottom-right",
  };

  memoryToasts = memoryToasts.map((t) => (t.id === toast.id ? newToast : t));
  listeners.forEach((listener) => {
    listener(newToast);
  });

  return newToast;
}

function dismissToast(toastId: string) {
  memoryToasts = memoryToasts.map((t) =>
    t.id === toastId ? { ...t, visible: false } : t
  );

  listeners.forEach((listener) => {
    const toast = memoryToasts.find((t) => t.id === toastId);
    if (toast) listener(toast);
  });

  setTimeout(() => {
    memoryToasts = memoryToasts.filter((t) => t.id !== toastId);
    listeners.forEach((listener) => {
      listener({ id: toastId } as ToasterToast);
    });
  }, TOAST_REMOVE_DELAY);
}

function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>(memoryToasts);

  useEffect(() => {
    const listener = (toast: ToasterToast) => {
      setToasts((prevToasts) => {
        const existingToast = prevToasts.find((t) => t.id === toast.id);

        if (!existingToast) {
          return [...prevToasts, toast].slice(0, TOAST_LIMIT);
        }

        if (!("visible" in toast)) {
          return prevToasts.filter((t) => t.id !== toast.id);
        }

        return prevToasts.map((t) => (t.id === toast.id ? toast : t));
      });
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const dismiss = useCallback((toastId: string) => {
    const timeout = toastTimeouts.get(toastId);
    if (timeout) {
      clearTimeout(timeout);
      toastTimeouts.delete(toastId);
    }
    dismissToast(toastId);
  }, []);

  return {
    toasts,
    dismiss,
    toast: addToast,
    update: updateToast,
  };
}

export { useToast, addToast as toast, dismissToast, updateToast };
export type { Toast as ToastType };
