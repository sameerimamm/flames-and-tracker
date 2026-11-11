export type FlamesKey = 'F' | 'L' | 'A' | 'M' | 'E' | 'S' | '✨';

export interface LetterTile {
  id: string;
  char: string;
  isMatched: boolean;
  matchId?: number;
  matchColorIndex?: number;
}

export interface TraversalTick {
  letter: 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
  indexInRemaining: number;
  countNumber: number;
}

export interface EliminationRound {
  roundNumber: number;
  remainingBefore: ('F' | 'L' | 'A' | 'M' | 'E' | 'S')[];
  startIndex: number;
  count: number;
  eliminatedIndex: number;
  eliminatedLetter: 'F' | 'L' | 'A' | 'M' | 'E' | 'S';
  traversal: TraversalTick[];
  remainingAfter: ('F' | 'L' | 'A' | 'M' | 'E' | 'S')[];
}

export interface FlamesResultMeta {
  key: FlamesKey;
  word: string;
  emoji: string;
  tagline: string;
  description: string;
  advice: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  glowColor: string;
  textColor: string;
  compatibilityScore: number;
  traits: { label: string; score: number }[];
}

export interface FlamesCalculation {
  name1: string;
  name2: string;
  tiles1: LetterTile[];
  tiles2: LetterTile[];
  commonLetterCount: number;
  remainingCount: number;
  remainingLetters1: string[];
  remainingLetters2: string[];
  isIdentical: boolean;
  rounds: EliminationRound[];
  finalLetter: FlamesKey;
  resultMeta: FlamesResultMeta;
}

export const FLAMES_DICTIONARY: Record<FlamesKey, FlamesResultMeta> = {
  F: {
    key: 'F',
    word: 'Friends',
    emoji: '🤝',
    tagline: 'Best Friends for Life',
    description: 'You share an unbreakable foundation of trust, laughter, and inside jokes. Whether pulling all-nighters or trading wild stories, your camaraderie is unmatched.',
    advice: 'Never stop being honest with each other. Plan that epic weekend getaway you keep putting off!',
    badgeBg: 'bg-sky-500/10 border-sky-500/30',
    badgeText: 'text-sky-500 dark:text-sky-400',
    gradient: 'from-sky-500 via-blue-600 to-indigo-600',
    glowColor: 'rgba(14, 165, 233, 0.4)',
    textColor: 'text-sky-500',
    compatibilityScore: 89,
    traits: [
      { label: 'Trust & Loyalty', score: 95 },
      { label: 'Banter & Fun', score: 98 },
      { label: 'Emotional Support', score: 92 },
      { label: 'Drama Level', score: 15 },
    ],
  },
  L: {
    key: 'L',
    word: 'Love',
    emoji: '💖',
    tagline: 'Passionate Lovers',
    description: 'Electric chemistry and unmistakable sparks! Your hearts beat to the same rhythm. Cupid didn’t just shoot an arrow — he used a laser beam.',
    advice: 'Cherish the quiet moments together. Open communication and gentle surprises keep the spark alive forever.',
    badgeBg: 'bg-rose-500/10 border-rose-500/30',
    badgeText: 'text-rose-500 dark:text-rose-400',
    gradient: 'from-pink-500 via-rose-500 to-red-600',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    textColor: 'text-rose-500',
    compatibilityScore: 98,
    traits: [
      { label: 'Romantic Chemistry', score: 99 },
      { label: 'Butterflies', score: 96 },
      { label: 'Connection Depth', score: 94 },
      { label: 'Long-term Spark', score: 97 },
    ],
  },
  A: {
    key: 'A',
    word: 'Affection',
    emoji: '🥰',
    tagline: 'Deep Warmth & Caring',
    description: 'A soothing, tender bond filled with warmth and genuine adoration. You are each other’s calm harbor in a chaotic world.',
    advice: 'Speak each other’s love language. A heartfelt note or a warm cup of coffee when needed means the world.',
    badgeBg: 'bg-amber-500/10 border-amber-500/30',
    badgeText: 'text-amber-500 dark:text-amber-400',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    textColor: 'text-amber-500',
    compatibilityScore: 93,
    traits: [
      { label: 'Tenderness', score: 96 },
      { label: 'Comfort Level', score: 95 },
      { label: 'Listening Ear', score: 91 },
      { label: 'Mutual Kindness', score: 97 },
    ],
  },
  M: {
    key: 'M',
    word: 'Marriage',
    emoji: '💍',
    tagline: 'Happily Ever After',
    description: 'Written in the stars! You two have the rock-solid compatibility, shared values, and teamwork needed for a lifelong partnership.',
    advice: 'Start picking wedding cake flavors and honeymoon destinations! Keep growing together as equal partners.',
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30',
    badgeText: 'text-emerald-500 dark:text-emerald-400',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    textColor: 'text-emerald-500',
    compatibilityScore: 99,
    traits: [
      { label: 'Lifelong Harmony', score: 99 },
      { label: 'Shared Values', score: 96 },
      { label: 'Teamwork', score: 98 },
      { label: 'Family Energy', score: 95 },
    ],
  },
  E: {
    key: 'E',
    word: 'Enemies',
    emoji: '⚔️',
    tagline: 'Fierce Rivals / Enemies to Lovers?',
    description: 'High drama, fiery debates, and stubborn wills! You clash like lightning and thunder. Yet in every classic romance, enemies make the best lovers...',
    advice: 'Channel this intense energy into healthy competition or collaborative projects. You might just surprise each other.',
    badgeBg: 'bg-red-500/10 border-red-500/30',
    badgeText: 'text-red-500 dark:text-red-400',
    gradient: 'from-red-500 via-rose-600 to-neutral-900',
    glowColor: 'rgba(239, 68, 68, 0.45)',
    textColor: 'text-red-500',
    compatibilityScore: 54,
    traits: [
      { label: 'Fiery Passion', score: 97 },
      { label: 'Stubbornness', score: 99 },
      { label: 'Rivalry Tension', score: 95 },
      { label: 'Enemies-to-Lovers Odds', score: 84 },
    ],
  },
  S: {
    key: 'S',
    word: 'Siblings',
    emoji: '👫',
    tagline: 'Chaotic Sibling Camaraderie',
    description: 'Stealing hoodies, fighting over the TV remote, and relentless teasing — but defending each other fiercely against anyone else.',
    advice: 'Stop stealing their favorite snacks without asking! Remember to tell them you appreciate their support.',
    badgeBg: 'bg-violet-500/10 border-violet-500/30',
    badgeText: 'text-violet-500 dark:text-violet-400',
    gradient: 'from-purple-500 via-violet-600 to-indigo-600',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    textColor: 'text-violet-500',
    compatibilityScore: 84,
    traits: [
      { label: 'Playful Teasing', score: 99 },
      { label: 'Fierce Protection', score: 95 },
      { label: 'Snack Theft Odds', score: 97 },
      { label: 'Unspoken Bond', score: 91 },
    ],
  },
  '✨': {
    key: '✨',
    word: 'Soulmates',
    emoji: '✨',
    tagline: 'Cosmic Twin Resonance (Zero Difference)',
    description: 'Every single letter in your names matched! You are two sides of the same coin, mirroring each other with supernatural precision.',
    advice: 'Cherish this extraordinary cosmic sync. You two don’t just understand each other — you read each other’s minds.',
    badgeBg: 'bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border-pink-500/40',
    badgeText: 'text-pink-500 dark:text-pink-300',
    gradient: 'from-amber-400 via-pink-500 to-purple-600',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    textColor: 'text-pink-400',
    compatibilityScore: 100,
    traits: [
      { label: 'Telepathy', score: 100 },
      { label: 'Cosmic Alignment', score: 100 },
      { label: 'Synchronicity', score: 99 },
      { label: 'Mirror Soul Energy', score: 100 },
    ],
  },
};

export const COLOR_PALETTES = [
  'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
  'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/40',
  'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/40',
  'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40',
  'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40',
  'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/40',
  'bg-pink-500/20 text-pink-600 dark:text-pink-400 border-pink-500/40',
  'bg-lime-500/20 text-lime-600 dark:text-lime-400 border-lime-500/40',
];

/**
 * Calculates FLAMES between two names.
 */
export function calculateFlames(name1Raw: string, name2Raw: string): FlamesCalculation {
  const clean1 = name1Raw.toLowerCase().replace(/[^a-z]/g, '');
  const clean2 = name2Raw.toLowerCase().replace(/[^a-z]/g, '');

  const tiles1: LetterTile[] = clean1.split('').map((char, i) => ({
    id: `n1-${i}-${char}`,
    char: char.toUpperCase(),
    isMatched: false,
  }));

  const tiles2: LetterTile[] = clean2.split('').map((char, i) => ({
    id: `n2-${i}-${char}`,
    char: char.toUpperCase(),
    isMatched: false,
  }));

  // Pair up common letters 1-to-1
  let matchIdCounter = 0;
  for (let i = 0; i < tiles1.length; i++) {
    const t1 = tiles1[i];
    if (t1.isMatched) continue;

    for (let j = 0; j < tiles2.length; j++) {
      const t2 = tiles2[j];
      if (!t2.isMatched && t2.char === t1.char) {
        matchIdCounter++;
        const colorIdx = (matchIdCounter - 1) % COLOR_PALETTES.length;
        t1.isMatched = true;
        t1.matchId = matchIdCounter;
        t1.matchColorIndex = colorIdx;

        t2.isMatched = true;
        t2.matchId = matchIdCounter;
        t2.matchColorIndex = colorIdx;
        break;
      }
    }
  }

  const commonLetterCount = matchIdCounter * 2;
  const remainingLetters1 = tiles1.filter((t) => !t.isMatched).map((t) => t.char);
  const remainingLetters2 = tiles2.filter((t) => !t.isMatched).map((t) => t.char);
  const remainingCount = remainingLetters1.length + remainingLetters2.length;
  const isIdentical = remainingCount === 0 && clean1.length > 0 && clean1.length === clean2.length;

  // Handle special Soulmate condition when remaining count is 0
  if (remainingCount === 0) {
    return {
      name1: name1Raw.trim(),
      name2: name2Raw.trim(),
      tiles1,
      tiles2,
      commonLetterCount,
      remainingCount: 0,
      remainingLetters1,
      remainingLetters2,
      isIdentical: true,
      rounds: [],
      finalLetter: '✨',
      resultMeta: FLAMES_DICTIONARY['✨'],
    };
  }

  // Classic FLAMES elimination logic
  const flamesList: ('F' | 'L' | 'A' | 'M' | 'E' | 'S')[] = ['F', 'L', 'A', 'M', 'E', 'S'];
  let currentList = [...flamesList];
  let startIndex = 0;
  const rounds: EliminationRound[] = [];

  for (let r = 1; r <= 5; r++) {
    const listLen = currentList.length;
    const eliminatedIndex = (startIndex + remainingCount - 1) % listLen;
    const eliminatedLetter = currentList[eliminatedIndex];

    // Compute traversal steps for animated visualization
    const traversal: TraversalTick[] = [];
    for (let step = 0; step < remainingCount; step++) {
      const idx = (startIndex + step) % listLen;
      traversal.push({
        letter: currentList[idx],
        indexInRemaining: idx,
        countNumber: step + 1,
      });
    }

    const remainingBefore = [...currentList];
    currentList.splice(eliminatedIndex, 1);
    const remainingAfter = [...currentList];

    // Next round starts from the position where the item was eliminated
    startIndex = eliminatedIndex % currentList.length;

    rounds.push({
      roundNumber: r,
      remainingBefore,
      startIndex,
      count: remainingCount,
      eliminatedIndex,
      eliminatedLetter,
      traversal,
      remainingAfter,
    });
  }

  const finalLetter = currentList[0];
  const resultMeta = FLAMES_DICTIONARY[finalLetter];

  return {
    name1: name1Raw.trim(),
    name2: name2Raw.trim(),
    tiles1,
    tiles2,
    commonLetterCount,
    remainingCount,
    remainingLetters1,
    remainingLetters2,
    isIdentical: false,
    rounds,
    finalLetter,
    resultMeta,
  };
}
