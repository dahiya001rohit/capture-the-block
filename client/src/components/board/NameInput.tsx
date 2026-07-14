import { useEffect, useRef } from 'react';
import { useStore } from '../../state/store';
import { NAME_MAX } from '../../types';

interface Props {
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function NameInput({ value, hasError, onChange, onSave, onCancel }: Props) {
  const color = useStore((s) => s.you?.color ?? '#34D3EB');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      maxLength={NAME_MAX + 2}
      placeholder="your name"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); onSave(); }
        else if (e.key === 'Escape') onCancel();
      }}
      onBlur={onSave}
      className="w-full rounded-md border bg-black px-2 py-[5px] font-mono text-[15px] text-[#F5F5F5] outline-none"
      style={{ borderColor: hasError ? '#FF5470' : color }}
    />
  );
}
