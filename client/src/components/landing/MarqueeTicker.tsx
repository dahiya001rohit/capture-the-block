import { Fragment } from 'react';

const ITEMS = [
  'steal allowed', '3s cooldown', 'no accounts', 'instant fanout',
  '20 colors', 'one canvas', 'every tile contested',
];

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden || undefined} className="flex items-center gap-8 pr-8">
      {ITEMS.map((t) => (
        <Fragment key={t}>
          <span>{t}</span>
          <span className="text-[#1A1A1A]">/</span>
        </Fragment>
      ))}
    </span>
  );
}

export function MarqueeTicker() {
  return (
    <div className="overflow-hidden border-y border-[#1A1A1A] bg-black py-3.5">
      <div className="flex w-max animate-marquee whitespace-nowrap font-mono text-[13px] text-[#555555]">
        <Run />
        <Run hidden />
      </div>
    </div>
  );
}
