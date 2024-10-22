@autoBindMethods
class Fibonacci {
    get(n: number): number {
        if (n === 1 || n === 2) {
            return 1
        }
        return this.get(n - 1) + this.get(n - 2)
    }
}

function autoBindMethods<T extends { new(...args: any[]): {} }>(
    original: T,
    _context: ClassDecoratorContext
) {
    return class extends original {
        constructor(...args: any[]) {
            super(...args)
            for (const key of Object.getOwnPropertyNames(original.prototype)) {
                // @ts-ignore
                const val = this[key]
                if (typeof val === 'function') {
                    // @ts-ignore
                    this[key] = val.bind(this)
                }
            }
        }
    }
}

const fibonacci = new Fibonacci()

console.log([1, 4, 6].map(fibonacci.get))

const getFibonacci = fibonacci.get

console.log(getFibonacci(10))