@singleton
class Fibonacci {
    get(n: number): number {
        if (n === 1 || n === 2) {
            return 1
        }
        return this.get(n - 1) + this.get(n - 2)
    }
}

function singleton<T extends { new(...args: any[]): {} }>(original: T) {
    return class extends original {
        constructor(...args: any[]) {
            if ((original as any)._instance) {
                return (original as any)._instance
            }
            super(...args);
            (original as any)._instance = this
        }
    }
}

const fibo1 = new Fibonacci()
const fibo2 = new Fibonacci()

console.log(fibo1 === fibo2)