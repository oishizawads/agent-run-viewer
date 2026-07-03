'use client';

import { useState, type ReactNode } from 'react';

export interface TabDef {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export function Tabs({ tabs, defaultId }: { tabs: TabDef[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  if (!current) return null;
  return (
    <div>
      <div
        role="tablist"
        className="flex flex-wrap gap-1 overflow-x-auto border-b border-slate-200"
      >
        {tabs.map((t) => {
          const selected = t.id === current.id;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              className={`whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                selected
                  ? 'border-b-2 border-sky-500 text-sky-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" className="mt-4">
        {current.content}
      </div>
    </div>
  );
}
