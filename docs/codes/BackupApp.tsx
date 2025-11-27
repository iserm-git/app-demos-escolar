// App.tsx
import { useEffect } from 'react';
import BackupService from './services/BackupService';

export default function App() {
  useEffect(() => {
    // Ejecutar backup automático al abrir la app
    BackupService.scheduleAutoBackup();
  }, []);

  return (
    // Tu app...
  );
}