export function combine<T>(...updater: ((board: T) => T)[]) {
    return (board: T): T => updater.reduce((acc, x) => x(acc), board);
}
