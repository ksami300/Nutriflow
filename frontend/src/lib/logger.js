export const info = (...args) => {
  if (typeof window !== "undefined") {
    console.info(...args);
  }
};

export const warn = (...args) => {
  if (typeof window !== "undefined") {
    console.warn(...args);
  }
};

export const error = (...args) => {
  if (typeof window !== "undefined") {
    console.error(...args);
  }
};
