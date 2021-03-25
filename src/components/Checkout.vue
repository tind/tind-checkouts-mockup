<template>
    <tr>
        <td>{{ index + 1 }}</td>
        <td>{{ state.context.itemBarcode }}</td>
        <td>{{ state.context.itemTitle }}</td>
        <td><span v-if="state.matches('active')">{{ state.context.checkoutPolicy }}</span></td>
        <td><span v-if="state.matches('active')">{{ state.context.checkoutDue }}</span></td>
        <td>{{ state.value }}</td>
        <td><button class="btn btn-secondary btn-sm">Actions</button></td>
    </tr>
</template>

<script>
export default {
    props: ['state', 'index']
}
</script>
