import './symbol-polyfill'

type SerializeInfo<T, S> = {
    name: string | symbol,
    serialize?: (val: T) => S,
    deserialize?: (serialized: S) => T
}

export function serialize<T, S>(options?: Pick<SerializeInfo<T, S>, 'serialize' | 'deserialize'>) {
    return function (
        _target: undefined,
        context: ClassFieldDecoratorContext
    ) {
        context.metadata['serializableFields'] ??= []
        ;(context.metadata['serializableFields'] as SerializeInfo<any, any>[]).push({
            name: context.name,
            serialize: options?.serialize,
            deserialize: options?.deserialize
        })
    }
}

export function serializable<T extends { new(...args: any[]): {} }>(
    target: T,
    context: ClassDecoratorContext
) {
    return class extends target {
        serialize(this: any) {
            const serializeOptions = context.metadata['serializableFields'] as SerializeInfo<any, any>[] ?? []
            const tmp = serializeOptions.reduce(
                (serializedObject, currentField) =>
                    ({
                        ...serializedObject,
                        [currentField.name]: currentField.serialize ? currentField.serialize(this[currentField.name]) : this[currentField.name]
                    }),
                {} as { [name: string]: any })
            return JSON.stringify(tmp)
        }

        static deserialize<T extends { new(...args: any[]): {} }>(this: any, cls: T, serializedString: string) {
            const tmp = JSON.parse(serializedString)
            const instance = new cls() as any
            const serializeOptions = context.metadata['serializableFields'] as SerializeInfo<any, any>[] ?? []
            serializeOptions.forEach(
                currentField => instance[currentField.name] = currentField.deserialize ? currentField.deserialize(tmp[currentField.name]) : tmp[currentField.name]
            )
            return instance
        }
    }
}

export const Serializer = {
    serialize: (p: any) => {
        if (!p.serialize || typeof p.serialize !== 'function') {
            throw new Error('Can only serialize objects that are decorated with the serializable decorator')
        }
        return p.serialize()
    },
    deserialize: <T extends { new(...args: any[]): {} }>(cls: T, serializedString: string) => {
        if (!(cls as any).deserialize || typeof (cls as any).deserialize !== 'function') {
            throw new Error('Can only deserialize objects that are decorated with the serializable decorator')
        }
        return (cls as any).deserialize(cls, serializedString) as InstanceType<T>
    }
}

