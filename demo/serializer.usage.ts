import './symbol-polyfill'
import { serializable, serialize, Serializer } from './serializer'

@serializable
class Person {
    @serialize()
    name?: string
    @serialize()
    age?: number
    @serialize({ serialize: (v: bigint) => v.toString(), deserialize: (v: string) => BigInt(v) })
    favoriteInt?: bigint

    secret?: string
}

const p = new Person()
p.name = 'Peter'
p.age = 35
p.favoriteInt = 987654321n
p.secret = 'password123!'
let message = Serializer.serialize(p)
console.log(message)
const p2 = Serializer.deserialize(Person, message)
console.log(p2)