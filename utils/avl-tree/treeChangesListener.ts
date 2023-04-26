import EventEmitter from 'eventemitter3'

export type TreeEventMap<V> = {
    left: (source: V | null, data: V | null) => void
    right: (source: V | null, data: V | null) => void
    root: (source: V | null, data: V | null) => void
    updated: () => void
}

export class TreeChangesListener<V> extends EventEmitter<TreeEventMap<V>> {

}
