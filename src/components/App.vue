<template>
    <div class="container">
        <h1>TIND Checkouts</h1>
        <div class="row mb-2">
            <div class="col text-right">
                <button @click="resetBorrower"
                        :disabled="state.matches('pending')"
                        class="btn btn-outline-danger">Reset</button>
                <button :disabled="checkouts.length == 0 || anyLoading"
                        class="btn btn-outline-secondary ml-1">Send receipt</button>
                <button :disabled="anyLoading" class="btn btn-success ml-1">Finish</button>
            </div>
        </div>
        <tind-section :title="'Patron Search'" v-if="state.matches('pending')">
            <tind-borrower-control></tind-borrower-control>
        </tind-section>
        <template v-if="state.matches('selected')">
            <tind-section :title="'Patron Details'">
                <tind-borrower-details></tind-borrower-details>
            </tind-section>
            <tind-section :title="this.checkoutTitle">
                <tind-checkout-session></tind-checkout-session>
            </tind-section>
        </template>
    </div>
</template>

<script>
import { useService } from '@xstate/vue';
import { circulationService } from '../circulationMachine';

export default {
    setup() {
        const { state, send } = useService(circulationService);
        return {
            state, send
        }
    },
    data() {
        return {
            message: "Hello"
        }
    },
    computed: {
        borrower() {
            return this.state.context.borrower;
        },
        checkouts() {
            return this.state.context.checkouts;
        },
        checkoutTitle() {
            if (this.state.matches({selected: 'loading'})) {
                return `Check out items to ${this.borrower.uid}`;
            } else if (this.state.matches({selected: 'loaded'})) {
                return `Check out items to ${this.borrower.name} (${this.borrower.uid})`;
            } else {
                return 'Check out items';
            }
        },
        anyLoading() {
            return this.state.context.checkouts.some(checkout => {
                return ['initial', 'loaded'].some(s => checkout.ref.state.matches(s));
            });
        }
    },
    methods: {
        resetBorrower() {
            this.send('RESET_BORROWER');
        }
    }
}
</script>
