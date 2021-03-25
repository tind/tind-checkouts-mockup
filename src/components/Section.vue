<template>
    <section class="row">
        <div class="col">
            <div class="bg-primary p-1 mb-3 text-light">{{ title }}</div>
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
