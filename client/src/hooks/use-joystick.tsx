import { useEffect } from "react";

interface JoystickCallbacks {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onSelect?: () => void;
}

export function useJoystick(callbacks: JoystickCallbacks) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle joystick events for menu navigation
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') {
        return; // Don't interfere with input fields
      }

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          callbacks.onUp?.();
          break;
        case "ArrowDown":
          e.preventDefault();
          callbacks.onDown?.();
          break;
        case "ArrowLeft":
          e.preventDefault();
          callbacks.onLeft?.();
          break;
        case "ArrowRight":
          e.preventDefault();
          callbacks.onRight?.();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          callbacks.onSelect?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [callbacks]);
}
