export type CompareFunction<K> = (a: K, b: K) => number

export class AvlTree<K, V> {

    public size: number
    public isEmpty: boolean

    constructor(customCompare?: CompareFunction<K>)

    public insert(key: K, value?: V): void
    public delete(key: K): void
    public get(key: K): V | undefined | null
    public contains(key: K): boolean

    public findMinimum(): K | null
    public findMaximum(): K | null
}
