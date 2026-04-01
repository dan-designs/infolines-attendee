// File: utils/sizing.ts
const BASE_SIZE = 16;

export const rem = (value: number): number => {
  return value * BASE_SIZE;
};