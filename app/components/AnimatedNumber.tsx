import { animate } from "motion";
import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({ value, prefix = "€" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });

    prevRef.current = value;
    
    return () => controls.stop();
  }, [value]);

  return <span>{prefix}{display.toFixed(2)}</span>;
}