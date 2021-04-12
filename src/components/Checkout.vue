<template>
    <tr>
        <td :rowspan="barcodeRowspan">{{ barcode }}</td>
        <td>{{ title }}</td>
        <td class="text-right">
            <span v-if="loading">Checking out...</span>
            <span v-else-if="active"><i class="bi bi-clock-fill"></i>&nbsp;{{ dueDate }}</span>
            <span v-else-if="rejected" class="text-danger"><i class="bi bi-exclamation-octagon-fill"></i>&nbsp;Problems</span>
            &nbsp;
            <button :disabled="loading"
                    :class="{btn: true,
                            'btn-sm': true,
                            'btn-outline-secondary': loading,
                            'btn-outline-success': active,
                            'btn-outline-danger': rejected}"
                    @click="expanded = !expanded">
                Details
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
                    <td><span v-if="active">{{ checkoutDate }}</span></td>
                </tr>
                <tr>
                    <th scope="row">Due Date</th>
                    <td><span v-if="active">{{ dueDate }}</span></td>
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
        <td class="text-right">
            <div v-if="blocks.length > 0" class="btn-group-vertical">
                <button @click="override" class="btn btn-sm btn-outline-secondary">Override blockers</button>
            </div>
        </td>
    </tr>
</template>

<script>
import moment from 'moment';

export default {
    props: ['state', 'send', 'index'],
    data() {
        return {
            expanded: false
        }
    },
    computed: {
        blocks() {
            return this.state.context.blocks;
        },
        barcode() {
            return this.state.context.itemBarcode;
        },
        title() {
            return this.state.context.itemTitle;
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
            return this.state.matches('initial') || this.state.matches('loading');
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
    },
    methods: {
        override() {
            this.send("OVERRIDE");
        }
    }
}
</script>
