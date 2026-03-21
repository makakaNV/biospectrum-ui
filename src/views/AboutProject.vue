<template>
  <div class="about-project-page">

    <h1 class="page-title">О проекте</h1>
    <p class="page-sub">BioSpectrum - выпускная квалификационная работа.</p>

    <div class="blocks">

      <!-- Frontend -->
      <div class="block">
        <div class="block-header">
          <span class="block-label frontend">Frontend</span>
          <h2 class="block-title">Клиентская часть</h2>
        </div>
        <div class="tech-list">
          <div class="tech-item" v-for="t in frontend" :key="t.name">
            <span class="tech-name">{{ t.name }}</span>
            <span class="tech-desc">{{ t.desc }}</span>
          </div>
        </div>
      </div>

      <!-- Backend -->
      <div class="block">
        <div class="block-header">
          <span class="block-label backend">Backend</span>
          <h2 class="block-title">Серверная часть</h2>
        </div>
        <p class="block-note">
          Микросервисная архитектура на базе Spring Boot. API доступен по адресу
          <a href="https://medstorm-api.ru" target="_blank" class="inline-link">medstorm-api.ru</a>
        </p>
        <div class="tech-list">
          <div class="tech-item" v-for="t in backend" :key="t.name">
            <span class="tech-name">{{ t.name }}</span>
            <span class="tech-desc">{{ t.desc }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Ссылки -->
    <div class="links-section">
      <div class="links-title">Репозитории</div>
      <div class="links-row">
        <a v-for="link in links" :key="link.label" :href="link.url" target="_blank" class="link-chip">
          <i :class="link.icon"></i>
          <span>{{ link.label }}</span>
        </a>
      </div>
    </div>

  </div>
</template>

<script setup>
const frontend = [
  { name: 'Vue 3',       desc: 'Composition API + <script setup>' },
  { name: 'Vite',        desc: 'Сборщик и дев-сервер' },
  { name: 'PrimeVue 4',  desc: 'UI-компоненты, тема Aura' },
  { name: 'PrimeFlex',   desc: 'Утилитарные CSS-классы' },
  { name: 'Vue Router',  desc: 'Клиентская маршрутизация' },
  { name: 'Axios',       desc: 'HTTP-клиент, авторизация через Bearer-токен' },
];

const backend = [
  { name: 'Spring Boot',    desc: 'Основа каждого микросервиса' },
  { name: 'Spring Cloud',   desc: 'Gateway, Service Discovery (Consul)' },
  { name: 'Spring Security',desc: 'JWT-авторизация' },
  { name: 'PostgreSQL',     desc: 'Основная БД' },
  { name: 'Docker',         desc: 'Контейнеризация сервисов' },
  { name: 'Nginx',          desc: 'Reverse-proxy, SSL-терминация' },
];

const links = [
  { label: 'GitLab',     icon: 'pi pi-gitlab',   url: 'https://gitlab.com/medstorm' },
  { label: 'GitHub',     icon: 'pi pi-github',   url: 'https://github.com/makakaNV' },
  { label: 'Docker Hub', icon: 'pi pi-box',       url: 'https://hub.docker.com/repositories/certina' },
  { label: 'Telegram',   icon: 'pi pi-telegram', url: 'https://t.me/certina8' },
];
</script>

<style scoped>
.about-project-page {
  max-width: 780px;
  margin: 0 auto;
  padding: 2rem 0 3rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: #0f172a;
}

.page-sub {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0 0 2rem;
}

/* Блоки */
.blocks {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.block {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  padding: 1.5rem;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.block-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.block-label.frontend {
  background: #dbeafe;
  color: #1d4ed8;
}

.block-label.backend {
  background: #dcfce7;
  color: #15803d;
}

.block-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
}

.block-note {
  font-size: 0.88rem;
  color: #64748b;
  margin: 0 0 1rem;
  line-height: 1.6;
}

.inline-link {
  color: #2563eb;
  text-decoration: none;
}
.inline-link:hover {
  text-decoration: underline;
}

/* Таблица технологий */
.tech-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tech-item {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid #e8edf2;
  font-size: 0.88rem;
}

.tech-item:last-child {
  border-bottom: none;
}

.tech-name {
  font-weight: 600;
  color: #1e293b;
  min-width: 160px;
  flex-shrink: 0;
}

.tech-desc {
  color: #64748b;
}

/* Ссылки */
.links-section {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}

.links-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 0.875rem;
}

.links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.link-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s;
}

.link-chip:hover {
  border-color: #3b82f6;
  color: #2563eb;
}
</style>
