import { useEffect, useRef } from 'react'

/**
 * Adds the 'is-visible' class to all elements with the 'reveal' class
 * that are inside the referenced container, as they enter the viewport.
 *
 * Usage: attach the returned ref to a wrapper element.
 * Or call useInView() with no ref to observe the whole document.
 */
export function useInView() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return ref
}
