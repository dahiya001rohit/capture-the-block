import { motion } from 'framer-motion';
import { reveal, stagger, staggerItem, viewport } from './anim';

const CARDS = [
  {
    span: 'col-span-7', minH: 'min-h-[240px]', bodyMax: 'max-w-[380px]',
    title: 'Instant fanout',
    body: 'Every claim is broadcast to all connected clients over a single persistent socket. No polling, no refresh.',
    stat: '<40', suffix: 'ms p99',
    gradient: "linear-gradient(to bottom, #dc9033ff, #7e3effff)",
  },
  {
    span: 'col-span-5', minH: 'min-h-[240px]', bodyMax: '',
    title: 'Conflict-safe claims',
    body: 'Two players, one tile, same millisecond. The server arbitrates — no double-paints, no rollback.',
    stat: '0', suffix: ' dropped',
    gradient: "linear-gradient(to bottom, #870f3fff, #38ff37ff)",
  },
  {
    span: 'col-span-5', minH: 'min-h-[220px]', bodyMax: '',
    title: 'Live leaderboard',
    body: 'Standings recompute on every single tile flip. Climb or fall in real time.',
    stat: 'realtime', suffix: '',
    gradient: 'linear-gradient(to bottom, #564adeff, #eb3446ff)'
  },
  {
    span: 'col-span-7', minH: 'min-h-[220px]', bodyMax: 'max-w-[380px]',
    title: '3s cooldown loop',
    body: 'A short cooldown after each placement keeps the board fair and the tension frantic. Spend your clicks wisely.',
    stat: '3', suffix: 's cooldown',
    gradient: "linear-gradient(to bottom, #4ADE80, #34D3EB)",
  },
];

export function WhySection() {
  return (
    <section className="mx-auto max-w-[1280px] px-8 pb-28">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewport} className="mb-14">
        <span className="font-mono text-xs tracking-[0.04em] text-[#555555]">[ why it's hard ]</span>
        <h2 className="mt-3.5 font-mono text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.03em]">
          Made to move at the speed of a mob.
        </h2>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-12 gap-4"
      >
        {CARDS.map((c) => (
          <motion.div
            key={c.title}
            variants={staggerItem}
            className={`${c.span} ${c.minH} flex min-w-0 flex-col justify-between gap-10 rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-9`}
          >
            <div>
              <h3 className="mb-2.5 font-mono text-2xl font-semibold tracking-[-0.02em]">{c.title}</h3>
              <p className={`${c.bodyMax} font-sans text-[15px] leading-[1.6] text-[#8E8E8E]`}>{c.body}</p>
            </div>
            <div className={`font-mono text-[clamp(40px,6vw,64px)] font-bold leading-none tracking-[-0.04em] ${c.gradient ? 'bg-clip-text text-transparent' : ''}`} style={c.gradient ? { backgroundImage: c.gradient } : {}}>
              {c.stat}
              {c.suffix && <span className="text-[0.4em] text-[#8E8E8E]">{c.suffix}</span>}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
