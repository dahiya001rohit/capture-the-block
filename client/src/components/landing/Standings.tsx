import { motion } from 'framer-motion';
import { reveal, stagger, staggerItem, viewport } from './anim';

const ROWS = [
  { rank: '01', color: '#FF5470', name: 'void', tiles: '12,094' },
  { rank: '02', color: '#4ADE80', name: 'm4ze', tiles: '9,812' },
  { rank: '03', color: '#34D3EB', name: 'pixelpush', tiles: '8,440' },
  { rank: '04', color: '#A66BFF', name: 'nori', tiles: '7,233' },
  { rank: '05', color: '#FFC93C', name: 'kessler', tiles: '6,901' },
  { rank: '06', color: '#FF6BD6', name: 'dusk', tiles: '5,677' },
];

export function Standings() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-10 px-4 md:px-8 pb-20 md:pb-28">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
        <span className="font-mono text-xs tracking-[0.04em] text-[#555555]">[ standings ]</span>
        <h2 className="mb-6 mt-3.5 font-mono text-[clamp(28px,4vw,40px)] font-semibold tracking-[-0.03em]">
          Who owns the board.
        </h2>
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#1A1A1A] bg-[#0A0A0A] px-4 py-2.5 font-mono text-[13px] text-[#8E8E8E]">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-[#4ADE80]" />
            <span className="absolute inset-0 animate-pulse-dot rounded-full bg-[#4ADE80]" />
          </span>
          <span className="text-[#F5F5F5]">1,284</span> players online right now
        </div>
        <p className="mt-6 max-w-[380px] font-sans text-[15px] leading-[1.6] text-[#555555]">
          Rankings are settled by tile count and recomputed the instant anyone claims. Hold your
          ground or lose it.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#0A0A0A]"
      >
        <motion.div
          variants={staggerItem}
          className="flex justify-between border-b border-[#1A1A1A] px-6 py-4 font-mono text-[11px] tracking-[0.04em] text-[#555555]"
        >
          <span>player</span>
          <span>tiles held</span>
        </motion.div>
        {ROWS.map((r, i) => (
          <motion.div
            key={r.name}
            variants={staggerItem}
            className={`flex items-center gap-4 px-6 py-4 ${i < ROWS.length - 1 ? 'border-b border-[#1A1A1A]' : ''}`}
          >
            <span className="w-5 font-mono text-[13px] text-[#555555]">{r.rank}</span>
            <span className="h-3 w-3 flex-none rounded-[3px]" style={{ backgroundColor: r.color }} />
            <span className="flex-1 font-mono text-[15px]">{r.name}</span>
            <span className="font-mono text-[15px] font-semibold">{r.tiles}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
