document.querySelectorAll('.nav-link').forEach(link => {
  if (link.dataset.path === window.location.pathname) {
    link.classList.add('text-teal-500')
    link.insertAdjacentHTML('beforeend', '<span class="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0"></span>')
  }
})
