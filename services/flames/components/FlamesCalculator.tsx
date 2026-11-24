'use client';

import React, { useState, useEffect } from 'react';
import { FlamesCalculation, calculateFlames } from '../lib/flamesLogic';
import { sound } from '../lib/audio';
import { LetterMatcher } from './LetterMatcher';
import { EliminationStage } from './EliminationStage';
import { ResultCard } from './ResultCard';
import { PresetChips } from './PresetChips';
import { HistoryList, HistoryItem } from './HistoryList';
import { AdminRecordsModal } from './AdminRecordsModal';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import {
  Flame,
  Heart,
  ArrowRightLeft,
  Sparkles,
  Info,
  ChevronDown,
  Volume2,
  VolumeX,
  Lock,
  X,
} from 'lucide-react';

// Helper to identify unique returning visitors and device hints
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let vid = localStorage.getItem('flames_vid');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 8);
      localStorage.setItem('flames_vid', vid);
    }
    return vid;
  } catch {
    return '';
  }
}

function getClientDeviceHint(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const ua = navigator.userAgent || '';
    const w = window.screen.width;
    const h = window.screen.height;

    // Detect iPhone screen points
    if (/iPhone/i.test(ua)) {
      let model = 'iPhone';
      if ((w === 402 && h === 874) || (w === 874 && h === 402)) model = 'iPhone 16 Pro';
      else if ((w === 440 && h === 956) || (w === 956 && h === 440)) model = 'iPhone 16 Pro Max';
      else if ((w === 393 && h === 852) || (w === 852 && h === 393)) model = 'iPhone 15 / 16';
      else if ((w === 430 && h === 932) || (w === 932 && h === 430)) model = 'iPhone 15 / 16 Plus';
      else if ((w === 390 && h === 844) || (w === 844 && h === 390)) model = 'iPhone 13 / 14';
      else if ((w === 428 && h === 926) || (w === 926 && h === 428)) model = 'iPhone 13 / 14 Pro Max';
      else if ((w === 375 && h === 812) || (w === 812 && h === 375)) model = 'iPhone X / 11 / 12 mini';
      else model = `iPhone (${w}x${h})`;

      if (/Instagram/i.test(ua)) return `${model} • Instagram`;
      if (/WhatsApp/i.test(ua)) return `${model} • WhatsApp`;
      return `${model} • Safari`;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export const FlamesCalculator: React.FC = () => {
  const [name1, setName1] = useState<string>('');
  const [name2, setName2] = useState<string>('');
  const [calculation, setCalculation] = useState<FlamesCalculation | null>(null);
  const [isAnimationDone, setIsAnimationDone] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useLocalStorage<boolean>('flames_muted', false);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('flames_history_v1', []);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [isSecretPromptOpen, setIsSecretPromptOpen] = useState<boolean>(false);
  const [enteredPassword, setEnteredPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword.trim().toLowerCase() === 'semalf') {
      setPasswordError(false);
      setEnteredPassword('');
      setIsSecretPromptOpen(false);
      setShowAdminModal(true);
    } else {
      setPasswordError(true);
    }
  };

  // Sync sound
  useEffect(() => {
    sound.enabled = !isSoundMuted;
  }, [isSoundMuted]);

  const handleCalculate = (n1 = name1, n2 = name2) => {
    const clean1 = n1.trim().replace(/[^a-zA-Z]/g, '');
    const clean2 = n2.trim().replace(/[^a-zA-Z]/g, '');

    if (!clean1 || !clean2) {
      setInputError('Please enter valid letters for both names.');
      return;
    }

    setInputError(null);
    const result = calculateFlames(n1, n2);
    setCalculation(result);
    setIsAnimationDone(result.isIdentical); // If identical, finish immediately

    sound.playMatch();

    // Add to local history
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name1: result.name1,
      name2: result.name2,
      count: result.remainingCount,
      resultLetter: result.finalLetter,
      timestamp: Date.now(),
    };

    setHistory((prev) => [newItem, ...prev.filter((item) => !(item.name1 === result.name1 && item.name2 === result.name2))].slice(0, 15));

    // Silently save calculation to Database with location/device context
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const refTag = urlParams?.get('ref') || urlParams?.get('u') || undefined;

    fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name1: result.name1,
        name2: result.name2,
        resultLetter: result.finalLetter,
        resultWord: result.resultMeta.word,
        resultEmoji: result.resultMeta.emoji,
        remainingCount: result.remainingCount,
        visitorId: getVisitorId(),
        deviceHint: getClientDeviceHint(),
        ref: refTag,
      }),
    }).catch((err) => console.warn('Could not sync record:', err));
  };

  const handleSwap = () => {
    setName1(name2);
    setName2(name1);
    if (calculation) {
      handleCalculate(name2, name1);
    }
  };

  const handlePresetSelect = (presetName1: string, presetName2: string) => {
    setName1(presetName1);
    setName2(presetName2);
    handleCalculate(presetName1, presetName2);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setName1(item.name1);
    setName2(item.name2);
    handleCalculate(item.name1, item.name2);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleReset = () => {
    setCalculation(null);
    setIsAnimationDone(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-4 sm:py-8">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
            <span>The Timeless Friendship & Love Oracle</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
          FLAMES Calculator
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Find your destiny! Discover whether you are <strong>Friends</strong>, <strong>Lovers</strong>, <strong>Affectionate</strong>, <strong>Married</strong>, <strong>Enemies</strong>, or <strong>Siblings</strong> with real-time visual proof.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate();
          }}
          className="space-y-6 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* Person 1 Input */}
            <div className="space-y-1.5">
              <label htmlFor="name1-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-pink-500" />
                <span>First Person</span>
              </label>
              <div className="relative">
                <input
                  id="name1-input"
                  type="text"
                  placeholder="e.g. Amitabh"
                  value={name1}
                  onChange={(e) => {
                    setName1(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold text-base transition-all"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:pt-6">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Names"
                className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 border border-slate-200 dark:border-slate-700 transition-all active:scale-90"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Person 2 Input */}
            <div className="space-y-1.5">
              <label htmlFor="name2-input" className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-indigo-500" />
                <span>Second Person</span>
              </label>
              <div className="relative">
                <input
                  id="name2-input"
                  type="text"
                  placeholder="e.g. Rekha"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-base transition-all"
                />
              </div>
            </div>
          </div>

          {inputError && (
            <p className="text-xs font-semibold text-red-500 text-center animate-shake">
              {inputError}
            </p>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <PresetChips onSelect={handlePresetSelect} />

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isSoundMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-pink-500" />}
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 hover:from-pink-600 hover:via-rose-600 hover:to-indigo-700 text-white font-extrabold text-base shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Flame className="w-5 h-5 fill-white" />
                <span>Calculate Destiny</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* When Calculated: Interactive Walkthrough */}
      {calculation && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Step 1: Letter Cancellation */}
          <LetterMatcher calculation={calculation} />

          {/* Step 2: Elimination Stage */}
          <EliminationStage
            calculation={calculation}
            onAnimationComplete={() => setIsAnimationDone(true)}
            isSoundMuted={isSoundMuted}
            onToggleSound={() => setIsSoundMuted(!isSoundMuted)}
          />

          {/* Step 3: Final Result Card */}
          {isAnimationDone && (
            <ResultCard
              calculation={calculation}
              onReset={handleReset}
            />
          )}
        </div>
      )}

      {/* History Drawer */}
      <HistoryList
        history={history}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
      />

      {/* How FLAMES Works Accordion */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-pink-500 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-pink-500" />
            How Does the FLAMES Algorithm Work?
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${showHowItWorks ? 'rotate-180 text-pink-500' : 'text-slate-400'}`}
          />
        </button>

        {showHowItWorks && (
          <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 space-y-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <p>
              FLAMES is a beloved relationship prediction game popular among school and college students worldwide. Here is the mathematical procedure:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 pl-1">
              <li>
                <strong>Letter Cancellation:</strong> Take both names, convert to lowercase, and cross out all common letters in pairs 1-to-1.
              </li>
              <li>
                <strong>Sum of Remainder:</strong> Add the count of remaining unmatched letters from both names. This is your <em>Magic Count (N)</em>.
              </li>
              <li>
                <strong>Circular Elimination:</strong> Write down the letters <strong>F - L - A - M - E - S</strong>.
                Start counting from 1 up to N along the list circularly. The letter you land on is struck out.
              </li>
              <li>
                <strong>Repeat:</strong> The next round starts counting from the letter immediately following the eliminated one. Repeat until only a single letter remains.
              </li>
              <li>
                <strong>Destiny Revealed:</strong>
                <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5">
                  <li><strong>F</strong> = Friends 🤝</li>
                  <li><strong>L</strong> = Love 💖</li>
                  <li><strong>A</strong> = Affection 🥰</li>
                  <li><strong>M</strong> = Marriage 💍</li>
                  <li><strong>E</strong> = Enemies ⚔️</li>
                  <li><strong>S</strong> = Siblings 👫</li>
                  <li><strong>Zero count</strong> = Soulmates ✨</li>
                </ul>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Subtle Footer with Secret Gate */}
      <footer className="pt-8 pb-4 text-center text-xs text-slate-400/50 select-none flex items-center justify-center gap-2">
        <span>© 2026 FLAMES</span>
        <span>•</span>
        <button
          type="button"
          onClick={() => {
            setPasswordError(false);
            setEnteredPassword('');
            setIsSecretPromptOpen(true);
          }}
          className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          secret
        </button>
      </footer>

      {/* Secret Password Prompt Modal */}
      {isSecretPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold">
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  <Lock className="w-4 h-4" />
                </div>
                <span>Authentication Required</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSecretPromptOpen(false);
                  setEnteredPassword('');
                  setPasswordError(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter the secret passkey to access database logs.
            </p>

            <form onSubmit={handleSecretSubmit} className="space-y-3">
              <div>
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter secret passkey..."
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (passwordError) setPasswordError(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 border ${
                    passwordError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus:ring-pink-500'
                  } text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2`}
                />
                {passwordError && (
                  <p className="text-xs text-red-500 font-medium mt-1.5">
                    Incorrect password. Access denied.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSecretPromptOpen(false);
                    setEnteredPassword('');
                    setPasswordError(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 rounded-xl transition-colors shadow-sm shadow-pink-500/20"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin / Submissions Database Modal */}
      <AdminRecordsModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </div>
  );
};
