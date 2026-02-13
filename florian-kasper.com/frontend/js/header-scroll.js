const header = document.querySelector('[data-homepage]')
if (header) {
  const headerRef = document.getElementById('header-ref')
  const avatarSpacer = document.getElementById('avatar-spacer')
  let isInitial = true

  function clamp(number, a, b) {
    return Math.min(Math.max(number, Math.min(a, b)), Math.max(a, b))
  }

  function setProperty(property, value) {
    document.documentElement.style.setProperty(property, value)
  }

  function removeProperty(property) {
    document.documentElement.style.removeProperty(property)
  }

  function updateStyles() {
    const downDelay = avatarSpacer ? avatarSpacer.offsetTop : 0
    const upDelay = 64

    const { top, height } = headerRef.getBoundingClientRect()
    const scrollY = clamp(window.scrollY, 0, document.body.scrollHeight - window.innerHeight)

    if (isInitial) {
      setProperty('--header-position', 'sticky')
    }

    setProperty('--content-offset', `${downDelay}px`)

    if (isInitial || scrollY < downDelay) {
      setProperty('--header-height', `${downDelay + height}px`)
      setProperty('--header-mb', `${-downDelay}px`)
    } else if (top + height < -upDelay) {
      const offset = Math.max(height, scrollY - upDelay)
      setProperty('--header-height', `${offset}px`)
      setProperty('--header-mb', `${height - offset}px`)
    } else if (top === 0) {
      setProperty('--header-height', `${scrollY + height}px`)
      setProperty('--header-mb', `${-scrollY}px`)
    }

    if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
      setProperty('--header-inner-position', 'fixed')
      removeProperty('--header-top')
      removeProperty('--avatar-top')
    } else {
      removeProperty('--header-inner-position')
      setProperty('--header-top', '0px')
      setProperty('--avatar-top', '0px')
    }

    // Avatar scale
    const fromScale = 1
    const toScale = 36 / 64
    const fromX = 0
    const toX = 2 / 16

    const avatarScrollY = downDelay - window.scrollY
    let scale = (avatarScrollY * (fromScale - toScale)) / downDelay + toScale
    scale = clamp(scale, fromScale, toScale)

    let x = (avatarScrollY * (fromX - toX)) / downDelay + toX
    x = clamp(x, fromX, toX)

    setProperty('--avatar-image-transform', `translate3d(${x}rem, 0, 0) scale(${scale})`)

    const borderScale = 1 / (toScale / scale)
    const borderX = (-toX + x) * borderScale
    setProperty('--avatar-border-transform', `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`)
    setProperty('--avatar-border-opacity', scale === toScale ? 1 : 0)

    isInitial = false
  }

  updateStyles()
  window.addEventListener('scroll', updateStyles, { passive: true })
  window.addEventListener('resize', updateStyles)
}
