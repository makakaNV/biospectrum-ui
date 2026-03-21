<template>
  <div class="vacancies-page">

    <!-- Шапка -->
    <div class="vacancies-hero border-round mb-5">
      <div class="hero-text">
        <h1 class="m-0 mb-2">Работа в BioSpectrum</h1>
        <p class="m-0 hero-sub">Расти и развиваться вместе с лидером лабораторной диагностики</p>
      </div>
      <i class="pi pi-users hero-icon"></i>
    </div>

    <!-- Вступительный текст -->
    <div class="surface-card border-round shadow-1 p-5 mb-4">
      <p class="body-text">В BioSpectrum мы убеждены: успех компании начинается с людей, которые в ней работают. Наша главная ценность — сотрудники, способные не только решать текущие задачи, но и развивать компанию, совершенствоваться вместе с ней и предлагать новые идеи. Мы строим команду единомышленников, и в основе наших отношений лежат <strong>взаимоуважение, порядочность и партнерство.</strong></p>
      <p class="body-text mb-0">Сегодня в наших рядах — высококвалифицированные специалисты, которые ежедневно доказывают, что качественная лабораторная диагностика невозможна без глубокой экспертизы и ответственного подхода. Регулярные обучения, участие в профильных конференциях и курсы повышения квалификации — неотъемлемая часть работы в BioSpectrum.</p>
    </div>

    <!-- Мы предлагаем -->
    <div class="surface-card border-round shadow-1 p-5 mb-4">
      <h2 class="section-title mb-4">Мы предлагаем</h2>
      <div class="offers-grid">
        <div v-for="offer in offers" :key="offer.text" class="offer-item">
          <div class="offer-icon">
            <i :class="offer.icon"></i>
          </div>
          <span class="offer-text">{{ offer.text }}</span>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-card border-round p-5">
      <h2 class="section-title mb-2">Хотите стать частью нашей команды?</h2>
      <p class="body-text mb-4">Вы можете направить резюме или откликнуться на интересующую вас вакансию на портале hh.ru, а также написать нам на электронную почту.</p>
      <div class="flex gap-3 flex-wrap">
        <a href="https://hh.ru" target="_blank" class="cta-btn cta-primary">
          <i class="pi pi-external-link mr-2"></i>Вакансии на hh.ru
        </a>
        <a href="mailto:hr@biospectrum.ru" class="cta-btn cta-secondary">
          <i class="pi pi-envelope mr-2"></i>hr@biospectrum.ru
        </a>
      </div>
    </div>

  </div>
</template>

<script setup>
const offers = [
  { icon: 'pi pi-building',      text: 'Стабильная работа в динамично развивающейся компании' },
  { icon: 'pi pi-wallet',        text: 'Достойная оплата труда и официальное трудоустройство по ТК РФ' },
  { icon: 'pi pi-star',          text: 'Комфортные условия труда в современных медицинских офисах' },
  { icon: 'pi pi-chart-line',    text: 'Возможности для профессионального и карьерного роста' },
  { icon: 'pi pi-heart',         text: 'Дружный коллектив и корпоративная культура на основе уважения' },
];
</script>

<style scoped>
.vacancies-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0 4rem;
}

/* Герой */
.vacancies-hero {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
}

.vacancies-hero h1 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
}

.hero-sub {
  font-size: 0.95rem;
  opacity: 0.85;
}

.hero-icon {
  font-size: 4rem;
  opacity: 0.2;
  flex-shrink: 0;
}

/* Текст */
.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.body-text {
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--text-color-secondary);
  margin: 0 0 0.75rem;
}

/* Предложения */
.offers-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.offer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.offer-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
}

.offer-text {
  font-size: 0.95rem;
  color: var(--text-color-secondary);
  line-height: 1.5;
}

/* CTA */
.cta-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s;
}

.cta-btn:hover { opacity: 0.85; }

.cta-primary {
  background: #3b82f6;
  color: #fff;
}

.cta-secondary {
  background: var(--surface-ground);
  color: var(--text-color);
  border: 1px solid var(--surface-border);
}
</style>
