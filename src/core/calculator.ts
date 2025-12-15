export const calculateMidPrice = (bid: number, ask: number): number => {
  return Number(((bid + ask) / 2).toFixed(2));
};

export const calculateSpread = (midPrice: number, bid: number, ask: number): number => {
  return ((ask - bid) / midPrice) * 100;
};

export const calculateAverageSpread = (spreads: number[]): number => {
  if (spreads.length === 0) return 0;

  return spreads.reduce((acc, curr) => acc + curr, 0) / spreads.length;
};
