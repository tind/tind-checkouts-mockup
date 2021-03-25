import { Machine, interpret, assign, spawn } from 'xstate';
import faker from 'faker';

import { createCheckoutMachine } from './checkoutMachine';

export const circulationMachine = Machine({
    id: 'circulation',
    initial: 'pending',
    context: {
        borrower: {
            uid: ""
        },
        checkouts: []
    },
    states: {
        pending: {
            on: {
                UPDATE_BORROWER_UID: {
                    actions: ['updateBorrowerUid']
                },
                SELECT_BORROWER: {
                    target: 'selected'
                }
            }
        },
        selected: {
            initial: 'loading',
            states: {
                loading: {
                    invoke: {
                        src: function(context) {
                            return new Promise(resolve => setTimeout(resolve, 1000));
                        },
                        onDone: {
                            target: 'loaded',
                            actions: assign({
                                borrower: (context, event) => {
                                    return {
                                        ...context.borrower,
                                        name: faker.name.firstName() + ' ' + faker.name.lastName(),
                                        address: faker.address.streetAddress(true)
                                    }
                                }
                            })
                        }
                    }
                },
                loaded: {
                    on: {
                        CHECKOUT_BARCODE: {
                            actions: ['checkoutBarcode']
                        }
                    }
                }
            }
        }
    },
    on: {
        RESET_BORROWER: {
            target: 'pending',
            actions: ['resetBorrower']
        }
    }
},
{
    actions: {
        updateBorrowerUid: assign({
            borrower: (context, event) => {
                return {...context.borrower, uid: event.payload};
            }
        }),
        resetBorrower: assign({
            borrower: {uid: ""},
            checkouts: []
        }),
        checkoutBarcode: assign({
            checkouts: (context, event) => {
                const checkout = {
                    barcode: event.payload,
                    ref: spawn(createCheckoutMachine(
                        context.borrower.uid,
                        event.payload
                    ), { sync: true })
                };
                return [checkout, ...context.checkouts]
            }
        })
    }
});

export const circulationService = interpret(circulationMachine).start();
