import './symbol-polyfill'

@singleton
class Fibonacci {
    get(n: number): number {
        if (n === 1 || n === 2) {
            return 1
        }
        return this.get(n - 1) + this.get(n - 2)
    }
}

function singleton<T extends { new(...args: any[]): {} }>(
    original: T,
    context: ClassDecoratorContext
) {
    return class extends original {
        constructor(...args: any[]) {
            if (context.metadata['__instance']) {
                return context.metadata['__instance']
            }
            super(...args)
            context.metadata['__instance'] = this
        }
    }
}

const fibo1 = new Fibonacci()
const fibo2 = new Fibonacci()

// @ts-ignore
console.log(Fibonacci[Symbol.metadata])

console.log(fibo1 === fibo2)