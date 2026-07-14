import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { reveal, viewport } from './anim';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="border-t border-[#1A1A1A] bg-black">
      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mx-auto max-w-[1280px] px-4 md:px-8 py-20 md:py-30 text-center"
      >
        <h2 className="mb-7 font-mono text-[clamp(36px,6vw,72px)] font-bold leading-none tracking-[-0.04em] bg-gradient-to-b from-white to-[#444444] bg-clip-text text-transparent">
          The board is<br />already moving.
        </h2>
        <p className="mb-10 font-sans text-[17px] text-[#8E8E8E]">
          Every second you wait, someone takes your tile.
        </p>
        <button
          onClick={() => navigate('/board')}
          className="cursor-pointer rounded-lg bg-[#F5F5F5] px-9 py-[17px] font-mono text-base font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
        >
          Enter the board →
        </button>
      </motion.div>
    </section>
  );
}
