import { Machine, assign, send } from 'xstate';
import faker from 'faker';

const checkoutMachine = Machine({
    id: 'checkout',
    initial: 'initial',
    context: {
        borrowerUid: '',
        itemBarcode: '',
        itemTitle: '',
        checkoutPolicy: '',
        checkoutDue: new Date(),
        checkoutTime: new Date(),
        blocks: []
    },
    states: {
        initial: {
            invoke: {
                src: (context, event) => {
                    return Promise.resolve({
                        itemTitle: faker.lorem.sentence(),
                        checkoutPolicy: faker.lorem.word(),
                        checkoutDue: faker.date.future()
                    });
                },
                onDone: {
                    target: 'loaded',
                    actions: [
                        assign((context, event) => {
                            return event.data;
                        })
                    ]
                }
            }
        },
        loaded: {
            invoke: {
                src: (context, event) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if (context.itemBarcode == 1234) {
                                reject();
                            } else {
                                resolve();
                            }
                        }, 1000);
                    })
                },
                onDone: {
                    target: 'active'
                },
                onError: {
                    target: 'rejected',
                    actions: assign({
                        blocks: (context, event) => {
                            return [...context.blocks, 'This barcode is forbidden!', 'It is very forbidden.']
                        }
                    })
                }
            }
        },
        active: {},
        rejected: {}
    }
})

export function createCheckoutMachine(borrowerUid, itemBarcode) {
    return checkoutMachine.withContext({
        ...checkoutMachine.initialState.context, borrowerUid, itemBarcode
    });
}
