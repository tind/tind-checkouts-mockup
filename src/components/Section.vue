<template>
    <section class="row">
        <div class="col">
            <div class="p-1 mb-3 text-light" style="background-color: #5499C8;">{{ title }}</div>
            <div class="mb-3">
                <slot></slot>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: ['title']
}
</script>
