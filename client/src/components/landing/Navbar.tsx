import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../state/store';

const LOGO = ['#FF5470', '#4ADE80', '#3BA9FF', '#FFC93C'];

export function Navbar() {
  const navigate = useNavigate();
  const onlineCount = useStore((s) => s.online);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-[#1A1A1A] bg-black/60 px-4 min-[650px]:px-8 py-4 min-[650px]:py-5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="grid grid-cols-2 gap-[2px]">
            {LOGO.map((c) => (
              <span key={c} className="h-[6px] w-[6px] min-[650px]:h-[7px] min-[650px]:w-[7px] rounded-[1px]" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="font-mono text-xs min-[650px]:text-sm font-semibold tracking-[-0.02em] text-[#F5F5F5]">
            capture/the/block
          </span>
        </div>

        <div className="flex items-center gap-4 min-[650px]:gap-6">
          <span className="flex items-center gap-2 font-mono text-[11px] min-[650px]:text-xs text-[#8E8E8E]">
            <span className="relative inline-flex h-1.5 w-1.5 min-[650px]:h-[7px] min-[650px]:w-[7px]">
              <span className="absolute inset-0 rounded-full bg-[#4ADE80]" />
              <span className="absolute inset-0 animate-pulse-dot rounded-full bg-[#4ADE80]" />
            </span>
            {onlineCount.toLocaleString()} <span className="hidden min-[650px]:inline">online</span>
          </span>
          <button
            onClick={() => navigate('/about')}
            className="hidden min-[650px]:block cursor-pointer rounded-md border border-[#F5F5F5] px-4 py-[9px] font-mono text-[13px] font-medium text-[#F5F5F5] transition-transform duration-200 hover:-translate-y-px"
          >
            About
          </button>
          <button
            onClick={() => navigate('/board')}
            className="hidden min-[650px]:block cursor-pointer rounded-md bg-[#F5F5F5] px-4 py-[9px] font-mono text-[13px] font-medium text-black transition-transform duration-200 hover:-translate-y-px hover:bg-white"
          >
            Enter the board
          </button>
          
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="min-[650px]:hidden flex flex-col justify-center items-center w-6 h-6 gap-1"
          >
            <span className={`block h-[2px] w-4 bg-[#F5F5F5] transition-all ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-[2px] w-4 bg-[#F5F5F5] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-4 bg-[#F5F5F5] transition-all ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="min-[650px]:hidden fixed top-[57px] left-0 w-full bg-[#0A0A0A] border-b border-[#1A1A1A] z-40 flex flex-col px-6 py-4 gap-2 shadow-xl">
          <button
            onClick={() => { setMenuOpen(false); navigate('/about'); }}
            className="w-full text-left font-mono text-[14px] text-[#F5F5F5] py-3"
          >
            About
          </button>
          <button
            onClick={() => { setMenuOpen(false); navigate('/board'); }}
            className="w-full text-left font-mono text-[14px] text-[#4ADE80] py-3"
          >
            Enter the board →
          </button>
        </div>
      )}
    </>
  );
}
