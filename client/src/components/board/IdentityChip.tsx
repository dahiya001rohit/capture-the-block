import { useState } from 'react';
import { useStore } from '../../state/store';
import { NAME_MAX } from '../../types';
import { NameInput } from './NameInput';

interface Props {
  onRename: (name: string) => void;
}

export function IdentityChip({ onRename }: Props) {
  const you = useStore((s) => s.you);
  const setMyName = useStore((s) => s.setMyName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const startEdit = () => {
    setDraft(you?.name ?? '');
    setError('');
    setEditing(true);
  };

  const save = () => {
    const v = draft.trim();
    if (!v) return setError("name can't be empty");
    if (v.length > NAME_MAX) return setError(`max ${NAME_MAX} characters`);
    setMyName(v);
    onRename(v);
    setEditing(false);
  };

  const hint = editing
    ? error || `${draft.length}/${NAME_MAX} · enter to save`
    : 'no login · color is yours for the session';
  const hintColor = editing && error ? '#FF5470' : '#555555';

  return (
    <div className="rounded-[10px] border border-[#1A1A1A] bg-[#0A0A0A] p-4">
      <div className="flex items-center gap-3">
        <span
          className="h-[26px] w-[26px] flex-none rounded-sm shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.85)]"
          style={{ backgroundColor: you?.color ?? '#1A1A1A' }}
        />
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] tracking-[0.04em] text-[#555555]">you</div>
          {editing ? (
            <NameInput
              value={draft}
              hasError={!!error}
              onChange={(v) => { setDraft(v); setError(''); }}
              onSave={save}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="truncate font-mono text-[15px] text-[#F5F5F5]">
                {you?.name ?? '…'}
              </span>
              <button
                onClick={startEdit}
                className="flex-none cursor-pointer font-mono text-[11px] text-[#8E8E8E] hover:text-[#F5F5F5]"
              >
                edit
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2.5 min-h-3.5 font-mono text-[11px]" style={{ color: hintColor }}>
        {hint}
      </div>
    </div>
  );
}
