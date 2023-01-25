console.log('Service Worker: Registered');

const staticPianoEncyclopedia = "pianoencyclopedia-global-v1";

const baseDirectory = "https://pianoencyclopedia.com/en/app-global"
const assets = [
  baseDirectory,
  baseDirectory + "/index.html",
  baseDirectory + "/js/app.js",
  baseDirectory + "/img/logo-transparent-BG.png",
  baseDirectory + "/img/icons/icon-192x192.png",
  baseDirectory + "/img/icons/icon-256x256.png",
  baseDirectory + "/img/icons/icon-384x384.png",
  baseDirectory + "/img/icons/icon-512x512.png"
]   

// const assets = [
//     "./",
//     "./index.html",
//     "./js/app.js",
//     "./img/logo-transparent-BG.png",
//     "./img/icons/icon-192x192.png",
//     "./img/icons/icon-256x256.png",
//     "./img/icons/icon-384x384.png",
//     "./img/icons/icon-512x512.png"
// ]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticPianoEncyclopedia).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      }) 
    )
})