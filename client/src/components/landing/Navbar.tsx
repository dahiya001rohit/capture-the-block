import { useNavigate } from 'react-router-dom';

const LOGO = ['#FF5470', '#4ADE80', '#3BA9FF', '#FFC93C'];

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#1A1A1A] bg-black/60 px-8 py-5 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="grid grid-cols-2 gap-[2px]">
          {LOGO.map((c) => (
            <span key={c} className="h-[7px] w-[7px] rounded-[1px]" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span className="font-mono text-sm font-semibold tracking-[-0.02em] text-[#F5F5F5]">
          capture/the/block
        </span>
      </div>

      <div className="flex items-center gap-6">
        <span className="flex items-center gap-2 font-mono text-xs text-[#8E8E8E]">
          <span className="relative inline-flex h-[7px] w-[7px]">
            <span className="absolute inset-0 rounded-full bg-[#4ADE80]" />
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-[#4ADE80]" />
          </span>
          1,284 online
        </span>
        <button
          onClick={() => navigate('/about')}
          className="cursor-pointer rounded-md border border-[#F5F5F5] px-4 py-[9px] font-mono text-[13px] font-medium text-[#F5F5F5] transition-transform duration-200 hover:-translate-y-px"
        >
          About
        </button>
        <button
          onClick={() => navigate('/board')}
          className="cursor-pointer rounded-md bg-[#F5F5F5] px-4 py-[9px] font-mono text-[13px] font-medium text-black transition-transform duration-200 hover:-translate-y-px hover:bg-white"
        >
          Enter the board
        </button>
      </div>
    </nav>
  );
}
