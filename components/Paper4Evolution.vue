<script setup lang="ts">
import Paper4EvolutionVideo from './Paper4EvolutionVideo.vue'
</script>

<template>
  <div class="paper4-evolution-body">
    <div class="paper4-evolution-points">
      <section>
        <h2>Other CTGCs appear and dissipate</h2>
        <p>The selected cell is embedded in an active population; neighboring cells emerge and decay around it.</p>
      </section>
      <section>
        <h2>Fall streak is not that easy to see</h2>
        <p>In 3D anomaly isosurfaces aloft, the streak appears discontinuous rather than a solid vertical column.</p>
      </section>
      <section>
        <h2>Strong signal in the melting layer</h2>
        <p>A persistent, high-reflectivity anomaly remains continuously present in the underlying melting layer.</p>
      </section>
    </div>
    <figure class="paper4-evolution-volume">
      <Paper4EvolutionVideo />
      <figcaption>Three-radar <em>Z</em>′ isosurfaces · <span class="paper4-cyan-key">5 dB</span> and <span class="paper4-red-key">7 dB</span></figcaption>
    </figure>
  </div>
</template>

<style scoped>
.paper4-evolution-body {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1fr) 4.2rem minmax(0, 1.08fr);
  align-items: center;
  gap: 0.25rem 0.2rem;
  min-height: 0;
  width: 100%;
}

.paper4-evolution-points {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
}

.paper4-evolution-points section {
  padding: 0.4rem 0.8rem;
  border-left: 4px solid var(--cu-gold);
}

.paper4-evolution-points h2 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.paper4-evolution-points p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.35;
}

.paper4-evolution-volume {
  grid-column: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  margin: 0;
}

.paper4-evolution-volume figcaption {
  margin: 0.25rem 0 0;
  color: var(--cu-text-muted);
  font-size: 0.68rem;
  line-height: 1.3;
  text-align: center;
}

.paper4-cyan-key {
  padding-bottom: 1px;
  border-bottom: 3px solid #82c8c8;
}

.paper4-red-key {
  padding-bottom: 1px;
  border-bottom: 3px solid #a32629;
}
</style>

<style>
.slidev-layout.paper4-evolution {
  padding-top: 0.85rem;
  padding-bottom: 3.5rem;
}

.slidev-layout.paper4-evolution h1 {
  margin-bottom: 0.45rem;
  font-size: 1.75rem;
}
</style>
