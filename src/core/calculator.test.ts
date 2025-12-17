import { calculateAverageSpread, calculateMidPrice, calculateSpread } from './calculator';

describe('Calculator', () => {
  describe('calculateMidPrice', () => {
    it('should calculate mid price correctly for valid inputs', () => {
      expect(calculateMidPrice(100, 110)).toBe(105);
      expect(calculateMidPrice(50.5, 60.5)).toBe(55.5);
      expect(calculateMidPrice(1000, 1000)).toBe(1000);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateMidPrice(100.123, 110.789)).toBe(105.46);
      expect(calculateMidPrice(33.333, 66.666)).toBe(50);
    });

    it('should throw error when bid is zero', () => {
      expect(() => calculateMidPrice(0, 110)).toThrow('Bid and ask prices must be greater than 0');
    });

    it('should throw error when ask is zero', () => {
      expect(() => calculateMidPrice(100, 0)).toThrow('Bid and ask prices must be greater than 0');
    });

    it('should throw error when bid is negative', () => {
      expect(() => calculateMidPrice(-100, 110)).toThrow(
        'Bid and ask prices must be greater than 0'
      );
    });

    it('should throw error when ask is negative', () => {
      expect(() => calculateMidPrice(100, -110)).toThrow(
        'Bid and ask prices must be greater than 0'
      );
    });

    it('should throw error when both bid and ask are negative', () => {
      expect(() => calculateMidPrice(-100, -110)).toThrow(
        'Bid and ask prices must be greater than 0'
      );
    });

    it('should throw error when ask is less than bid', () => {
      expect(() => calculateMidPrice(110, 100)).toThrow(
        'Ask price must be greater than or equal to bid price'
      );
    });

    it('should allow ask to equal bid', () => {
      expect(calculateMidPrice(100, 100)).toBe(100);
    });
  });

  describe('calculateSpread', () => {
    it('should calculate spread percentage correctly for valid inputs', () => {
      expect(calculateSpread(99, 101)).toBe(2);
      expect(calculateSpread(95, 105)).toBe(10);
      expect(calculateSpread(49, 51)).toBe(4);
    });

    it('should return 0 when bid equals ask', () => {
      expect(calculateSpread(100, 100)).toBe(0);
    });

    it('should handle decimal values correctly', () => {
      expect(calculateSpread(99.5, 100.5)).toBe(1);
      expect(calculateSpread(50, 51)).toBeCloseTo(1.98, 2);
    });

    it('should throw error when bid is zero', () => {
      expect(() => calculateSpread(0, 101)).toThrow('Bid and ask prices must be greater than 0');
    });

    it('should throw error when ask is zero', () => {
      expect(() => calculateSpread(99, 0)).toThrow('Bid and ask prices must be greater than 0');
    });

    it('should throw error when bid is negative', () => {
      expect(() => calculateSpread(-99, 101)).toThrow('Bid and ask prices must be greater than 0');
    });

    it('should throw error when ask is negative', () => {
      expect(() => calculateSpread(99, -101)).toThrow('Bid and ask prices must be greater than 0');
    });

    it('should throw error when ask is less than bid', () => {
      expect(() => calculateSpread(101, 99)).toThrow(
        'Ask price must be greater than or equal to bid price'
      );
    });

    it('should handle edge case where ask equals bid', () => {
      expect(calculateSpread(100, 100)).toBe(0);
    });

    it('should calculate spread using mid price internally', () => {
      expect(calculateSpread(99, 101)).toBe(2);
      expect(calculateSpread(50, 51)).toBeCloseTo(1.98, 2);
    });
  });

  describe('calculateAverageSpread', () => {
    it('should calculate average spread correctly for valid array', () => {
      expect(calculateAverageSpread([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateAverageSpread([10, 20, 30])).toBe(20);
      expect(calculateAverageSpread([0.5, 1.5, 2.5])).toBeCloseTo(1.5, 2);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAverageSpread([])).toBe(0);
    });

    it('should handle single element array', () => {
      expect(calculateAverageSpread([5])).toBe(5);
      expect(calculateAverageSpread([10.5])).toBe(10.5);
    });

    it('should handle negative spreads', () => {
      expect(calculateAverageSpread([-1, 0, 1])).toBe(0);
      expect(calculateAverageSpread([-5, -3, -1])).toBe(-3);
    });

    it('should handle decimal values correctly', () => {
      expect(calculateAverageSpread([1.1, 2.2, 3.3])).toBeCloseTo(2.2, 2);
      expect(calculateAverageSpread([0.1, 0.2, 0.3])).toBeCloseTo(0.2, 2);
    });

    it('should handle large arrays', () => {
      const spreads = Array.from({ length: 100 }, (_, i) => i + 1);
      expect(calculateAverageSpread(spreads)).toBe(50.5);
    });

    it('should handle array with all zeros', () => {
      expect(calculateAverageSpread([0, 0, 0])).toBe(0);
    });
  });
});
