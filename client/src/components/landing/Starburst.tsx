import { motion, useScroll, useTransform } from 'framer-motion';

export function Starburst() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div className="fixed right-0 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-l-md border border-r-0 border-[#1A1A1A] bg-[#0A0A0A] p-3 shadow-lg z-50">
      <motion.svg
        style={{ rotate }}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93M8.46 2.68L15.54 21.32M2.68 8.46L21.32 15.54M21.32 8.46L2.68 15.54M15.54 2.68L8.46 21.32"
          stroke="#E1D333"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}
