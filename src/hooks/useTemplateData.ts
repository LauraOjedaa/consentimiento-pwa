import { useState, useEffect } from 'react';
import type { Template } from '../types';
import rawTemplates from '../data/templates.json';

export function useTemplateData() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    setTemplates(rawTemplates as Template[]);
  }, []);

  return templates;
}