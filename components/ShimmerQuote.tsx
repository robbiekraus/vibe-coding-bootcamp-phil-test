"use client";

import { useEffect, useRef, useState } from "react";

export default function ShimmerQuote({ text }: { text: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = 220;

      if (distance < radius) {
        const force = (radius - distance) / radius;
        targetPos.current = {
          x: -(dx / distance) * force * 120,
          y: -(dy / distance) * force * 120,
        };
      } else {
        targetPos.current = { x: 0, y: 0 };
      }
    };

    const animate = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.1;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.1;
      setPosition({ x: currentPos.current.x, y: currentPos.current.y });
      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="text-center max-w-4xl"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: "none",
      }}
    >
      <div className="accent-bar mx-auto mb-8" />
      <p className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight shimmer-text">
        &bdquo;{text}&ldquo;
      </p>
      <div className="accent-bar mx-auto mt-8" />
    </div>
  );
}
