// Public API for the FLAMES Service
export { FlamesCalculator } from './components/FlamesCalculator';
export { LetterMatcher } from './components/LetterMatcher';
export { EliminationStage } from './components/EliminationStage';
export { ResultCard } from './components/ResultCard';
export { PresetChips } from './components/PresetChips';
export { HistoryList } from './components/HistoryList';
export type { HistoryItem } from './components/HistoryList';

export {
  calculateFlames,
  FLAMES_DICTIONARY,
  COLOR_PALETTES,
} from './lib/flamesLogic';

export type {
  FlamesKey,
  FlamesCalculation,
  FlamesResultMeta,
  EliminationRound,
  LetterTile,
} from './lib/flamesLogic';

export { sound } from './lib/audio';
