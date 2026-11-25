import type { InterfaceSize } from "../contexts/InterfaceContext";

interface SizeDimensions {
  cardHeight: number;
  textSize: number;
  symbolSize: number;
}

export const interfaceSizes: Record<InterfaceSize, SizeDimensions> = {
  small: {
    cardHeight: 144,
    textSize: 14,
    symbolSize: 96,
  },

  medium: {
    cardHeight: 176,
    textSize: 16,
    symbolSize: 128,
  },

  large: {
    cardHeight: 208,
    textSize: 20,
    symbolSize: 160,
  },

  "extra-large": {
    cardHeight: 240,
    textSize: 24,
    symbolSize: 192,
  },
};
