import { TreeChangesListener } from './treeChangesListener'
import { Node } from './node'
import { AvlTree as AvlTreeApi, CompareFunction } from './types'

const enum BalanceState {
    /** Right child's height is 2+ greater than left child's height */
    UNBALANCED_RIGHT,
    /** Right child's height is 1 greater than left child's height */
    SLIGHTLY_UNBALANCED_RIGHT,
    /** Left and right children have the same height */
    BALANCED,
    /** Left child's height is 1 greater than right child's height */
    SLIGHTLY_UNBALANCED_LEFT,
    /** Left child's height is 2+ greater than right child's height */
    UNBALANCED_LEFT
}

export class AvlTree<K, V> implements AvlTreeApi<K, V> {
    protected _root: Node<K, V> | null = null
    private _size: number = 0
    private _compare: CompareFunction<K>

    constructor(
        private _listener: TreeChangesListener<V>,
        compare?: CompareFunction<K>
    ) {
        this._compare = compare ?? this._defaultCompare
    }

    private _defaultCompare(a: K, b: K): number {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    }

    private set root(node: Node<K, V> | null) {
        this._root = node
        this._listener.emit('root',
            this._root?.value ?? null, 
            node?.value ?? null
        )
    }

    public get root(): Node<K, V> | null {
        return this._root
    }

    public insert(key: K, value: V): void {
        this.root = this._insert(key, value, this.root)
        this._size++
        this._listener.emit('updated')
    }

    private _insert(
        key: K, 
        value: V, 
        root: Node<K, V> | null
    ): Node<K, V> {

        if (root === null) {
            return new Node(key, value, this._listener)
        }

        if (this._compare(key, root.key) < 0) {
            root.left = this._insert(key, value, root.left);
        } else if (this._compare(key, root.key) > 0) {
            root.right = this._insert(key, value, root.right);
        } else {
            // It's a duplicate so insertion failed, decrement size to make up for it
            this._size--;
            return root;
        }

        // Update height and rebalance tree
        root.height = Math.max(root.leftHeight, root.rightHeight) + 1;
        const balanceState = this._getBalanceState(root);

        console.log(`Balance state after insertion = ${balanceState}`)

        if (balanceState === BalanceState.UNBALANCED_LEFT) {
            if (this._compare(key, root.left!.key) < 0) {
                // Left left case
                root = root.rotateRight();
            } else {
                // Left right case
                root.left = root.left!.rotateLeft();
                return root.rotateRight();
            }
        }

        if (balanceState === BalanceState.UNBALANCED_RIGHT) {
            if (this._compare(key, root.right!.key) > 0) {
                // Right right case
                root = root.rotateLeft();
            } else {
                // Right left case
                root.right = root.right!.rotateRight();
                return root.rotateLeft();
            }
        }

        return root;
    }

    public delete(key: K): void {
        this.root = this._delete(key, this.root)
        this._size--
        this._listener.emit('updated')
    }

    private _delete(
        key: K, 
        root: Node<K, V> | null
    ): Node<K, V> | null {

        if (root === null) {
            this._size++;
            return root;
        }

        if (this._compare(key, root.key) < 0) {
            // The key to be deleted is in the left sub-tree
            root.left = this._delete(key, root.left);
        } else if (this._compare(key, root.key) > 0) {
            // The key to be deleted is in the right sub-tree
            root.right = this._delete(key, root.right);
        } else {
            // root is the node to be deleted
            if (root.left == null && root.right == null) {
                root = null;
            } else if (root.left == null && root.right) {
                root = root.right;
            } else if (root.left && root.right == null) {
                root = root.left;
            } else {
                // Node has 2 children, get the in-order successor
                const inOrderSuccessor = this._minValueNode(root.right!);
                root.key = inOrderSuccessor.key;
                root.value = inOrderSuccessor.value;
                root.right = this._delete(inOrderSuccessor.key, root.right);
            }
        }

        if (root == null) {
            return root
        }

        // Update height and rebalance tree
        root.height = Math.max(root.leftHeight, root.rightHeight) + 1;
        const balanceState = this._getBalanceState(root);

        if (balanceState == BalanceState.UNBALANCED_LEFT) {
            // Left left case
            if (
                this._getBalanceState(root.left!) === BalanceState.BALANCED ||
                this._getBalanceState(root.left!) === BalanceState.SLIGHTLY_UNBALANCED_LEFT
            ) {
                return root.rotateRight();
            }
            // Left right case
            // this._getBalanceState(root.left) === BalanceState.SLIGHTLY_UNBALANCED_RIGHT
            root.left = (root.left!).rotateLeft();
            return root.rotateRight();
        }

        if (balanceState == BalanceState.UNBALANCED_RIGHT) {
            // Right right case
            if (
                this._getBalanceState(root.right!) == BalanceState.BALANCED ||
                this._getBalanceState(root.right!) == BalanceState.SLIGHTLY_UNBALANCED_RIGHT
            ) {
                return root.rotateLeft();
            }
            // Right left case
            // this._getBalanceState(root.right) === BalanceState.SLIGHTLY_UNBALANCED_LEFT
            root.right = (root.right!).rotateRight();
            return root.rotateLeft();
        }

        return root;
    }

    // reworked snizu

    public get(key: K): V | undefined | null {
        return this.root 
            ? this._get(key, this.root)?.value ?? null
            : null
    }

    private _get(key: K, root: Node<K, V>): Node<K, V> | null {
        const result = this._compare(key, root.key)

        if (result == 0) {
            return root
        } else if (result == -1) {
            return root.left ? this._get(key, root.left) : null
        } else {
            return root.right ? this._get(key, root.right) : null
        }
    }

    public contains(key: K): boolean {
        return this.root 
            ? this._get(key, this.root) != null 
            : false
    }

    public findMinimum(): K | null {
        return this.root 
            ? this._minValueNode(this.root).key
            : null
    }

    public findMaximum(): K | null {
        return this.root 
            ? this._maxValueNode(this.root).key
            : null
    }

    public get size(): number {
        return this._size
    }

    public get isEmpty(): boolean {
        return this._size == 0
    }

    private _minValueNode(root: Node<K, V>): Node<K, V> {
        let current = root
        while (current.left != null) {
            current = current.left
        }
        return current
    }

    private _maxValueNode(root: Node<K, V>): Node<K, V> {
        let current = root
        while (current.right != null) {
            current = current.right
        }
        return current
    }

    private _getBalanceState(node: Node<K, V>): BalanceState {
        const heightDifference = node.leftHeight - node.rightHeight
        switch (heightDifference) {
            case -2: return BalanceState.UNBALANCED_RIGHT
            case -1: return BalanceState.SLIGHTLY_UNBALANCED_RIGHT
            case 1: return BalanceState.SLIGHTLY_UNBALANCED_LEFT
            case 2: return BalanceState.UNBALANCED_LEFT
            default: return BalanceState.BALANCED
        }
    }
}
