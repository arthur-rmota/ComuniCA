
import type { InterfaceSize } from "../contexts/InterfaceContext";

interface SizeDimensions {
  cardHeight: number;
  textSize: number;
  symbolSize: number;
}

// record cria um objeto com chaves e valores de tipos pré-definidos. 
// aqui, indicando que as chaves precisam ser valores InterfaceSize e o conteúdo de cada chave deve seguir a esrutura SizeDimensions
export const interfaceSizes: Record<InterfaceSize, SizeDimensions> = {
  small: {
    cardHeight: 144,
    textSize: 14,
    symbolSize: 40,
  },

  medium: {
    cardHeight: 176,
    textSize: 16,
    symbolSize: 58,
  },

  large: {
    cardHeight: 208,
    textSize: 20,
    symbolSize: 72,
  },

  "extra-large": {
    cardHeight: 240,
    textSize: 24,
    symbolSize: 88,
  },
};
