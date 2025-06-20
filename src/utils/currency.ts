import { numFormatter } from "@/src/utils/numFormatter";

function Currency(inputCurrency?: string, inputPrice: number = 0) {
  const currency = inputCurrency
    ? getCurrencySymbol(inputCurrency.toLowerCase())
    : "$";

  // Add currency symbol mapping function
  function getCurrencySymbol(currency: string): string {
    const symbols: { [key: string]: string } = {
      usd: "$",
      eur: "€",
      euro: "€",
      gbp: "£",
      jpy: "¥",
      cny: "¥",
      rand: "R",
      aud: "A$",
      cad: "C$",
    };
    return symbols[currency] || currency;
  }
  const price = numFormatter(inputPrice);
  return {
    price,
    currency,
  };
}

export default Currency;
