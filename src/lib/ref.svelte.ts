export interface Ref<T> {
    get current(): T
    set current(value: T)
}

export function ref<T>(value: T): Ref<T> {
    let state = $state<T>(value)

    return {
        get current() {
            return state
        },
        set current(value: T) {
            state = value
        },
    }
}
