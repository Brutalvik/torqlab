import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { ServiceMode } from "./data";

export default function ServiceTransition({
  mode,
  children,
}: {
  mode: ServiceMode;
  children: ReactNode;
}) {
  const shell = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const heightAnimation = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const outer = shell.current,
      inner = content.current;
    if (!outer || !inner) return;
    let previous = inner.getBoundingClientRect().height;
    const observer = new ResizeObserver(() => {
      const next = inner.getBoundingClientRect().height;
      if (Math.abs(next - previous) < 1) return;
      const from = heightAnimation.current?.playState === "running"
        ? outer.getBoundingClientRect().height
        : previous;
      heightAnimation.current?.cancel();
      previous = next;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      heightAnimation.current = outer.animate(
        [{ height: `${from}px` }, { height: `${next}px` }],
        { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    });
    observer.observe(inner);
    return () => {
      observer.disconnect();
      heightAnimation.current?.cancel();
    };
  }, []);
  useLayoutEffect(() => {
    const inner = content.current;
    if (!inner || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const animation = inner.animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 320, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    return () => animation.cancel();
  }, [mode]);
  return (
    <div className="service-transition" ref={shell}>
      <div ref={content}>{children}</div>
    </div>
  );
}

