import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const mousePos = useRef({ x: -100, y: -100 });
  const borderPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const rafId = useRef(0);
  const visible = useRef(false);

  const animate = useCallback(() => {
    // Ring follows quickly with a snappy 0.65 lerp
    borderPos.current.x += (mousePos.current.x - borderPos.current.x) * 0.65;
    borderPos.current.y += (mousePos.current.y - borderPos.current.y) * 0.65;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
    }
    if (borderRef.current) {
      borderRef.current.style.transform = `translate3d(${borderPos.current.x}px, ${borderPos.current.y}px, 0) translate(-50%, -50%)`;
      const size = hovering.current ? 44 : 26;
      borderRef.current.style.width = `${size}px`;
      borderRef.current.style.height = `${size}px`;
      borderRef.current.style.borderColor = hovering.current ? '#2E7D32' : 'rgba(46, 125, 50, 0.6)';
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 0);
      if (dotRef.current) dotRef.current.style.display = mobile ? 'none' : 'block';
      if (borderRef.current) borderRef.current.style.display = mobile ? 'none' : 'block';
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!visible.current) {
        visible.current = true;
        borderPos.current = { x: e.clientX, y: e.clientY };
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (borderRef.current) borderRef.current.style.opacity = '1';
      }
      // Instant update for dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input, textarea, select, [role='button'], img, .cursor-pointer")) hovering.current = true;
    };
    const onOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input, textarea, select, [role='button'], img, .cursor-pointer")) hovering.current = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <div
        ref={dotRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 6, height: 6, borderRadius: '50%',
          background: '#2E7D32',
          opacity: 0, willChange: 'transform',
          pointerEvents: 'none',
        }}
      />
      <div
        ref={borderRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 26, height: 26, borderRadius: '50%',
          border: '1.5px solid rgba(46, 125, 50, 0.6)',
          opacity: 0,
          transition: 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease',
          willChange: 'transform, width, height',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

