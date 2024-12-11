import { useCallback } from "react";

export const useActionButton = (initialAction = () => {}) => {
  const handleClick = useCallback(
    (action) => {
      if (typeof action === "function") {
        action();
      }
    },
    [initialAction]
  );

  return { handleClick };
};
