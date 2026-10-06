export function scheduleOnLoad(run: () => void): void {
  const onIdle = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run)
    } else {
      run()
    }
  }

  if (document.readyState === 'complete') {
    onIdle()
    return
  }

  window.addEventListener('load', onIdle, { once: true })
}
