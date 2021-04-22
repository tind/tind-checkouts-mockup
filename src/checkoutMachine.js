import { Machine, assign, send, sendParent } from 'xstate';
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
            entry: 'loadData',
            always: 'loading'
        },
        loading: {
            after: [
                { delay: 1000, target: 'rejected', cond: 'isBlocked' },
                { delay: 1000, target: 'active' }
            ]
        },
        active: {},
        rejected: {
            on: {
                OVERRIDE: {
                    target: 'loading',
                    actions: 'resetBlocks'
                },
                CANCEL: {
                    actions: 'cancel'
                }
            }
        }
    }
},
{
    actions: {
        loadData: assign({
            itemTitle: () => faker.lorem.sentence(),
            checkoutPolicy: () => faker.lorem.word(),
            checkoutDue: () => faker.date.future(),
            blocks: context => {
                console.log(context);
                return context.itemBarcode == 1234
                    ? [...context.blocks, 'This barcode is forbidden!', 'It is very forbidden.']
                    : []
            }
        }),
        resetBlocks: assign({
            blocks: []
        }),
        cancel: sendParent((context, event) => ({
            type: 'CANCEL',
            barcode: context.itemBarcode
        }))
    },
    guards: {
        isBlocked: (context, event) => {
            return context.blocks.length > 0;
        }
    }
})

export function createCheckoutMachine(borrowerUid, itemBarcode) {
    return checkoutMachine.withContext({
        ...checkoutMachine.initialState.context, borrowerUid, itemBarcode
    });
}
