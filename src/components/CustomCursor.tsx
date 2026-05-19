import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const borderPos = useRef({ x: 0, y: 0 });
  const dotRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const rafId = useRef(0);
  const visible = useRef(false);

  const animate = useCallback(() => {
    const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

    // Dot follows at 0.55 speed — very close to real-time
    dotPos.current.x = lerp(dotPos.current.x, mousePos.current.x, 0.55);
    dotPos.current.y = lerp(dotPos.current.y, mousePos.current.y, 0.55);
    // Border ring follows at 0.25 speed — slight trail
    borderPos.current.x = lerp(borderPos.current.x, mousePos.current.x, 0.25);
    borderPos.current.y = lerp(borderPos.current.y, mousePos.current.y, 0.25);

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
    }
    if (borderRef.current) {
      borderRef.current.style.transform = `translate3d(${borderPos.current.x}px, ${borderPos.current.y}px, 0) translate(-50%, -50%)`;
      const size = hovering.current ? 48 : 30;
      borderRef.current.style.width = `${size}px`;
      borderRef.current.style.height = `${size}px`;
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
        dotPos.current = { x: e.clientX, y: e.clientY };
        borderPos.current = { x: e.clientX, y: e.clientY };
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (borderRef.current) borderRef.current.style.opacity = '1';
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input, textarea, select, [role='button'], img")) hovering.current = true;
    };
    const onOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a, button, input, textarea, select, [role='button'], img")) hovering.current = false;
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
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
          width: 8, height: 8, borderRadius: '50%',
          background: '#2E7D32',
          opacity: 0, willChange: 'transform',
        }}
      />
      <div
        ref={borderRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 30, height: 30, borderRadius: '50%',
          border: '2px solid #2E7D32',
          opacity: 0,
          transition: 'width 0.2s ease, height 0.2s ease',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
