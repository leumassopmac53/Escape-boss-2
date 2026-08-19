const CACHE = "v1-test"
const ARQS = [
  "./index.html",
  "./game.js"
]

self.addEventListener("install",(e)=>{
  e.waitUntil(
    caches.open(CACHE).then(cache =>{
      return cache.addAll(ARQS)
    })
  )
})

self.addEventListener("activate",(e)=>{
  e.waitUntil(
    caches.keys().then(cache =>{
      return Promise.all(
        cache.filter(c => c !== CACHE).map(c => caches.delete(c))
      )
    })
  )
})

self.addEventListener("fetch",(e)=>{
  e.respondWith(
    fetch(e.request).then(response =>{
      const clone = response.clone()
      
      caches.open(CACHE).then(cache => cache.put(e.request,clone))
      return response
    }).catch(err => caches.match(e.request))
  )
})