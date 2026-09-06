/**
 * Formatowanie pod rynek PL. Wszystkie kwoty w danych sklepu trzymamy
 * w groszach (integer), żeby nie mnożyć błędu zmiennoprzecinkowego.
 */

export function zl(amount: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

export const plural = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};
