"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  opacity: number;
};

const PARTICLE_DENSITY = 18_000;
const MAX_PARTICLES = 72;
const CONNECTION_DISTANCE = 130;

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let particles: Particle[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let isPageVisible = !document.hidden;

    const createParticle = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      velocityX: (Math.random() - 0.5) * 0.22,
      velocityY: (Math.random() - 0.5) * 0.22,
      radius: Math.random() * 1.2 + 0.45,
      opacity: Math.random() * 0.45 + 0.2,
    });

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particleCount = Math.min(
        MAX_PARTICLES,
        Math.max(24, Math.floor((width * height) / PARTICLE_DENSITY)),
      );

      particles = Array.from({ length: particleCount }, createParticle);
    };

    const drawParticle = (particle: Particle) => {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(103, 232, 249, ${particle.opacity})`;
      context.shadowColor = "rgba(0, 102, 255, 0.65)";
      context.shadowBlur = 8;
      context.fill();
      context.shadowBlur = 0;
    };

    const drawConnections = () => {
      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < particles.length;
          secondIndex += 1
        ) {
          const first = particles[firstIndex];
          const second = particles[secondIndex];
          const distanceX = first.x - second.x;
          const distanceY = first.y - second.y;
          const distance = Math.hypot(distanceX, distanceY);

          if (distance >= CONNECTION_DISTANCE) {
            continue;
          }

          const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.13;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;
    };

    const renderFrame = () => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!mediaQuery.matches) {
          updateParticle(particle);
        }
        drawParticle(particle);
      }

      drawConnections();

      if (isPageVisible && !mediaQuery.matches) {
        animationFrame = window.requestAnimationFrame(renderFrame);
      }
    };

    const startAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      renderFrame();
    };

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden;

      if (isPageVisible) {
        startAnimation();
      } else {
        window.cancelAnimationFrame(animationFrame);
      }
    };

    const handleMotionChange = () => startAnimation();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      startAnimation();
    });

    resizeObserver.observe(canvas);
    mediaQuery.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    resizeCanvas();
    startAnimation();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
