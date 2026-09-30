<script setup lang="ts">
defineProps<{
  src: string
  alt: string
}>()
</script>

<template>
  <div class="paper4-evolution-maps">
    <figure class="paper4-map-figure">
      <img :src="src" :alt="alt" />
    </figure>
    <div class="paper4-map-notes">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.paper4-evolution-maps {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1.06fr) minmax(0, 0.94fr);
  grid-template-rows: minmax(0, 1fr);
  align-items: center;
  gap: 1.1rem;
  min-height: 0;
  width: 100%;
}

.paper4-map-figure {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  margin: 0;
}

.paper4-map-figure img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.paper4-map-notes {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.paper4-map-notes :deep(section) {
  padding: 0.45rem 0.85rem;
  border-left: 4px solid var(--cu-gold);
}

.paper4-map-notes :deep(section > h2),
.paper4-map-notes :deep(section > strong) {
  display: block;
  margin: 0 0 0.25rem;
  color: var(--cu-heading);
  font-size: 1.08rem;
  line-height: 1.25;
}

.paper4-map-notes :deep(p) {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.35;
  text-wrap: pretty;
}
</style>

<style>
.slidev-layout.paper4-map-evolution {
  padding-top: 0.85rem;
  padding-bottom: 3.5rem;
}

.slidev-layout.paper4-map-evolution h1 {
  margin-bottom: 0.45rem;
  font-size: 1.75rem;
}
</style>
