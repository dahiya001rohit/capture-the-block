import { motion } from 'framer-motion';
import { reveal, stagger, staggerItem, viewport } from './anim';

const STEPS = [
  {
    titleColor: '#FF8A3D',
    title: 'Open.',
    body: "No login, no wait. Land on the board and you're handed a color instantly.",
    gradient: "linear-gradient(to top, #E66F25 30%, #E02B56 70%, #9333EA 100%)"
  },
  {
    titleColor: '#4ADE80',
    title: 'Click.',
    body: 'Claim any tile on the grid. Already taken? Steal it. Everything is fair game.',
    gradient: "linear-gradient(to top, #22C55E 30%, #059669 70%, #0284C7 100%)"
  },
  {
    titleColor: '#34D3EB',
    title: 'Watch.',
    body: 'Your move lands on every screen worldwide the moment you let go.',
    gradient: "linear-gradient(to top, #0EA5E9 30%, #2563EB 70%, #7C3AED 100%)"
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-28">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={viewport} className="mb-10 md:mb-14">
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
        className="grid grid-cols-1 md:grid-cols-3 gap-px overflow-hidden rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] text-black"
      >
        {STEPS.map((s) => (
          <motion.div 
            key={s.title} 
            variants={staggerItem} 
            className="px-6 md:px-8 py-7 md:py-9"
            style={{ backgroundImage: s.gradient }}
          >
            <div className='flex items-center justify-center gap-3 '>
              {/* <div className="mb-3 font-mono text-[22px]" style={{ color: s.color }}>{s.num}</div> */}
              <h3 
                className="mb-3 font-mono text-[30px] font-bold tracking-[-0.02em] uppercase bg-clip-text text-transparent"
                style={{ backgroundColor: s.titleColor }}
              >
                {s.title}
              </h3>
            </div>
            <p className={`font-sans text-[18px] text-center font-thin leading-[1.5] `}>{s.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
