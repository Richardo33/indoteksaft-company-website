"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const TYPE_SPEED_MS = 55;
const DELETE_SPEED_MS = 28;
const HOLD_DURATION_MS = 1_800;
const NEXT_WORD_DELAY_MS = 260;

type RotatingTypeTextProps = {
  words: readonly string[];
  className?: string;
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export function RotatingTypeText({
  words,
  className,
}: RotatingTypeTextProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => true,
  );

  useEffect(() => {
    if (words.length === 0 || prefersReducedMotion) {
      return;
    }

    const currentWord = words[wordIndex];
    const isComplete = visibleText === currentWord;
    const isEmpty = visibleText.length === 0;

    let delay = isDeleting ? DELETE_SPEED_MS : TYPE_SPEED_MS;

    if (isComplete && !isDeleting) {
      delay = HOLD_DURATION_MS;
    } else if (isEmpty && isDeleting) {
      delay = NEXT_WORD_DELAY_MS;
    }

    const timer = window.setTimeout(() => {
      if (isComplete && !isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (isEmpty && isDeleting) {
        setIsDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
        return;
      }

      const nextLength = visibleText.length + (isDeleting ? -1 : 1);
      setVisibleText(currentWord.slice(0, nextLength));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isDeleting, prefersReducedMotion, visibleText, wordIndex, words]);

  if (words.length === 0) {
    return null;
  }

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true" className={className}>
        <span>{prefersReducedMotion ? words[0] : visibleText}</span>
        {!prefersReducedMotion && <span className="type-cursor" />}
      </span>
    </>
  );
}
