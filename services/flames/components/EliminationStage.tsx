'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FlamesCalculation, EliminationRound, FlamesKey, FLAMES_DICTIONARY } from '../lib/flamesLogic';
import { sound } from '../lib/audio';
import { Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX, CheckCircle2 } from 'lucide-react';

interface EliminationStageProps {
  calculation: FlamesCalculation;
  onAnimationComplete?: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const EliminationStage: React.FC<EliminationStageProps> = ({
  calculation,
  onAnimationComplete,
  isSoundMuted,
  onToggleSound,
}) => {
  const { rounds, remainingCount, finalLetter, isIdentical } = calculation;

  // Animation states
  // currentRoundIndex: 0..rounds.length (0 means not started, rounds.length means all completed)
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [currentStepInRound, setCurrentStepInRound] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTraversedLetter, setActiveTraversedLetter] = useState<string | null>(null);
  const [highlightCountNum, setHighlightCountNum] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Set sound enabled state
  useEffect(() => {
    sound.enabled = !isSoundMuted;
  }, [isSoundMuted]);

  // Reset animation when calculation changes
  useEffect(() => {
    setCurrentRoundIdx(0);
    setCurrentStepInRound(-1);
    setActiveTraversedLetter(null);
    setHighlightCountNum(null);
    setIsPlaying(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [calculation]);

  // Handle animation timer loop
  useEffect(() => {
    if (!isPlaying || isIdentical) return;

    if (currentRoundIdx >= rounds.length) {
      // Completed!
      onAnimationComplete?.();
      return;
    }

    const currentRound = rounds[currentRoundIdx];
    const totalTraversalSteps = currentRound.traversal.length;

    // Set animation speed: if count is large, make ticks faster
    const tickDuration = Math.max(90, Math.min(320, 1800 / (remainingCount || 1)));

    timerRef.current = setTimeout(() => {
      if (currentStepInRound < totalTraversalSteps - 1) {
        const nextStep = currentStepInRound + 1;
        const tick = currentRound.traversal[nextStep];
        setCurrentStepInRound(nextStep);
        setActiveTraversedLetter(tick.letter);
        setHighlightCountNum(tick.countNumber);
        sound.playTick(500 + (tick.countNumber % 6) * 40);
      } else {
        // Strike out letter at end of round
        sound.playEliminate();
        setActiveTraversedLetter(null);
        setHighlightCountNum(null);
        setCurrentRoundIdx((prev) => prev + 1);
        setCurrentStepInRound(-1);
      }
    }, tickDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentRoundIdx, currentStepInRound, rounds, isIdentical, onAnimationComplete, remainingCount]);

  const handleSkipToEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setCurrentRoundIdx(rounds.length);
    setCurrentStepInRound(-1);
    setActiveTraversedLetter(null);
    setHighlightCountNum(null);
    onAnimationComplete?.();
  };

  const handleReplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentRoundIdx(0);
    setCurrentStepInRound(-1);
    setActiveTraversedLetter(null);
    setHighlightCountNum(null);
    setIsPlaying(true);
  };

  const handleStepNext = () => {
    if (currentRoundIdx < rounds.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
      sound.playEliminate();
      setCurrentRoundIdx((prev) => prev + 1);
      setCurrentStepInRound(-1);
      setActiveTraversedLetter(null);
      setHighlightCountNum(null);
      if (currentRoundIdx + 1 >= rounds.length) {
        onAnimationComplete?.();
      }
    }
  };

  // Determine which letters have been eliminated up to currentRoundIdx
  const eliminatedLettersSoFar = rounds.slice(0, currentRoundIdx).map((r) => r.eliminatedLetter);
  const isFinished = currentRoundIdx >= rounds.length;

  const flamesAlphabet: ('F' | 'L' | 'A' | 'M' | 'E' | 'S')[] = ['F', 'L', 'A', 'M', 'E', 'S'];

  if (isIdentical) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center py-10 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/25 animate-bounce">
          ✨
        </div>
        <h3 className="text-xl font-extrabold bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Zero Count Miracle — Instant Soulmates!
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Both names cancelled each other out completely! In FLAMES tradition, zero remaining letters denotes pure cosmic harmony.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">2</span>
            Elimination Arena
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Counting <strong>{remainingCount}</strong> positions circularly each round until 1 letter stands.
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onToggleSound}
            title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-500" />}
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isFinished}
            title={isPlaying ? 'Pause' : 'Play'}
            className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors ${
              isFinished ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-indigo-500" /> : <Play className="w-4 h-4 text-emerald-500" />}
          </button>

          <button
            type="button"
            onClick={handleStepNext}
            disabled={isFinished}
            title="Step next round"
            className={`px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors ${
              isFinished ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <span>Next</span>
          </button>

          <button
            type="button"
            onClick={handleSkipToEnd}
            disabled={isFinished}
            title="Skip directly to final result"
            className={`px-2.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1 shadow-sm shadow-indigo-500/20 transition-all ${
              isFinished ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>

          <button
            type="button"
            onClick={handleReplay}
            title="Replay elimination"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* FLAMES Giant Interactive Letters Display */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2 pb-4">
        {flamesAlphabet.map((letter) => {
          const isEliminated = eliminatedLettersSoFar.includes(letter);
          const isTraversingNow = activeTraversedLetter === letter;
          const isFinalWinner = isFinished && letter === finalLetter;
          const info = FLAMES_DICTIONARY[letter];

          let cardStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
          let slashStyle = 'hidden';

          if (isFinalWinner) {
            cardStyle = `bg-gradient-to-b ${info.gradient} text-white border-transparent shadow-xl ring-4 ring-pink-500/40 scale-105 animate-pulse`;
          } else if (isTraversingNow) {
            cardStyle = 'bg-indigo-500 text-white border-indigo-400 scale-110 shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-300';
          } else if (isEliminated) {
            cardStyle = 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-40 scale-95';
            slashStyle = 'block';
          }

          return (
            <div
              key={letter}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 select-none ${cardStyle}`}
            >
              {/* Crossed out red slash line */}
              <div
                className={`absolute inset-0 pointer-events-none ${slashStyle}`}
              >
                <div className="w-full h-0.5 bg-red-500/90 dark:bg-red-500 rotate-45 absolute top-1/2 left-0 transform -translate-y-1/2" />
                <div className="w-full h-0.5 bg-red-500/90 dark:bg-red-500 -rotate-45 absolute top-1/2 left-0 transform -translate-y-1/2" />
              </div>

              {/* Traversal Count Badge */}
              {isTraversingNow && highlightCountNum !== null && (
                <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold shadow-md shadow-pink-500/40 animate-bounce">
                  #{highlightCountNum}
                </div>
              )}

              {/* Winner Crown / Badge */}
              {isFinalWinner && (
                <div className="absolute -top-3 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider shadow-md">
                  Winner 👑
                </div>
              )}

              <span className="text-3xl sm:text-4xl font-black tracking-tight">{letter}</span>
              <span className={`text-[11px] font-semibold mt-1 truncate max-w-full ${isFinalWinner ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {info.word}
              </span>
              <span className="text-sm mt-0.5">{info.emoji}</span>
            </div>
          );
        })}
      </div>

      {/* Round-by-Round Log / Breakdown */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Elimination Log ({Math.min(currentRoundIdx, rounds.length)}/5 rounds completed)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          {rounds.map((round, idx) => {
            const isCompleted = idx < currentRoundIdx;
            const isCurrent = idx === currentRoundIdx && !isFinished;
            const eliminatedInfo = FLAMES_DICTIONARY[round.eliminatedLetter];

            return (
              <div
                key={round.roundNumber}
                className={`p-3 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                    : isCurrent
                    ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30'
                    : 'bg-transparent border-dashed border-slate-200 dark:border-slate-800 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  <span>Round {round.roundNumber}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  ) : null}
                </div>

                {isCompleted ? (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Eliminated <strong className="text-red-500">{round.eliminatedLetter}</strong> ({eliminatedInfo.word})
                  </p>
                ) : isCurrent ? (
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Counting {round.count} letters...
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 dark:text-slate-600">Pending</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
