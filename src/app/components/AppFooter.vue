<template>
  <footer class="app-footer">
    <p>
      Hecho con <span class="heart" aria-label="amor">♥</span> por
      <strong>Michael Linares</strong> para los amantes de la astronomía.
    </p>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  position: relative;
  z-index: 1;
  padding: 24px 16px 32px;
  text-align: center;
  color: rgba(248, 250, 252, 0.72);
  font-size: 0.92rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(11, 16, 32, 0.35);
}

p {
  margin: 0;
  line-height: 1.6;
}

strong {
  color: rgba(248, 250, 252, 0.92);
}

.heart {
  color: #f472b6;
  display: inline-block;
}
</style>
