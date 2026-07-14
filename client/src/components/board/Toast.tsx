import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../state/store';

export function Toast() {
  const connected = useStore((s) => s.connected);
  const everConnected = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (connected) {
      everConnected.current = true;
      setVisible(false);
    } else if (everConnected.current) {
      setVisible(true);
    }
  }, [connected]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-[60px] left-6 z-[80] flex animate-toast items-center gap-2.5 rounded-lg border border-[#1A1A1A] bg-[#0A0A0A] px-[15px] py-[11px]">
      <span className="relative inline-flex h-[7px] w-[7px]">
        <span className="absolute inset-0 rounded-full bg-[#FFC93C]" />
        <span className="absolute inset-0 animate-pulse-dot rounded-full bg-[#FFC93C]" />
      </span>
      <span className="font-mono text-xs text-[#8E8E8E]">reconnecting…</span>
    </div>
  );
}
