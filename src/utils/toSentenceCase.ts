export const toSentenceCase = (str: unknown): string => {
  if (typeof str !== "string" || str.trim() === "") {
    return ""; // Always return a string
  }

  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .split(" ")
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};
