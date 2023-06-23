<template>
  <div class="p-2 border rounded text-white">
    <h1 class="font-semibold text-md text-center pb-2 border-b text-white">
      <slot name="heading"></slot>
    </h1>
    <div class="cards-container grid">
      <slot name="cards"></slot>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-top: 2rem;
  display: flex;
}
</style>
