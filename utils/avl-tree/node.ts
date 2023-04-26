import { TreeChangesListener } from "./treeChangesListener"

export class Node<K, V> {
    public _left: Node<K, V> | null = null
    public _right: Node<K, V> | null = null
    public height: number | null = null

    constructor(
        public key: K,
        public value: V,
        public listener: TreeChangesListener<V>
    ) {

    }

    public get left(): Node<K, V> | null {
        return this._left
    }

    public set left(node: Node<K, V> | null) {
        this._left = node
        this.listener.emit('left', 
            this.value, 
            node?.value ?? null
        )
    }

    public get right(): Node<K, V> | null {
        return this._right
    }

    public set right(node: Node<K, V> | null) {
        this._right = node
        this.listener.emit('right', 
            this.value, 
            node?.value ?? null
        )
    }
  
    /**
     * Performs a right rotate on this node.
     * @return The root of the sub-tree; the node where this node used to be.
     * @throws If Node.left is null.
     */
    public rotateRight(): Node<K, V> {
        //     b                           a
        //    / \                         / \
        //   a   e -> b.rotateRight() -> c   b
        //  / \                             / \
        // c   d                           d   e

        const other = this.left!
        this.left = other.right
        other.right = this

        this.height = Math.max(this.leftHeight, this.rightHeight) + 1
        other.height = Math.max(other.leftHeight, this.height) + 1

        return other
    }

    /**
     * Performs a left rotate on this node.
     * @return The root of the sub-tree; the node where this node used to be.
     * @throws If Node.right is null.
     */
    public rotateLeft(): Node<K, V> {
        //   a                              b
        //  / \                            / \
        // c   b   -> a.rotateLeft() ->   a   e
        //    / \                        / \
        //   d   e                      c   d
        const other = this.right!
        this.right = other.left
        other.left = this

        this.height = Math.max(this.leftHeight, this.rightHeight) + 1
        other.height = Math.max(other.rightHeight, this.height) + 1

        return other
    }
  
    /**
     * Convenience function to get the height of the left child of the node,
     * returning -1 if the node is null.
     * @return The height of the left child, or -1 if it doesn't exist.
     */
    public get leftHeight(): number {
        if (this.left === null) {
            return -1;
        }
        return this.left.height ?? 0
    }
  
    /**
     * Convenience function to get the height of the right child of the node,
     * returning -1 if the node is null.
     * @return The height of the right child, or -1 if it doesn't exist.
     */
    public get rightHeight(): number {
        if (this.right === null) {
            return -1;
        }
        return this.right.height ?? 0
    }
}