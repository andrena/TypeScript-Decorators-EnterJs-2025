type Constructor<T = {}> = new (...args: any[]) => T;

const instances: Map<any, Constructor<any>> = new Map<any, any>()

// Decorator factory
export function injectable(token?: string) {
    return <T, TBase extends Constructor<T>>(
        constructor: TBase,
        _context: ClassDecoratorContext
    ) => {
        instances.set(token ?? constructor, constructor)
    }
}

export function inject<T>(token: Constructor<T> | string): T {
    const instance = instances.get(token)
    if (!instance) {
        throw new Error('No instance for this token found')
    }
    return new instance() as T
}

// Decorator
export function injectionDecorator<T, S>(token: Constructor<T> | string) {
    return (
        _target: undefined,
        _context: ClassFieldDecoratorContext
    ) => () => inject(token)
}