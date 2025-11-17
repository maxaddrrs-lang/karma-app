// This is the service worker file.

self.addEventListener('push', event => {
  try {
    const data = event.data.json();
    const title = data.title || 'پیام جدید در کارما';
    const options = {
      body: data.body,
      icon: '/logo.png', // A path to an icon
      badge: '/badge.png', // A path to a smaller badge icon
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
     // Fallback for plain text pushes
    const title = 'پیام جدید در کارما';
    const options = {
      body: event.data.text(),
      icon: '/logo.png',
      badge: '/badge.png',
    };
     event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});
