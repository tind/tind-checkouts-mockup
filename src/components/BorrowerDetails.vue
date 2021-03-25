<template>
    <div>
        <table class="table table-sm">
            <tbody>
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
            </tbody>
        </table>
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
        }
    }
}
</script>
