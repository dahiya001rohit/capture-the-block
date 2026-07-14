import { motion } from 'framer-motion';
import { reveal, stagger, staggerItem, viewport } from './anim';

const STEPS = [
  {
    num: '1.',
    color: '#FF8A3D',
    title: 'Open',
    body: "No login, no wait. Land on the board and you're handed a color instantly.",
  },
  {
    num: '2.',
    color: '#4ADE80',
    title: 'Click',
    body: 'Claim any tile on the grid. Already taken? Steal it. Everything is fair game.',
  },
  {
    num: '3.',
    color: '#34D3EB',
    title: 'Watch',
    body: 'Your move lands on every screen worldwide the moment you let go.',
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1280px] px-8 py-28">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewport} className="mb-14">
        <span className="font-mono text-xs tracking-[0.04em] text-[#555555]">[ how it works ]</span>
        <h2 className="mt-3.5 font-mono text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.03em]">
          Three clicks to chaos.
        </h2>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-px overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#1A1A1A]"
      >
        {STEPS.map((s) => (
          <motion.div key={s.num} variants={staggerItem} className="bg-[#0A0A0A] px-8 py-9">
            <div className='flex items-center gap-3'>
              <div className="mb-3 font-mono text-[22px]" style={{ color: s.color }}>{s.num}</div>
              <h3 className="mb-3 font-mono text-[22px] font-semibold tracking-[-0.02em] ">{s.title}</h3>
            </div>
            <p className="font-sans text-[15px] leading-[1.6] text-[#8E8E8E]">{s.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
