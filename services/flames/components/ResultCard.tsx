'use client';

import React, { useEffect, useState, useRef } from 'react';
import { FlamesCalculation } from '../lib/flamesLogic';
import { sound } from '../lib/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Share2,
  Download,
  Check,
  Heart,
  Flame,
  Award,
  Compass,
} from 'lucide-react';

interface ResultCardProps {
  calculation: FlamesCalculation;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ calculation, onReset }) => {
  const { name1, name2, remainingCount, resultMeta, finalLetter, isIdentical } = calculation;
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger celebration on mount
  useEffect(() => {
    sound.playFanfare(finalLetter);

    // Confetti burst
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ec4899', '#f43f5e', '#a855f7'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#fbbf24', '#f43f5e', '#6366f1'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [finalLetter]);

  const handleCopyText = async () => {
    const text = `🔥 FLAMES Destiny Calculator 🔥\n` +
      `👤 ${name1} + 👤 ${name2}\n` +
      `🔢 Remaining Count: ${remainingCount}\n` +
      `✨ Result: ${resultMeta.emoji} ${resultMeta.word.toUpperCase()} (${resultMeta.tagline})\n` +
      `💖 Compatibility: ${resultMeta.compatibilityScore}%\n` +
      `💡 Advice: "${resultMeta.advice}"\n\n` +
      `Calculated with Antigravity FLAMES ✨`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadImage = () => {
    setIsExporting(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 1200;
      const height = 630;
      canvas.width = width;
      canvas.height = height;

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#090d16');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Decorative Circles
      ctx.beginPath();
      ctx.arc(100, 100, 180, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(1100, 500, 220, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.fill();

      // Top Header
      ctx.fillStyle = '#ec4899';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.fillText('🔥 FLAMES DESTINY CALCULATOR', 80, 80);

      // Names Header
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px system-ui, sans-serif';
      ctx.fillText(`${name1}  &  ${name2}`, 80, 160);

      // Subtitle
      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px system-ui, sans-serif';
      ctx.fillText(`Magic Letter Count: ${remainingCount}  •  Status: Verified Destiny`, 80, 205);

      // Result Box Container
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.roundRect(80, 245, 1040, 260, 24);
      ctx.fill();
      ctx.stroke();

      // Emoji & Result Title
      ctx.font = '80px system-ui, sans-serif';
      ctx.fillText(resultMeta.emoji, 120, 360);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 54px system-ui, sans-serif';
      ctx.fillText(resultMeta.word.toUpperCase(), 240, 340);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '26px system-ui, sans-serif';
      ctx.fillText(resultMeta.tagline, 240, 385);

      // Compatibility score badge
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText(`${resultMeta.compatibilityScore}% Compatibility`, 240, 440);

      // Advice / Quote
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 20px system-ui, sans-serif';
      const quote = `"${resultMeta.advice}"`;
      ctx.fillText(quote, 80, 560);

      // Watermark
      ctx.fillStyle = '#64748b';
      ctx.font = '16px system-ui, sans-serif';
      ctx.fillText('Generated with Antigravity FLAMES', 900, 560);

      // Convert to image download
      const imageURL = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `FLAMES_${name1}_${name2}.png`;
      downloadLink.href = imageURL;
      downloadLink.click();
    } catch {
      // Error exporting
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-500"
    >
      {/* Background Ambience Glow */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ backgroundColor: resultMeta.glowColor }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{ backgroundColor: resultMeta.glowColor }}
      />

      {/* Main Result Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr ${resultMeta.gradient} flex items-center justify-center text-4xl sm:text-5xl shadow-xl shadow-pink-500/25 shrink-0 transform hover:scale-105 transition-transform`}
          >
            {resultMeta.emoji}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${resultMeta.badgeBg} ${resultMeta.badgeText}`}>
                {isIdentical ? 'Cosmic Match' : `Letter ${finalLetter}`}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Magic Count: {remainingCount}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{resultMeta.word}</span>
            </h2>

            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {resultMeta.tagline}
            </p>
          </div>
        </div>

        {/* Compatibility Gauge Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-4 shrink-0 sm:self-center">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Compatibility</span>
            </div>
            <div className="text-2xl font-black bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
              {resultMeta.compatibilityScore}%
            </div>
          </div>

          <div className="w-24 bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${resultMeta.gradient} transition-all duration-1000 ease-out`}
              style={{ width: `${resultMeta.compatibilityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Description & Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-3 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Connection Profile</span>
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {resultMeta.description}
          </p>
        </div>

        <div className="space-y-3 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Relationship Advice</span>
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            &ldquo;{resultMeta.advice}&rdquo;
          </p>
        </div>
      </div>

      {/* Traits Breakdown */}
      <div className="space-y-3 relative z-10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-pink-500" />
          <span>Destiny Chemistry Traits</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {resultMeta.traits.map((trait) => (
            <div
              key={trait.label}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{trait.label}</span>
                <span className="font-bold text-pink-500 font-mono">{trait.score}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${resultMeta.gradient}`}
                  style={{ width: `${trait.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs flex items-center gap-2 shadow-md hover:opacity-90 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Share Result'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{isExporting ? 'Generating Card...' : 'Save as Image'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test Another Pair</span>
        </button>
      </div>
    </div>
  );
};
