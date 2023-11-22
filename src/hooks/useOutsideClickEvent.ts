import { useEffect } from "react";

export function useOutsideClickEvent(ref, func, disabled = false) {
  useEffect(() => {
    // Trigger function if clicked outside of ref element
    // Disabled option allows to disable the event listener when needed
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && !disabled) {
        func();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, disabled]);
}
