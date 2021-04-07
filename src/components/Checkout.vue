<template>
    <!-- <div class="list-group-item">
        <div class="d-flex justify-content-between">
            <div class="mb-1 h6">{{ state.context.itemTitle }}</div>
            <div>
                <button v-if="state.matches('initial') || state.matches('loaded')"
                        class="btn btn-outline-secondary btn-sm" disabled>Checking out...</button>
                <button v-else-if="state.matches('active')"
                        class="btn btn-outline-success btn-sm">Checked out: {{ date }}</button>
                <button v-else-if="state.matches('rejected')"
                        class="btn btn-outline-danger btn-sm">Problems</button>
            </div>
        </div>
        <small>{{ state.context.itemBarcode }}</small>
    </div> -->
    <tr>
        <td :rowspan="barcodeRowspan">{{ state.context.itemBarcode }}</td>
        <td>{{ state.context.itemTitle }}</td>
        <td class="text-right">
            <button :disabled="state.matches('initial') || state.matches('loaded')"
                    :class="{btn: true,
                             'btn-sm': true,
                             'btn-outline-secondary': loading,
                             'btn-outline-success': active,
                             'btn-outline-danger': rejected}"
                    @click="expanded = !expanded">
                <template v-if="loading">Checking out...</template>
                <template v-else-if="active">Checked out: {{ dueDate }}</template>
                <template v-else-if="rejected">Problems</template>
                <template v-if="active || rejected">
                    <template v-if="expanded">&nbsp;▲</template>
                    <template v-else>&nbsp;▼</template>
                </template>
            </button>
        </td>
    </tr>
    <tr v-if="expanded">
        <td colspan="1">
            <table class="table table-sm table-bordered table-secondary mb-0 ">
                <colgroup>
                    <col span="1" class="w-25">
                    <col span="1" class="w-75">
                </colgroup>
                <tr>
                    <th scope="row">Checkout Time</th>
                    <td>{{ checkoutDate }}</td>
                </tr>
                <tr>
                    <th scope="row">Loan Rule</th>
                    <td>{{ loanRule }}</td>
                </tr>
                <tr v-if="blocks.length > 0" class="table-danger">
                    <th scope="row" :rowspan="blocks.length || 1">Blockers</th>
                    <td>{{ blocks[0] }}</td>
                </tr>
                <tr v-for="(block, index) in blocks.slice(1)" :key="index" class="table-danger">
                    <td>{{ block }}</td>
                </tr>
            </table>
        </td>
        <td></td>
    </tr>
</template>

<script>
import moment from 'moment';

export default {
    props: ['state', 'index'],
    data() {
        return {
            expanded: false
        }
    },
    computed: {
        blocks() {
            return this.state.context.blocks;
        },
        checkoutDate() {
            return moment(this.state.context.checkoutDate).format("yyyy-MM-DD hh:mm:ss");
        },
        dueDate() {
            return moment(this.state.context.checkoutDue).format("yyyy-MM-DD");
        },
        loanRule() {
            return this.state.context.checkoutPolicy;
        },
        loading() {
            return this.state.matches('initial') || this.state.matches('loaded')
        },
        active() {
            return this.state.matches('active');
        },
        rejected() {
            return this.state.matches('rejected');
        },
        barcodeRowspan() {
            return this.expanded ? "2" : "1";
        }
    }
}
</script>
