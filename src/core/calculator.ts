export const calculateMidPrice = (bid: number, ask: number): number => {
  if (bid <= 0 || ask <= 0) {
    throw new Error('Bid and ask prices must be greater than 0');
  }

  return Number(((bid + ask) / 2).toFixed(2));
};

export const calculateSpread = (midPrice: number, bid: number, ask: number): number => {
  if (midPrice <= 0) {
    throw new Error('Mid price must be greater than 0');
  }

  if (ask < bid) {
    throw new Error('Ask price must be greater than or equal to bid price');
  }

  return ((ask - bid) / midPrice) * 100;
};

export const calculateAverageSpread = (spreads: number[]): number => {
  if (spreads.length === 0) {
    return 0;
  }

  return spreads.reduce((acc, curr) => acc + curr, 0) / spreads.length;
};
