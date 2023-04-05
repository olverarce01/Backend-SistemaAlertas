const publicVapidKey = "BHx1_b840Qf4vYkGDm5eblz25Cm_vY0HAQDZvfM941SUMSKEk_uFo4d4-vl_4-1WIXZ-VcwPiIBoHKiFKdH3Fc4";

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const subscription = async()=>{

  //Service worker
  const register = await navigator.serviceWorker.register('/worker.js',{
    scope: '/'
  });
  console.log('new service worker')

  const subscript = await register.pushManager.subscribe({
    userVisibleOnly:true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  await fetch("/subscription", {
    method: "POST",
    body: JSON.stringify(subscript),
    headers: {
        "Content-Type": "application/json",
    }
  })  
  console.log('usuario subscrito')
}
subscription();


