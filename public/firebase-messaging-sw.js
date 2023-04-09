// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
// import { getMessaging, onMessage } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging.js";

importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging.js');


// Inicializa Firebase
var firebaseConfig = {
apiKey: "AIzaSyBmlMjnPJfjV-Syi9EnlCItv1YPGiVDYxM",
authDomain: "vigilant-12535.firebaseapp.com",
databaseURL: "https://vigilant-12535-default-rtdb.firebaseio.com",
projectId: "vigilant-12535",
storageBucket: "vigilant-12535.appspot.com",
messagingSenderId: "948931661447",
appId: "1:948931661447:web:57e681cfe3425dd5f6f222",
measurementId: "G-MQQNC35GBJ"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
});

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});