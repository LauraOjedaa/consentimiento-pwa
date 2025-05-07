self.addEventListener('install', event => {
    // fuerza que el SW activo tome el control inmediatamente
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    // controla todas las páginas abiertas
    event.waitUntil(self.clients.claim());
  });
  