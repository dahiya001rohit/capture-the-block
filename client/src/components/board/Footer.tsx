const LOGO = ['#FF5470', '#4ADE80', '#3BA9FF', '#FFC93C'];

export function Footer() {
  return (
    <footer className="flex flex-none items-center justify-between border-t border-[#1A1A1A] bg-black px-6 py-[11px]">
      <div className="flex items-center gap-[9px]">
        <div className="grid grid-cols-2 gap-[1.5px]">
          {LOGO.map((c) => (
            <span key={c} className="h-[5px] w-[5px] rounded-[1px]" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span className="font-mono text-[11px] text-[#8E8E8E]">capture/the/block</span>
      </div>
      <a
        href="https://github.com/dahiya001rohit/capture-the-block"
        target="_blank"
        rel="noreferrer"
        className="font-mono text-[11px] text-[#555555] no-underline hover:text-[#F5F5F5]"
      >
        GitHub ↗
      </a>
    </footer>
  );
}
