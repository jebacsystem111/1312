/** Jedna funkcja do łączenia klas, bez zależności. */
export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}
