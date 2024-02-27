
type OnEvent = {
    <K extends keyof HTMLElementEventMap>(
        element: HTMLElement,
        event: K,
        listener: (ev: HTMLElementEventMap[K]) => void
    ): void
    (
        element: HTMLElement,
        event: Array<keyof HTMLElementEventMap>,
        listener: (ev: Event) => void
    ): void
    <K extends keyof DocumentEventMap>(
        element: Document,
        event: K,
        listener: (ev: DocumentEventMap[K]) => void
    ): void
    (
        element: Document,
        event: Array<keyof DocumentEventMap>,
        listener: (ev: Event) => void
    ): void
    <K extends keyof WindowEventMap>(
        element: Window,
        event: K,
        listener: (ev: WindowEventMap[K]) => void
    ): void
    (
        element: Window,
        event: Array<keyof WindowEventMap>,
        listener: (ev: Event) => void
    ): void
}

export const onEvent: OnEvent = function (
    element: HTMLElement | Document | Window,
    event: unknown,
    listener: (ev: Event) => void
) {
    const events = Array.isArray(event) ? event : [event]
    events.forEach((e) => {
        element.addEventListener(e, listener)
    })
}

export function addClassOnEvent(
    element: HTMLElement,
    event: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap>,
    className: string
) {
    // @ts-ignore
    onEvent(element, event, (e) => {
        e.preventDefault()
        element.classList.add(className)
    })
}

export function removeClassOnEvent(
    element: HTMLElement,
    event: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap>,
    className: string
) {
    // @ts-ignore
    onEvent(element, event, (e) => {
        e.preventDefault()
        element.classList.remove(className)
    })
}
