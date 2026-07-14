import { Board } from '../components/board/Board';
import { IdentityChip } from '../components/board/IdentityChip';
import { PresenceBadge } from '../components/board/PresenceBadge';
import { Cooldown } from '../components/board/Cooldown';
import { Leaderboard } from '../components/board/Leaderboard';
import { Footer } from '../components/board/Footer';
import { Toast } from '../components/board/Toast';
import { claimTile, renameMe } from '../state/useSocket';

export function BoardPage() {

  return (
    <div className="flex h-screen min-h-[560px] flex-col overflow-hidden bg-black">
      <main className="flex min-h-0 flex-1 flex-wrap items-center justify-center gap-8 overflow-auto p-6">
        <Board onClaim={claimTile} />
        <aside className="flex w-[280px] flex-none flex-col gap-3.5">
          <IdentityChip onRename={renameMe} />
          <PresenceBadge />
          <Cooldown />
          <Leaderboard />
        </aside>
      </main>
      <Footer />
      <Toast />
    </div>
  );
}
