import { useState } from 'react';
import { useTemplateData } from './hooks/useTemplateData';
import type { Template } from './types';
import { ConsentSelector } from './components/ConsentSelector';
import { ConsentForm } from './components/ConsentForm';

export default function App() {
  const templates = useTemplateData();
  const [selected, setSelected] = useState<Template | null>(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',    // centra horizontalmente
        alignItems: 'flex-start',    // pega al top, pero centrado
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 800,              // limita el ancho
          margin: '0 auto',           // margén automático
        }}
      >
        {!selected ? (
          <ConsentSelector
            templates={templates}
            onSelect={t => setSelected(t)}
          />
        ) : (
          <ConsentForm
            template={selected}
            onBack={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}