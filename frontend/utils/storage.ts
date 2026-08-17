export const clearSavedCode = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("codemeet-code-")) {
      localStorage.removeItem(key);
    }
  });
};
