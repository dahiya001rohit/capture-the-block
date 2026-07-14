import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { PALETTE } from '../../types';
import { EASE } from './anim';

const COLS = 24;
const ROWS = 16;

// imperative live grid: 24×16 tiles, random flips with a brightness flash
function MiniGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const tiles: HTMLDivElement[] = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const d = document.createElement('div');
      d.style.aspectRatio = '1';
      d.style.borderRadius = '1.5px';
      d.style.transition = 'background-color .45s cubic-bezier(.23,1,.32,1), filter .4s ease';
      d.style.backgroundColor =
        Math.random() < 0.28 ? PALETTE[(Math.random() * PALETTE.length) | 0]! : '#141414';
      grid.appendChild(d);
      tiles.push(d);
    }

    const flip = (t: HTMLDivElement, color: string) => {
      t.style.backgroundColor = color;
      t.style.filter = 'brightness(1.55)';
      setTimeout(() => { t.style.filter = 'brightness(1)'; }, 170);
    };

    const per = reduced ? 1 : 8;
    const interval = setInterval(() => {
      for (let k = 0; k < per; k++) {
        const t = tiles[(Math.random() * tiles.length) | 0]!;
        // some flips fade back to dark, keeping density dynamic
        const color = Math.random() < 0.14
          ? '#141414'
          : PALETTE[(Math.random() * PALETTE.length) | 0]!;
        flip(t, color);
      }
    }, reduced ? 700 : 150);

    return () => { clearInterval(interval); grid.replaceChildren(); };
  }, []);

  return <div ref={ref} className="grid w-full grid-cols-[repeat(24,1fr)] gap-[2px]" />;
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-8 md:gap-14 px-4 md:px-8 pb-16 md:pb-24 pt-10 md:pt-[72px]">
      <motion.div
        className="min-w-[320px] flex-[1_1_420px]"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={item}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1A1A1A] bg-[#0A0A0A] px-3 py-1.5 font-mono text-xs text-[#8E8E8E]"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-[#FF5470]" />
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-[#FF5470]" />
          </span>
          live · one shared canvas
        </motion.div>

        <h1 className="mb-6 font-mono text-[clamp(44px,7.5vw,92px)] font-bold leading-[0.96] tracking-[-0.04em]">
          <motion.span variants={item} className="block">Claim the</motion.span>
          <motion.span variants={item} className="block">
            block. <span className="text-green-400">Live.</span>
          </motion.span>
        </h1>

        <motion.p
          variants={item}
          className="mb-9 max-w-[460px] font-sans text-[clamp(16px,1.6vw,19px)] leading-[1.55] text-[#8E8E8E]"
        >
          A shared grid where every tile is up for grabs. Pick a color, click to claim, and watch
          the whole board flip in real time as thousands fight for territory.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/board')}
            className="cursor-pointer rounded-lg bg-[#F5F5F5] px-6 md:px-7 py-3.5 md:py-[15px] font-mono text-[13px] md:text-[15px] font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 w-full md:w-auto"
          >
            Enter the board →
          </button>
          <span className="font-mono text-[11px] md:text-[13px] text-[#555555] mx-auto md:mx-0">No login · pick a color · go</span>
        </motion.div>
      </motion.div>

      <div className="min-w-[300px] flex-[1_1_460px]">
        <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-3.5">
          <div className="mb-3 flex items-center justify-between px-[2px]">
            <span className="font-mono text-[11px] text-[#555555]">board · sector 7</span>
            <span className="font-mono text-[11px] text-[#8E8E8E]">38,402 tiles claimed</span>
          </div>
          <MiniGrid />
        </div>
      </div>
    </section>
  );
}
