"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type RevealDirection = "up" | "down" | "left" | "right" | "none";
type RevealElement = "div" | "section" | "article" | "li" | "ul";

type RevealProps = {
  as?: RevealElement;
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  duration?: number;
  once?: boolean;
};

const directionClasses: Record<RevealDirection, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "translate-y-0",
};

export function Reveal({
  as,
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 700,
  once = true,
}: RevealProps) {
  const Component = as ?? "div";
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) observer.unobserve(entry.target);
          return;
        }

        if (!once) setIsVisible(false);
      },
      {
        root: null,
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.15,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, once]);

  const revealProps = {
    ref: setElement,
    className: cn(
      "transform-gpu transition-all ease-out will-change-transform motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
      isVisible
        ? "translate-x-0 translate-y-0 opacity-100"
        : cn("opacity-0", directionClasses[direction]),
      className,
    ),
    style: {
      transitionDelay: `${delay}ms`,
      transitionDuration: `${duration}ms`,
    } satisfies CSSProperties,
  };

  if (Component === "section") {
    return <section {...revealProps}>{children}</section>;
  }

  if (Component === "article") {
    return <article {...revealProps}>{children}</article>;
  }

  if (Component === "li") {
    return <li {...revealProps}>{children}</li>;
  }

  if (Component === "ul") {
    return <ul {...revealProps}>{children}</ul>;
  }

  return <div {...revealProps}>{children}</div>;
}
