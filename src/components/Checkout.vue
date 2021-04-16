<template>
    <!-- <tr>
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
    </tr> -->
    <div class="list-group-item">
        <div class="row">
            <div class="col-md-1 text-center">
                <i style="font-size: 2rem"
                   :class="{'bi': true,
                            'bi-check-square': active,
                            'text-success': active,
                            'bi-square': loading,
                            'text-secondary': loading,
                            'bi-exclamation-square': rejected,
                            'text-danger': rejected}"></i>
            </div>
            <div class="col-md-4">
                <p class="font-weight-bold mb-0"><a href="#">{{ title }}</a></p>
                <small>
                    <span class="text-monospace"><a href="#">{{ barcode }}</a></span>
                    <span v-if="loading"> | Checking out...</span>
                    <span v-else-if="active"> | Checked out | Due date: {{ dueDate }}</span>
                    <span v-else-if="rejected"> | Not checked out!</span>
                </small>
            </div>
            <div class="col-md-5">
                <table class="table table-sm mb-0 ">
                    <colgroup>
                        <col span="1" class="w-25">
                        <col span="1" class="w-75">
                    </colgroup>
                    <tr v-if="rejected && blocks.length > 0" class="table-danger">
                        <th scope="row" :rowspan="blocks.length || 1">Problems</th>
                        <td>{{ blocks[0] }}</td>
                    </tr>
                    <tr v-if="rejected" v-for="(block, index) in blocks.slice(1)" :key="index" class="table-danger">
                        <td>{{ block }}</td>
                    </tr>
                    <tr>
                        <th scope="row">Due Date</th>
                        <td><span v-if="active">{{ dueDate }}</span></td>
                    </tr>
                    <tr v-if="expanded">
                        <th scope="row">Checkout Time</th>
                        <td><span v-if="active">{{ checkoutDate }}</span></td>
                    </tr>
                    <tr v-if="expanded">
                        <th scope="row">Loan Rule</th>
                        <td>{{ loanRule }}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-2 text-right">
                <p class="mb-0">
                    <div class="btn-group-vertical">
                        <button @click="expanded = !expanded"
                                class="btn btn-sm btn-outline-secondary">
                            Details <i :class="{'bi': true, 'bi-caret-right': !expanded, 'bi-caret-down': expanded}"></i>
                        </button>
                        <button :disabled="blocks.length == 0 || !rejected"
                                @click="override"
                                :class="{'btn': true, 'btn-sm': true, 'btn-outline-secondary': !rejected, 'btn-outline-danger': blocks.length > 0 && rejected}">
                            Override
                        </button>
                    </div>
                </p>
            </div>
        </div>
    </div>
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
