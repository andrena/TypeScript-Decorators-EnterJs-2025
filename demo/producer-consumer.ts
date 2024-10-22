const eventListeners: { [eventType: string]: Consumer<any>[] } = {}

type Consumer<T extends Event> = (e: T) => void

function publish(e: Event) {
    eventListeners[e.type]?.forEach(consumer => consumer(e))
}

type Event = {
    type: string
}

function producer<TArgs extends any[], TEvent extends Event>(
    target: (...args: TArgs) => TEvent,
    _context: ClassMethodDecoratorContext
) {
    return function (this: any, ...args: TArgs) {
        const resultEvent = target.call(this, ...args)
        publish(resultEvent)
        return resultEvent
    }
}

function consumer<TEvent extends Event>(eventType: string) {
    return (
        target: (event: TEvent) => void,
        context: ClassMethodDecoratorContext
    ) => {
        context.addInitializer(function (this: any) {
            eventListeners[eventType] ??= []
            eventListeners[eventType].push(target.bind(this))
        })
    }
}

class MyProducer {
    @producer
    greet(greeting: string) {
        return {
            type: 'greeting',
            message: greeting
        }
    }

    @producer
    notifyUpdate() {
        return {
            type: 'notification',
        }
    }
}

class MyConsumer {
    @consumer('greeting')
    consumeGreetings(event: Event) {
        console.log(`Was greeted with ${(event as any).message}`)
    }

    @consumer('notification')
    consumeNotification(event: Event) {
        this.notify()
    }

    notify() {
        console.log('Was notified')
    }
}

const myProducer = new MyProducer()
const myConsumer = new MyConsumer()

myProducer.greet('Hallo')
myProducer.notifyUpdate()
myProducer.greet('Tach')
