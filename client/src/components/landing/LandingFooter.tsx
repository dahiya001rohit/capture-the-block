const LOGO = ['#FF5470', '#4ADE80', '#3BA9FF', '#FFC93C'];

export function LandingFooter() {
  return (
    <footer className="border-t border-[#1A1A1A]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-8 py-7">
        <div className="flex items-center gap-2.5">
          <div className="grid grid-cols-2 gap-[2px]">
            {LOGO.map((c) => (
              <span key={c} className="h-1.5 w-1.5 rounded-[1px]" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="font-mono text-[13px] text-[#8E8E8E]">capture/the/block</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/dahiya001rohit/capture-the-block"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-[#8E8E8E] no-underline transition-colors duration-200 hover:text-[#F5F5F5]"
          >
            GitHub ↗
          </a>
          <span className="font-mono text-xs text-[#555555]">© 2026 · a pixel is never permanent</span>
        </div>
      </div>
    </footer>
  );
}
