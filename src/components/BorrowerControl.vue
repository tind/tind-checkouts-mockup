<template>
    <div>
        <div class="form-group">
            <label :for="inputId">Enter a UID</label>
            <input :id="inputId"
                :disabled="state.matches('selected')"
                @keyup.enter="onSelectBorrower"
                @input="onInput"
                :value="uid"
                class="form-control"
                placeholder="Enter a UID"
                aria-label="Patron UID"
                type="text">
        </div>
        <button @click="onSelectBorrower"
                v-if="state.matches('pending')"
                class="btn btn-outline-secondary">Select borrower</button>
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
        inputId() {
            return `${this.id}-input`
        },
        uid() {
            return this.state.context.borrower.uid;
        }
    },
    data() {
        return {
            id: "borrower-control"
        }
    },
    methods: {
        onSelectBorrower() {
            this.send('SELECT_BORROWER');
        },
        onInput(event) {
            this.send({type: 'UPDATE_BORROWER_UID', payload: event.target.value});
        },
        onUnsetBorrower() {
            this.send('RESET_BORROWER');
        }
    }
}
</script>
