export class Observable<T> {
    protected readonly events: Map<keyof T, Function[]> = new Map()

    on<K extends keyof T>(type: K, listener: (ev: T[K]) => any) {
        const callbacks = this.events.get(type) || []
        callbacks.push(listener)
        this.events.set(type, callbacks)
    }

    off<K extends keyof T>(type: K, listener: (ev: T[K]) => any) {
        const listeners = this.events.get(type) || []
        const index = listeners.indexOf(listener)
        if (index !== -1) {
            listeners.splice(index, 1)
            this.events.set(type, listeners)
        }
    }

    protected emit<K extends keyof T>(type: K, data: T[K]) {
        const callbacks = this.events.get(type) || []
        callbacks.forEach((callback) => callback(data))
    }
}
