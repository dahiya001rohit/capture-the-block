import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { reveal, viewport } from '../components/landing/anim';
import { LandingFooter } from '../components/landing/LandingFooter';

const LOGO = ['#FF5470', '#4ADE80', '#3BA9FF', '#FFC93C'];

const STACK = [
  { color: '#22D3EE', name: 'React + Vite', desc: 'Client — the board UI, optimistic paint, and live updates.' },
  { color: '#4ADE80', name: 'Node · Express · Socket.io', desc: 'Server — accepts claims, resolves races, fans out events.' },
  { color: '#F472B6', name: 'Redis', desc: 'Atomic claims, the live leaderboard, presence, and pub/sub.' },
  { color: '#FFC93C', name: 'Postgres', desc: 'Durable source of truth — the board survives a restart.' }
];

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-[#F5F5F5] font-sans selection:bg-[#333] selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="grid grid-cols-2 gap-[2px]">
            {LOGO.map((c) => (
              <span key={c} className="h-[7px] w-[7px] rounded-[1px]" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="font-mono text-sm font-semibold tracking-[-0.02em] text-[#F5F5F5]">
            capture/the/block
          </span>
        </Link>
        <Link to="/board" className="font-mono text-[13px] text-[#8E8E8E] transition-colors hover:text-white no-underline">
          ← back to board
        </Link>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[760px] px-8 pt-20 pb-40">
        <motion.div variants={reveal} initial="hidden" animate="show" viewport={viewport}>
          <div className="flex gap-[2px] mb-10">
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#333]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#A855F7]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#3BA9FF]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#F472B6]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#FFC93C]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#3BA9FF]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#4ADE80]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#333]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#4ADE80]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#FF5470]" />
            <div className="h-[10px] w-[10px] rounded-[1px] bg-[#333]" />
          </div>
          
          <span className="font-mono text-[13px] tracking-[0.04em] text-[#555555]">[ about ]</span>
          <h1 className="mt-4 mb-6 font-mono text-[clamp(44px,7vw,72px)] font-bold leading-none tracking-[-0.04em]">
            About
          </h1>
          <p className="max-w-[640px] font-sans text-[17px] leading-[1.6] text-[#8E8E8E]">
            One shared grid. No accounts. Click a tile, it's yours — until someone takes it back. A small experiment in real-time, contested space.
          </p>
        </motion.div>

        <hr className="my-20 border-t border-[#1A1A1A]" />

        <motion.section variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
          <h2 className="mb-8 font-mono text-[12px] tracking-[0.1em] text-[#555555] uppercase">
            01 — WHAT IT IS
          </h2>
          <div className="flex flex-col gap-6 font-sans text-[15px] leading-[1.7] text-[#8E8E8E]">
            <p>
              Capture the Block is a single canvas of square tiles that everyone online shares at the same time. When you arrive you're given an anonymous identity and a color — no sign-up, no email, nothing to remember.
            </p>
            <p>
              Click any tile and it becomes yours, painted in your color. Tiles that already belong to someone else aren't off-limits — <span className="text-[#F5F5F5]">stealing is the whole point</span>. A short cooldown after each move keeps the board fair and the pressure on.
            </p>
            <p>
              Everything you do is visible to everyone, instantly. There's no turn order and no winner screen — just a living surface that never stops shifting.
            </p>
          </div>
        </motion.section>

        <hr className="my-20 border-t border-[#1A1A1A]" />

        <motion.section variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
          <h2 className="mb-8 font-mono text-[12px] tracking-[0.1em] text-[#555555] uppercase">
            02 — HOW IT WORKS
          </h2>
          <p className="mb-10 font-sans text-[15px] leading-[1.7] text-[#8E8E8E]">
            A click takes a clear path from your screen to everyone else's. The trick is making it feel instant for you while staying correct for the crowd.
          </p>

          <div className="rounded-xl border border-[#1A1A1A] bg-[#0A0A0A] p-8 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 rounded-lg border border-[#1A1A1A] bg-[#050505] p-5">
                <div className="h-2.5 w-2.5 bg-[#22D3EE] mb-4" />
                <div className="font-mono text-[13px] font-semibold mb-2 text-[#F5F5F5]">client clicks</div>
                <div className="font-mono text-[11px] text-[#8E8E8E]">you pick a tile</div>
              </div>
              <div className="flex items-center justify-center text-[#333] hidden md:flex">→</div>
              <div className="flex-1 rounded-lg border border-[#1A1A1A] bg-[#050505] p-5">
                <div className="h-2.5 w-2.5 bg-[#4ADE80] mb-4" />
                <div className="font-mono text-[13px] font-semibold mb-2 text-[#F5F5F5]">optimistic paint</div>
                <div className="font-mono text-[11px] text-[#8E8E8E]">fills instantly, locally</div>
              </div>
              <div className="flex items-center justify-center text-[#333] hidden md:flex">→</div>
              <div className="flex-1 rounded-lg border border-[#1A1A1A] bg-[#050505] p-5">
                <div className="h-2.5 w-2.5 bg-[#FFC93C] mb-4" />
                <div className="font-mono text-[13px] font-semibold mb-2 text-[#F5F5F5]">server resolves</div>
                <div className="font-mono text-[11px] text-[#8E8E8E]">race settled atomically</div>
              </div>
              <div className="flex items-center justify-center text-[#333] hidden md:flex">→</div>
              <div className="flex-1 rounded-lg border border-[#1A1A1A] bg-[#050505] p-5">
                <div className="h-2.5 w-2.5 bg-[#F472B6] mb-4" />
                <div className="font-mono text-[13px] font-semibold mb-2 text-[#F5F5F5]">broadcast</div>
                <div className="font-mono text-[11px] text-[#8E8E8E]">every client updates</div>
              </div>
            </div>
            <div className="rounded-lg border border-[#1A1A1A] bg-[#050505] p-5">
              <div className="h-2.5 w-2.5 bg-[#A855F7] mb-4" />
              <div className="font-mono text-[13px] font-semibold mb-2 text-[#F5F5F5]">reconcile</div>
              <div className="font-mono text-[11px] text-[#8E8E8E]">truth wins if they differ</div>
            </div>
            <p className="mt-8 font-mono text-[11px] leading-[1.6] text-[#555555]">
              If the server disagrees with your optimistic paint — someone beat you by a few milliseconds — your tile quietly snaps to the real owner. No error, no retry, just the truth.
            </p>
          </div>
        </motion.section>

        <hr className="my-20 border-t border-[#1A1A1A]" />

        <motion.section variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
          <h2 className="mb-8 font-mono text-[12px] tracking-[0.1em] text-[#555555] uppercase">
            03 — THE HARD PART
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-xl border border-[#1A1A1A] bg-[#1A1A1A] overflow-hidden">
            <div className="bg-[#0A0A0A] p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 bg-[#FF5470]" />
                <h3 className="font-mono text-[15px] font-semibold">Fanout</h3>
              </div>
              <p className="font-sans text-[14px] leading-[1.6] text-[#8E8E8E]">
                One claim has to reach every connected client at once. Persistent WebSockets push the change out instead of clients asking for it.
              </p>
            </div>
            <div className="bg-[#0A0A0A] p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 bg-[#4ADE80]" />
                <h3 className="font-mono text-[15px] font-semibold">Conflicts</h3>
              </div>
              <p className="font-sans text-[14px] leading-[1.6] text-[#8E8E8E]">
                Two people click the same tile in the same instant. The server resolves it deterministically so there's never a torn, half-claimed state.
              </p>
            </div>
            <div className="bg-[#0A0A0A] p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 bg-[#FFC93C]" />
                <h3 className="font-mono text-[15px] font-semibold">Atomicity</h3>
              </div>
              <p className="font-sans text-[14px] leading-[1.6] text-[#8E8E8E]">
                Ownership and every player's tile count must change together. Under load they update as one operation — never one without the other.
              </p>
            </div>
            <div className="bg-[#0A0A0A] p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 bg-[#A855F7]" />
                <h3 className="font-mono text-[15px] font-semibold">Scale</h3>
              </div>
              <p className="font-sans text-[14px] leading-[1.6] text-[#8E8E8E]">
                More players than one server can hold means many instances. A pub/sub layer keeps them all in sync so the board stays one board.
              </p>
            </div>
          </div>
        </motion.section>

        <hr className="my-20 border-t border-[#1A1A1A]" />

        <motion.section variants={reveal} initial="hidden" whileInView="show" viewport={viewport}>
          <h2 className="mb-8 font-mono text-[12px] tracking-[0.1em] text-[#555555] uppercase">
            04 — STACK
          </h2>
          <div className="flex flex-col">
            {STACK.map((item, i) => (
              <div key={i} className={`flex flex-col md:flex-row md:items-center py-5 ${i !== STACK.length - 1 ? 'border-b border-[#1A1A1A]' : ''}`}>
                <div className="flex items-center gap-2.5 md:w-[260px] mb-2 md:mb-0">
                  <div className="h-1.5 w-1.5 bg-current" style={{ color: item.color }} />
                  <span className="font-mono text-[13px] font-semibold text-[#F5F5F5]">{item.name}</span>
                </div>
                <div className="font-sans text-[14px] text-[#8E8E8E] flex-1">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </main>

      {/* CTA Block & Footer */}
      <div className="border-t border-[#1A1A1A] flex flex-col items-center justify-center py-32 text-center">
        <h2 className="mb-8 font-mono text-[clamp(28px,5vw,48px)] font-bold leading-none tracking-[-0.04em] text-[#F5F5F5]">
          Enough reading.<br/>The board is moving.
        </h2>
        <button onClick={() => navigate('/board')} className="cursor-pointer rounded-lg bg-[#F5F5F5] px-8 py-[17px] font-mono text-[15px] font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5 no-underline">
          Enter the board →
        </button>
      </div>

      <LandingFooter />
    </div>
  );
}
