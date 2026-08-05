import React, { useEffect, useState, useRef } from 'react';
import { playKeyboardClick } from '../../utils/audioUtils';
import { ScanProgressData } from '../../types/font';

interface SplashScreenProps {
  onComplete: () => void;
  scanProgress: ScanProgressData | null;
  enableStartupSound: boolean;
  isDataLoaded: boolean;
}

const FULL_TITLE = 'Brave Studios';
const SUBTITLE = 'BraveType - Font Manager Tool';
const TYPING_SPEED = 85; // ms per character

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  scanProgress,
  enableStartupSound,
  isDataLoaded,
}) => {
  const [typedText, setTypedText] = useState('');
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [statusText, setStatusText] = useState('Initializing...');

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Check user OS Reduce Motion accessibility setting
  const prefersReduceMotion = useRef(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  // Typing animation & sound
  useEffect(() => {
    if (prefersReduceMotion) {
      setTypedText(FULL_TITLE);
      setIsTypingFinished(true);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index <= FULL_TITLE.length) {
        const nextChar = FULL_TITLE.slice(0, index);
        setTypedText(nextChar);
        playKeyboardClick(enableStartupSound);
      } else {
        clearInterval(interval);
        setIsTypingFinished(true);
      }
    }, TYPING_SPEED);

    return () => clearInterval(interval);
  }, [enableStartupSound, prefersReduceMotion]);

  // Update status messages dynamically
  useEffect(() => {
    if (scanProgress && scanProgress.statusText) {
      setStatusText(scanProgress.statusText);
    } else if (isDataLoaded) {
      setStatusText('Preparing Preview Engine...');
    } else {
      setStatusText('Loading Font Cache...');
    }
  }, [scanProgress, isDataLoaded]);

  // Handle smooth transition after typing + loading complete
  useEffect(() => {
    if (isTypingFinished && isDataLoaded) {
      setStatusText('Almost Ready...');
      const pauseDuration = prefersReduceMotion ? 600 : 800;

      const timer = setTimeout(() => {
        setIsFadingOut(true);
        const fadeTimer = setTimeout(() => {
          onCompleteRef.current();
        }, 700); // 700ms smooth fade transition
        return () => clearTimeout(fadeTimer);
      }, pauseDuration);

      return () => clearTimeout(timer);
    }
  }, [isTypingFinished, isDataLoaded, prefersReduceMotion]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#FAF7F2] text-[#2C2825] select-none p-12 transition-opacity duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Spacer */}
      <div className="h-10" />

      {/* Main Centered Minimal Typography */}
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {/* Title "Brave Studios" */}
        <h1
          style={{ fontFamily: "'Transcity', 'Inter', system-ui, -apple-system, sans-serif" }}
          className="text-5xl md:text-6xl font-light tracking-tight text-[#2C2825] leading-none"
        >
          {typedText}
          {!isTypingFinished && (
            <span className="inline-block w-0.5 h-10 ml-1 bg-[#E86A33] animate-pulse" />
          )}
        </h1>

        {/* Subtitle "BraveType - Font Manager Tool" */}
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#78716C] pt-2">
          {SUBTITLE}
        </p>
      </div>

      {/* Bottom Status Text */}
      <div className="flex flex-col items-center space-y-2 pb-6">
        <p className="text-xs font-medium text-[#A8A29E] tracking-wider transition-all duration-300">
          {statusText}
        </p>
      </div>
    </div>
  );
};
