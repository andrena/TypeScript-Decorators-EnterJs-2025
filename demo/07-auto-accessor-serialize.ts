
export class SomeClassWithBigint {
    @serializeAsString
    accessor val: bigint = 0n

    serialize() {
        return JSON.stringify(this)
    }

    static deserialize(jsonString: string): SomeClassWithBigint {
        const instance = new SomeClassWithBigint()
        Object.assign(instance, JSON.parse(jsonString))
        return instance
    }
}

function serializeAsString({get, set}: {get: () => bigint, set: (d: bigint) => void}, context: ClassAccessorDecoratorContext) {
    return {
        init: function (this: any, initVal: bigint) {
            this[`__${String(context.name)}`] = initVal.toString()
            return initVal
        },
        set: function (this: any, value: bigint) {
            this[`__${String(context.name)}`] = value.toString()
            // set.bind(this)(value)
        },
        get: function (this: any) {
            return BigInt(this[`__${String(context.name)}`])
        }
    }
}

const someClass = new SomeClassWithBigint()
console.log(someClass.val)
console.log(someClass)
someClass.val = 10n
console.log(someClass.val)

console.log('Serialize')
const serialized = someClass.serialize()
console.log(serialized)

console.log('Deserialize:')
const deserialized = SomeClassWithBigint.deserialize(serialized)
console.log(deserialized.val)