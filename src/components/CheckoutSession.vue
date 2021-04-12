<template>
    <div>
        <div class="form-group">
            <label :for="inputId">Scan in an item barcode</label>
            <div class="input-group">
                <input :id="inputId"
                        v-model="barcode"
                        ref="scanner"
                        :disabled="state.matches({selected: 'loading'})"
                        @keyup.enter="onScanIn"
                        type="text"
                        :class="{'form-control': true, 'is-invalid': !isValid}"
                        placeholder="Item barcode"
                        aria-label="Scan in an item barcode">
                <div class="input-group-append">
                    <button :disabled="state.matches({selected: 'loading'}) || !isValid" @click="onScanIn" class="btn btn-primary">Scan in</button>
                </div>
            </div>
        </div>
        <div class="mb-2">Total items scanned: {{ checkouts.length }}</div>
        <table class="table table-sm">
            <tr>
                <th class="w-25">Barcode</th>
                <th class="w-50">Title</th>
                <th class="w-25 text-right">Status</th>
            </tr>
            <tind-checkout v-for="(checkout, index) in checkouts"
                            :key="checkout.barcode"
                            :state="checkout.ref.state"
                            :send="checkout.ref.send"
                            :index="index"></tind-checkout>
        </table>
    </div>
</template>

<script>
import { useService } from '@xstate/vue';
import { circulationService } from '../circulationMachine';
import { ref } from 'vue';

export default {
    setup() {
        const scanner = ref(null);
        const { state, send } = useService(circulationService);
        return {
            scanner,
            state,
            send
        }
    },
    data() {
        return {
            id: 'checkout-session',
            barcode: ''
        }
    },
    computed: {
        checkouts() {
            return this.state.context.checkouts;
        },
        inputId() {
            return `${this.id}-input`;
        },
        isValid() {
            if (this.state.context.checkouts.length == 0) {
                return true;
            }

            return this.state.context.checkouts.every(checkout => checkout.barcode != this.barcode);
        }
    },
    methods: {
        onScanIn() {
            this.send({type: 'CHECKOUT_BARCODE', payload: this.barcode});
            this.barcode = '';
            this.scanner.focus();
        }
    }
}
</script>
