import { useStore } from '../../state/store';

export function PresenceBadge() {
  const online = useStore((s) => s.online);

  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[#1A1A1A] bg-[#0A0A0A] px-4 py-3.5">
      <span className="flex items-center gap-[9px] font-mono text-xs text-[#8E8E8E]">
        <span className="relative inline-flex h-[7px] w-[7px]">
          <span className="absolute inset-0 rounded-full bg-[#4ADE80]" />
          <span className="absolute inset-0 animate-pulse-dot rounded-full bg-[#4ADE80]" />
        </span>
        online
      </span>
      <span className="font-mono text-[15px] font-semibold text-[#F5F5F5]">
        {online.toLocaleString()}
      </span>
    </div>
  );
}
