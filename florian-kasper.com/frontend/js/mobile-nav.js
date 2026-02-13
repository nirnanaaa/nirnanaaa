const openBtn = document.getElementById('mobile-nav-open')
const closeBtn = document.getElementById('mobile-nav-close')
const overlay = document.getElementById('mobile-nav-overlay')
const panel = document.getElementById('mobile-nav-panel')

function open() {
  overlay.classList.remove('hidden')
  panel.classList.remove('hidden')
  overlay.setAttribute('aria-hidden', 'false')
}

function close() {
  overlay.classList.add('hidden')
  panel.classList.add('hidden')
  overlay.setAttribute('aria-hidden', 'true')
}

if (openBtn) openBtn.addEventListener('click', open)
if (closeBtn) closeBtn.addEventListener('click', close)
if (overlay) overlay.addEventListener('click', close)
