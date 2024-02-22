type Key = '+' | '-' | '_' | '=' | 'y' | 'z' | 'Y' | 'Z'

type BindOptions = {
    key: Key
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
    caseSensitive?: boolean
}

type KeyBind = {
    type: 'keydown' | 'keyup' | 'keypress'
    bindOptions: BindOptions
    callback: (e: KeyboardEvent) => void
}

export class Shortcut {
    private static keys: Key[] = ['+', '-', '_', '=', 'y', 'z', 'Y', 'Z']
    private static binds = new Map<Key, KeyBind[]>()
    private static listeningUp = false
    private static listeningDown = false
    private static listeningPress = false

    private static handleKeyEvent(e: KeyboardEvent) {
        e.preventDefault()
        const key = e.key as Key
        if (!this.binds.has(key)) return
        const keyBinds = this.binds.get(key) as KeyBind[]
        keyBinds.forEach(({ bindOptions, type, callback }) => {
            if (this.matchBind(type, bindOptions, e)) {
                callback(e)
            }
        })
    }

    private static matchBind(
        type: KeyBind['type'],
        bindOptions: BindOptions,
        e: KeyboardEvent
    ) {
        if (type !== e.type) return false
        if (bindOptions.ctrl && !e.ctrlKey) return false
        if (bindOptions.shift && !e.shiftKey) return false
        if (bindOptions.alt && !e.altKey) return false
        if (bindOptions.meta && !e.metaKey) return false
        return true
    }

    private static parseShortcuts(
        shortcut: string
    ): Array<BindOptions | false> {
        const shortcuts = shortcut.split(',').map((s) => s.trim())
        return shortcuts.map((shortcut) => this.parseShortcut(shortcut))
    }

    private static parseShortcut(shortcut: string): BindOptions | false {
        const keys = shortcut.split('+').map((s) => s.trim())

        const ctrlIndex = keys.indexOf('ctrl')
        if (ctrlIndex !== -1) {
            keys.splice(ctrlIndex, 1)
        }

        const shiftIndex = keys.indexOf('shift')
        if (shiftIndex !== -1) {
            keys.splice(shiftIndex, 1)
        }

        const altIndex = keys.indexOf('alt')
        if (altIndex !== -1) {
            keys.splice(altIndex, 1)
        }

        const metaIndex = keys.indexOf('meta')
        if (metaIndex !== -1) {
            keys.splice(metaIndex, 1)
        }

        if (keys.length > 1) {
            return false
        }

        if (!this.keys.includes(keys[0] as Key)) {
            return false
        }

        return {
            key: keys[0] as Key,
            ctrl: ctrlIndex !== -1,
            shift: shiftIndex !== -1,
            alt: altIndex !== -1,
            meta: metaIndex !== -1,
        }
    }

    private static getKeys(bindOptions: BindOptions): Key[] {
        if (!bindOptions.caseSensitive && /[a-z]/i.test(bindOptions.key)) {
            return [
                bindOptions.key.toUpperCase() as Key,
                bindOptions.key.toLowerCase() as Key,
            ]
        }
        return [bindOptions.key]
    }

    private static addBind(keyBind: KeyBind) {
        const keys = this.getKeys(keyBind.bindOptions)
        keys.forEach((key) => {
            if (!this.binds.has(key)) {
                this.binds.set(key, [])
            }
            this.binds.get(key)?.push(keyBind)
        })
    }

    private static onKeyEvent(
        type: KeyBind['type'],
        shortcut: string | BindOptions[],
        callback: (e: KeyboardEvent) => void
    ) {
        const results = Array.isArray(shortcut)
            ? shortcut
            : this.parseShortcuts(shortcut)

        results.forEach((result) => {
            if (result !== false) {
                this.addBind({
                    type,
                    bindOptions: result,
                    callback,
                })
            }
        })
    }

    static onKeyDown(
        shortcut: string | BindOptions[],
        callback: (e: KeyboardEvent) => void
    ) {
        if (!this.listeningDown) {
            window.addEventListener('keydown', (e) => this.handleKeyEvent(e))
            this.listeningDown = true
        }

        this.onKeyEvent('keydown', shortcut, callback)
    }

    static onKeyUp(
        shortcut: string | BindOptions[],
        callback: (e: KeyboardEvent) => void
    ) {
        if (!this.listeningUp) {
            window.addEventListener('keyup', (e) => this.handleKeyEvent(e))
            this.listeningUp = true
        }

        this.onKeyEvent('keyup', shortcut, callback)
    }

    static onKeyPress(
        shortcut: string | BindOptions[],
        callback: (e: KeyboardEvent) => void
    ) {
        if (!this.listeningPress) {
            window.addEventListener('keypress', (e) => this.handleKeyEvent(e))
            this.listeningPress = true
        }
        this.onKeyEvent('keypress', shortcut, callback)
    }
}
