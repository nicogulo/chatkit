"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";

/** Typewriter effect — types text character by character */
export function TypewriterText({
  texts,
  speed = 60,
  deleteSpeed = 30,
  pauseMs = 2000,
  className = "",
}: {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Calculate min-width based on longest text to prevent layout shift
  const longestText = useMemo(() => texts.reduce((a, b) => (b.length > a.length ? b : a), ""), [texts]);

  useEffect(() => {
    const currentText = texts[textIdx];

    if (!isDeleting && charIdx < currentText.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplay(currentText.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, speed);
    } else if (!isDeleting && charIdx === currentText.length) {
      timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && charIdx > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplay(currentText.slice(0, charIdx - 1));
        setCharIdx(charIdx - 1);
      }, deleteSpeed);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setTextIdx((textIdx + 1) % texts.length);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [charIdx, isDeleting, textIdx, texts, speed, deleteSpeed, pauseMs]);

  return (
    <span className={className} style={{ display: "inline-block", minWidth: `${longestText.length}ch` }}>
      {display}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[1em] bg-primary ml-0.5 align-middle"
      />
    </span>
  );
}

/** Chat bubble with typing animation — fixed height to prevent layout shift */
export function TypingChatBubble({
  text,
  delay = 500,
  speed = 25,
  onComplete,
  className = "",
}: {
  text: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}) {
  const [display, setDisplay] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (display.length >= text.length) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplay(text.slice(0, display.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [display, started, text, speed]);

  return (
    <span className={className} style={{ display: "block", minHeight: "4.5em" }}>
      {display}
      {display.length < text.length && started && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-1.5 h-4 bg-primary ml-0.5"
        />
      )}
    </span>
  );
}

/** Animated counter */
export function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  className = "",
}: {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const step = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span className={className}>{count}{suffix}</span>;
}
