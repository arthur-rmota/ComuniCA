import { useEffect, useState } from "react";

const KEYBOARD_THRESHOLD = 120;

function isEditableElement(
  element: Element | null,
): boolean {
  if (element instanceof HTMLInputElement) {
    return (
      !element.readOnly &&
      !element.disabled &&
      [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "search",
        "url",
      ].includes(element.type)
    );
  }

  if (element instanceof HTMLTextAreaElement) {
    return !element.readOnly && !element.disabled;
  }

  return (
    element instanceof HTMLElement &&
    element.isContentEditable
  );
}

export function useVirtualKeyboard(): boolean {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;

    let referenceHeight = window.innerHeight;
    let referenceWidth = window.innerWidth;
    let frameId = 0;

    function update() {
      const visibleHeight = viewport
        ? viewport.height * viewport.scale
        : window.innerHeight;

      const hasEditableFocus = isEditableElement(
        document.activeElement,
      );

      // Recalcula a referência ao girar o dispositivo.
      if (window.innerWidth !== referenceWidth) {
        referenceWidth = window.innerWidth;
        referenceHeight = window.innerHeight;
      }

      if (!hasEditableFocus) {
        referenceHeight = Math.max(
          referenceHeight,
          window.innerHeight,
          visibleHeight,
        );

        setKeyboardOpen(false);
        return;
      }

      const heightDifference =
        Math.max(referenceHeight, window.innerHeight) -
        visibleHeight;

      setKeyboardOpen(
        heightDifference > KEYBOARD_THRESHOLD,
      );
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(update);
    }

    viewport?.addEventListener("resize", scheduleUpdate);

    window.addEventListener("resize", scheduleUpdate);

    document.addEventListener("focusin", scheduleUpdate);
    document.addEventListener("focusout", scheduleUpdate);

    update();

    return () => {
      cancelAnimationFrame(frameId);

      viewport?.removeEventListener(
        "resize",
        scheduleUpdate,
      );

      window.removeEventListener(
        "resize",
        scheduleUpdate,
      );

      document.removeEventListener(
        "focusin",
        scheduleUpdate,
      );

      document.removeEventListener(
        "focusout",
        scheduleUpdate,
      );
    };
  }, []);

  return keyboardOpen;
}