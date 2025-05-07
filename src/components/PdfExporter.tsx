// src/components/PdfExporter.tsx
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Template, Field } from '../types';

interface Props {
  values: Record<string, any>;
  template: Template;
}

export function PdfExporter({ values, template }: Props) {
  const handleExport = async () => {
    const yOffset = -3;
    const fontSize = 12;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let pageIndex = 0; pageIndex < template.srcPages.length; pageIndex++) {
      const page = pdfDoc.addPage([template.imageWidth, template.imageHeight]);

      // Fondo
      const imgBytes = await fetch(template.srcPages[pageIndex]).then(r => r.arrayBuffer());
      const bg = await pdfDoc.embedPng(imgBytes);
      page.drawImage(bg, {
        x: 0, y: 0,
        width: template.imageWidth,
        height: template.imageHeight
      });

      // 1) TEXTOS (solo TEXT y DATE, no radio ni signature)
      template.fields
        .filter((f: Field) => (f.page || 1) === pageIndex + 1 && f.type !== 'signature' && f.type !== 'radio')
        .forEach(f => {
          const text = (values[f.name] || '').toString();
          page.drawText(text, {
            x: f.x,
            y: template.imageHeight - f.y - fontSize + yOffset,
            size: fontSize,
            font,
            color: rgb(0, 0, 0)
          });
        });

      // 2) RADIOS: dibujar "X" solo en la opción marcada
      template.fields
        .filter((f: Field) => (f.page || 1) === pageIndex + 1 && f.type === 'radio')
        .forEach(f => {
          const selected = values[f.name];       // "SI" o "NO"
          const option = f.options![0];          // tu JSON guarda ["SI"] o ["NO"]
          if (selected === option) {
            // Ajusta el +2, -2 para centrar la X dentro de la casilla
            page.drawText('X', {
              x: f.x + 2,
              y: template.imageHeight - f.y - fontSize + yOffset + 2,
              size: fontSize,
              font,
              color: rgb(0, 0, 0)
            });
          }
        });

      // 3) FIRMAS
      const sigFields = template.fields.filter(
        f => (f.page || 1) === pageIndex + 1 && f.type === 'signature'
      );
      for (const f of sigFields) {
        const dataUrl: string = values[f.name];
        if (!dataUrl) continue;
        const base64 = dataUrl.split(',')[1];
        const bin = atob(base64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const sigImg = await pdfDoc.embedPng(bytes);
        page.drawImage(sigImg, {
          x: f.x,
          y: template.imageHeight - f.y - (f.height ?? 0) + yOffset,
          width: f.width ?? 0,
          height: f.height ?? 0
        });
      }
    }

    // Descarga igual que antes...
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const rawName = values['nombre_apellidos']?.trim() || template.id;
    const safeName = rawName.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return <button onClick={handleExport}>Descargar PDF</button>;
}
