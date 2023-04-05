self.addEventListener('push', function(e) {
  const data = e.data.json();

  const options = {
    body: data.body,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: "vibration-sample",
    icon: "/warning.png"
  };
  const title = data.title;
  self.registration.showNotification(title,options);
})