type Key = '+' | '-' | '_' | '=' | 'y' | 'z' | 'Y' | 'Z' | '0'

interface BindData {
    key: Key
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    meta?: boolean
    preventDefault?: boolean
}

interface options {
    preventDefault?: boolean
    caseSensitive?: boolean
}

interface stringBindOptions extends options {
    keysSeparator?: string
    shortcutsSeparator?: string
}

interface BindInfo extends BindData, options {}

type KeyBindType = 'keydown' | 'keyup' | 'keypress'
type KeyboardEventHandler = (e: KeyboardEvent) => void

type KeyBind = {
    type: KeyBindType
    bindData: BindData
    callback: KeyboardEventHandler
}

export class Shortcut {
    private static keys: Key[] = ['+', '-', '_', '=', 'y', 'z', 'Y', 'Z', '0']
    private static binds = new Map<Key, KeyBind[]>()
    private static listeningEvents: Record<KeyBindType, boolean> = {
        keydown: false,
        keyup: false,
        keypress: false,
    }

    private static handleKeyEvent(e: KeyboardEvent) {
        const key = e.key as Key
        if (!this.binds.has(key)) return
        const keyBinds = this.binds.get(key) as KeyBind[]
        keyBinds.forEach(({ bindData, type, callback }) => {
            if (this.matchBind(type, bindData, e)) {
                if (bindData.preventDefault) {
                    e.preventDefault()
                }
                callback(e)
            }
        })
    }

    private static matchBind(
        type: KeyBindType,
        bindData: BindData,
        e: KeyboardEvent
    ) {
        if (type !== e.type) return false
        if (bindData.ctrl && !e.ctrlKey) return false
        if (bindData.shift && !e.shiftKey) return false
        if (bindData.alt && !e.altKey) return false
        if (bindData.meta && !e.metaKey) return false
        return true
    }

    private static parseShortcuts(
        shortcut: string,
        options?: stringBindOptions
    ): Array<BindInfo | false> {
        const shortcutsSeparator = options?.shortcutsSeparator || ','
        const shortcuts = shortcut
            .split(shortcutsSeparator)
            .map((s) => s.trim())
        return shortcuts.map((shortcut) =>
            this.parseShortcut(shortcut, options)
        )
    }

    private static parseShortcut(
        shortcut: string,
        options?: stringBindOptions
    ): BindInfo | false {
        const keysSeparator = options?.keysSeparator || '+'
        const keys = shortcut.split(keysSeparator).map((s) => s.trim())

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
            console.error(`Shortcut: "${shortcut}" has more than one key.`)
            return false
        }

        if (!this.keys.includes(keys[0] as Key)) {
            console.error(`Shortcut: "${shortcut}" has an invalid key.`)
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

    private static getKeys(bindData: BindData, caseSensitive = false): Key[] {
        if (!caseSensitive && /[a-z]/i.test(bindData.key)) {
            return [
                bindData.key.toUpperCase() as Key,
                bindData.key.toLowerCase() as Key,
            ]
        }
        return [bindData.key]
    }

    private static addBind(
        type: KeyBindType,
        bindInfo: BindInfo,
        callback: KeyboardEventHandler,
        options?: options
    ) {
        const keys = this.getKeys(
            bindInfo,
            bindInfo.caseSensitive ?? options?.caseSensitive ?? false
        )
        keys.forEach((key) => {
            if (!this.binds.has(key)) {
                this.binds.set(key, [])
            }
            const keyBind = {
                type,
                callback,
                bindData: {
                    key,
                    ctrl: bindInfo.ctrl,
                    shift: bindInfo.shift,
                    alt: bindInfo.alt,
                    meta: bindInfo.meta,
                    preventDefault:
                        bindInfo.preventDefault ??
                        options?.preventDefault ??
                        true,
                },
            }
            this.binds.get(key)?.push(keyBind)
        })
    }

    private static addBinds(
        type: KeyBindType,
        shortcut: string | BindInfo[],
        callback: KeyboardEventHandler,
        options?: options | stringBindOptions
    ) {
        const results = Array.isArray(shortcut)
            ? shortcut
            : this.parseShortcuts(shortcut, options)

        results.forEach((bindInfo) => {
            if (bindInfo !== false) {
                this.addBind(type, bindInfo, callback, options)
            }
        })
    }

    private static onKeyEvent(
        type: KeyBindType,
        shortcut: string | BindInfo[],
        callback: KeyboardEventHandler,
        options?: options | stringBindOptions
    ) {
        if (!this.listeningEvents[type]) {
            window.addEventListener(type, (e) => this.handleKeyEvent(e))
            this.listeningEvents[type] = true
        }

        this.addBinds(type, shortcut, callback, options)
    }

    static onKeyDown(
        shortcut: string,
        callback: KeyboardEventHandler,
        options?: stringBindOptions
    ): void
    static onKeyDown(
        shortcut: BindInfo[],
        callback: KeyboardEventHandler,
        options?: options
    ): void
    static onKeyDown(
        shortcut: string | BindInfo[],
        callback: KeyboardEventHandler,
        options?: options | stringBindOptions
    ) {
        this.onKeyEvent('keydown', shortcut, callback, options)
    }

    static onKeyUp(
        shortcut: string,
        callback: KeyboardEventHandler,
        options?: stringBindOptions
    ): void
    static onKeyUp(
        shortcut: BindInfo[],
        callback: KeyboardEventHandler,
        options?: options
    ): void
    static onKeyUp(
        shortcut: string | BindInfo[],
        callback: KeyboardEventHandler,
        options?: options | stringBindOptions
    ) {
        this.onKeyEvent('keyup', shortcut, callback, options)
    }

    static onKeyPress(
        shortcut: string,
        callback: KeyboardEventHandler,
        options?: stringBindOptions
    ): void
    static onKeyPress(
        shortcut: BindInfo[],
        callback: KeyboardEventHandler,
        options?: options
    ): void
    static onKeyPress(
        shortcut: string | BindInfo[],
        callback: KeyboardEventHandler,
        options?: options | stringBindOptions
    ) {
        this.onKeyEvent('keypress', shortcut, callback, options)
    }
}
