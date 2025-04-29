"use client";

import { useToast } from "./use-toast";
import { X } from "lucide-react";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex flex-col items-end p-4 gap-2 max-h-screen overflow-hidden">
      {toasts
        .filter((toast) => toast.visible)
        .map((toast) => (
          <div
            key={toast.id}
            className={`${
              toast.visible ? "animate-in fade-in-50 slide-in-from-bottom-5" : "animate-out fade-out-0 slide-out-to-right-5"
            } group pointer-events-auto relative flex w-full max-w-md items-center justify-between space-x-4 overflow-hidden rounded-md border p-5 shadow-lg transition-all
            ${
              toast.variant === "destructive"
                ? "border-destructive bg-destructive text-destructive-foreground"
                : toast.variant === "success"
                ? "border-green-500 bg-green-500 text-white dark:border-green-600 dark:bg-green-600"
                : "border-border bg-background text-foreground"
            }`}
          >
            <div className="flex flex-col gap-1">
              {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
              {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
            </div>
            <button
              onClick={() => {
                dismiss(toast.id);
                toast.onClose?.();
              }}
              className={`${
                toast.variant === "destructive" || toast.variant === "success"
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-foreground"
              } inline-flex shrink-0 rounded-md p-1 transition-colors focus:outline-none`}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        ))}
    </div>
  );
}
