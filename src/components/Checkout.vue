<template>
    <div class="list-group-item">
        <div class="row">
            <div class="col-md-1 d-flex justify-content-center">
                <div style="height: 30px; width: 30px" class="mt-2">
                    <img v-if="active" :src="successIcon">
                    <img v-if="loading" :src="waitIcon">
                    <img v-if="rejected" :src="dangerIcon">
                </div>
            </div>
            <div class="col-md-4">
                <p class="font-weight-bold mb-0"><a href="#">{{ title }}</a></p>
                <small>
                    <span class="text-monospace"><a href="#">{{ barcode }}</a></span>
                    <span v-if="loading"> | Checking out...</span>
                    <span v-else-if="active"> | Checked out</span>
                    <span v-else-if="rejected"> | Not checked out!</span>
                </small>
            </div>
            <div class="col-md-5">
                <table class="table table-sm table-borderless mb-0 ">
                    <colgroup>
                        <col span="1" class="w-25">
                        <col span="1" class="w-75">
                    </colgroup>
                    <template v-if="rejected">
                        <tr v-if="blocks.length > 0" class="table-danger">
                            <th scope="row" :rowspan="blocks.length || 1">Problems</th>
                            <td>{{ blocks[0] }}</td>
                        </tr>
                        <tr v-for="(block, index) in blocks.slice(1)" :key="index" class="table-danger">
                            <td style="border-top-style: solid; border-top-width: 1pt;">{{ block }}</td>
                        </tr>
                    </template>
                    <tr>
                        <th scope="row">Due Date</th>
                        <td><span v-if="active">{{ dueDate }}</span></td>
                    </tr>
                    <tr>
                        <th scope="row">Checkout Time</th>
                        <td><span v-if="active">{{ checkoutDate }}</span></td>
                    </tr>
                    <tr>
                        <th scope="row">Loan Rule</th>
                        <td>{{ loanRule }}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-2 text-right">
                <p class="mb-0">
                    <div class="btn-group-vertical">
                        <button :disabled="!rejected"
                                @click="cancel"
                                class="btn btn-sm btn-outline-secondary">
                            Cancel
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
import successIcon from '../../assets/Success.svg';
import waitIcon from '../../assets/Waiting.svg';
import dangerIcon from '../../assets/Danger.svg';

export default {
    props: ['state', 'send', 'index'],
    setup() {
        return { successIcon, waitIcon, dangerIcon }
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
        },
        cancel() {
            this.send("CANCEL");
        }
    }
}
</script>
