<template>
  <div class="about">
    <header class="hero">
      <p class="eyebrow">Sobre Asteria</p>
      <h1>Tu ventana al universo</h1>
      <p class="lead">
        Asteria es una app de astronomía hecha para explorar el cielo de forma simple,
        visual e interactiva desde cualquier dispositivo.
      </p>
    </header>

    <section class="card">
      <h2>Qué puedes hacer</h2>
      <ul class="features">
        <li><span>🌌</span><div><strong>Hoy en el cielo</strong><p>Foto astronómica del día, fase lunar y horarios solares según tu ubicación.</p></div></li>
        <li><span>🪐</span><div><strong>Explorar planetas</strong><p>Descubre datos de cuerpos celestes y calcula tu peso en cada uno.</p></div></li>
        <li><span>🔭</span><div><strong>Ver el cielo</strong><p>Consulta planetas visibles, eventos astronómicos y constelaciones.</p></div></li>
        <li><span>🛰️</span><div><strong>Seguir la ISS</strong><p>Rastrea la Estación Espacial Internacional en tiempo casi real.</p></div></li>
        <li><span>📚</span><div><strong>Aprender</strong><p>Lecciones cortas, quiz y progreso guardado para aprender astronomía.</p></div></li>
      </ul>
    </section>

    <section class="card mission">
      <h2>Nuestra misión</h2>
      <p>
        Acercar la astronomía a todas las personas con una experiencia clara, moderna y
        bonita. Porque mirar el cielo debería sentirse tan increíble como lo es.
      </p>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.about {
  max-width: 900px;
  margin: 0 auto;
  color: #f5f7ff;
}

.hero {
  margin-bottom: 24px;
  animation: fade-up 0.4s ease both;
}

.eyebrow {
  margin: 0;
  color: #7dd3fc;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

h1 {
  margin: 4px 0 12px;
  font-size: clamp(2rem, 8vw, 3.4rem);
  line-height: 1.1;
}

.lead {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(245, 247, 255, 0.86);
  max-width: 700px;
}

.card {
  background: rgba(10, 18, 40, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
  margin-bottom: 16px;
  animation: fade-up 0.5s ease both;
}

h2 {
  margin: 0 0 16px;
  font-size: 1.4rem;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 14px;
}

.features li {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.features li:first-child {
  padding-top: 0;
  border-top: 0;
}

.features span {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.features strong {
  display: block;
  margin-bottom: 4px;
  font-size: 1rem;
}

.features p,
.mission p {
  margin: 0;
  color: rgba(245, 247, 255, 0.84);
  line-height: 1.6;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero, .card { animation: none; }
}
</style>
