'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const particleCount = width < 768 ? 20 : 36;
    const colors = [
      'rgba(233, 30, 99, 0.45)',
      'rgba(194, 24, 91, 0.35)',
      'rgba(240, 98, 146, 0.5)',
      'rgba(212, 175, 55, 0.55)',
      'rgba(255, 235, 170, 0.65)',
    ];

    class Particle {
      x = Math.random() * width;
      y = Math.random() * -height;
      size = Math.random() * 8 + 4;
      speedY = Math.random() * 1.2 + 0.6;
      speedX = Math.sin(Math.random() * 6) * 0.8;
      angle = Math.random() * 360;
      angularSpeed = (Math.random() - 0.5) * 1.5;
      color = colors[Math.floor(Math.random() * colors.length)];
      isPetal = Math.random() > 0.4;

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 1.2 + 0.6;
        this.speedX = Math.sin(Math.random() * 6) * 0.8;
        this.angle = Math.random() * 360;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.015) * 0.7 + this.speedX * 0.3;
        this.angle += this.angularSpeed;

        if (this.y > height + 20) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = this.color;

        if (this.isPetal) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.4);
          ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[2]" />;
}

