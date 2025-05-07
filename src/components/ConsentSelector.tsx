// src/components/ConsentSelector.tsx
import type { Template } from '../types';

interface Props {
  templates: Template[];
  onSelect: (t: Template) => void;
}

export function ConsentSelector({ templates, onSelect }: Props) {
  return (
    <div>
      <h2>Elige un consentimiento</h2>
      <ul>
        {templates.map(t => (
          <li key={t.id} style={{ margin: '8px 0' }}>
            <button onClick={() => onSelect(t)}>
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
