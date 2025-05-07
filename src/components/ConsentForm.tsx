// src/components/ConsentForm.tsx
import { useState, useRef } from 'react';
import type { Template, Field } from '../types';
import SignatureCanvas from 'react-signature-canvas';
import { PdfExporter } from './PdfExporter';

interface Props {
  template: Template;
  onBack: () => void;
}

export function ConsentForm({ template, onBack }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const sigRefs = useRef<Record<string, any>>({});

  const handleChange = (name: string, v: any) => {
    setValues(prev => ({ ...prev, [name]: v }));
  };

  // Aseguramos que el campo "DNI" coincide en mayúsculas con tu JSON
  const requiredFields = [
    'nombre_apellidos',
    'DNI',
    'firma_paciente_1',
    'firma_tecnico_1'
  ];
  const minimalFilled = requiredFields.every(field => Boolean(values[field]));

  const fieldsOnPage = template.fields.filter(f => (f.page || 1) === currentPage);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>↩ Volver</button>

      <div style={{ margin: '10px 0' }}>
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          « Página {currentPage - 1}
        </button>{' '}
        <span>
          Página {currentPage} de {template.srcPages.length}
        </span>{' '}
        <button
          onClick={() => setCurrentPage(p => Math.min(template.srcPages.length, p + 1))}
          disabled={currentPage === template.srcPages.length}
        >
          Página {currentPage + 1} »
        </button>
      </div>

      <div
        id="consent-container"
        style={{
          position: 'relative',
          width: template.imageWidth,
          height: template.imageHeight,
          border: '1px solid #ccc',
          backgroundImage: `url(${template.srcPages[currentPage - 1]})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}
      >
        {fieldsOnPage.map((f: Field, idx) => {
          const baseStyle: React.CSSProperties = {
            position: 'absolute',
            top: f.y,
            left: f.x,
            zIndex: 1
          };

          if (f.type === 'radio') {
            return (
              <div key={`${f.name}_${idx}`} style={baseStyle}>
                {f.options!.map(opt => (
                  <label key={`${f.name}_${opt}`} style={{ marginRight: 12 }}>
                    <input
                      type="radio"
                      name={f.name}
                      value={opt}
                      checked={values[f.name] === opt}
                      onChange={() => handleChange(f.name, opt)}
                      aria-label={opt}   // para accesibilidad
                    />
                    {/* eliminado el texto {opt} */}
                </label>
              ))}
              </div>
            );
          }

          if (f.type === 'signature') {
            return (
              <SignatureCanvas
                key={`${f.name}_${idx}`}
                ref={(c: any) => {
                  sigRefs.current[f.name] = c;
                }}
                penColor="black"
                canvasProps={{
                  style: {
                    ...baseStyle,
                    width: f.width!,
                    height: f.height!,
                    border: '1px dashed #444'
                  }
                }}
                onEnd={() => {
                  const canvas = sigRefs.current[f.name];
                  if (canvas) {
                    handleChange(f.name, canvas.toDataURL());
                  }
                }}
              />
            );
          }

          return (
            <input
              key={`${f.name}_${idx}`}
              type={f.type === 'date' ? 'date' : 'text'}
              placeholder={f.label}
              value={values[f.name] || ''}
              onChange={e => handleChange(f.name, e.target.value)}
              style={{
                ...baseStyle,
                width: f.width,
                padding: '2px',
                border: 'none',
                background: 'transparent',
                color: '#000'
              }}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        {minimalFilled && <PdfExporter values={values} template={template} />}
      </div>
    </div>
  );
}
