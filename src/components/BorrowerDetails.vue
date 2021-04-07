<template>
    <div class="row">
        <div class="col-12 col-md-6">
            <table class="table table-sm table-bordered">
                <tr>
                    <th scope="row" style="width: 100px">UID</th>
                    <td>
                        {{ borrower.uid }}
                    </td>
                </tr>
                <tr>
                    <th scope="row">Name</th>
                    <td>
                        <template v-if="state.matches({selected: 'loaded'})">{{ borrower.name }}</template>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Address</th>
                    <td>
                        <template v-if="state.matches({selected: 'loaded'})">{{ borrower.address }}</template>
                    </td>
                </tr>
            </table>
        </div>
        <div class="col-12 col-md-6">
            <table class="table table-sm table-bordered">
                <tr>
                    <th scope="row" style="width: 150px">Patron Notes</th>
                    <td><template v-if="state.matches({selected: 'loaded'})">Note</template></td>
                </tr>
                <tr>
                    <th scope="row">Current Loans</th>
                    <td><a href="#" v-if="state.matches({selected: 'loaded'})">{{ 4 + activeCheckouts}} (1 overdue)</a></td>
                </tr>
                <tr>
                    <th scope="row">Current Requests</th>
                    <td><a href="#" v-if="state.matches({selected: 'loaded'})">2</a></td>
                </tr>
                <tr>
                    <th scope="row">Active Fees</th>
                    <td><a href="#" v-if="state.matches({selected: 'loaded'})">$ 0.00</a></td>
                </tr>
                <tr>
                    <th scope="row">Estimated Fines</th>
                    <td><template v-if="state.matches({selected: 'loaded'})">$ 8.00</template></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { useService } from '@xstate/vue';
import { circulationService } from '../circulationMachine';

export default {
    setup() {
        const { state, send } = useService(circulationService);
        return {
            state,
            send
        }
    },
    computed: {
        borrower() {
            return this.state.context.borrower;
        },
        activeCheckouts() {
            return this.state.context.checkouts.filter(checkout => {
                return checkout.ref.state.matches('active');
            }).length;
        }
    }
}
</script>
