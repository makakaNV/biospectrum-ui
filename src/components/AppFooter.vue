<template>
  <footer class="app-footer">
    <div class="footer-inner">

      <!-- Бренд + контакт -->
      <div class="footer-col footer-brand">
        <div class="brand-name">BioSpectrum</div>
        <div class="brand-sub">Лабораторная диагностика</div>
        <div class="footer-contact mt-3">
          <span class="footer-phone">+7 (3466) 29‒13‒45</span>
          <a href="https://t.me/certina8" target="_blank" class="tg-link" title="Telegram">
            <i class="pi pi-telegram"></i>
          </a>
        </div>
        <div class="footer-hint">Бесплатный звонок по России</div>
      </div>

      <!-- Услуги -->
      <div class="footer-col">
        <div class="footer-col-title">Услуги</div>
        <a class="footer-link" @click="router.push('/analyzes')">Анализы</a>
        <a class="footer-link" @click="router.push('/panels')">Исследования</a>
        <a class="footer-link" @click="router.push('/results-search')">Результаты анализов</a>
      </div>

      <!-- Компания -->
      <div class="footer-col">
        <div class="footer-col-title">Компания</div>
        <a class="footer-link" @click="router.push('/about')">О компании</a>
        <a class="footer-link" @click="router.push('/contacts')">Контакты</a>
        <a class="footer-link" @click="router.push('/vacancies')">Вакансии</a>
        <a class="footer-link" @click="router.push('/about-project')">О проекте</a>
        <a class="footer-link" href="https://admin.biospectrum.ru" target="_blank" rel="noopener">Сотрудникам</a>
      </div>

      <!-- Правовое -->
      <div class="footer-col">
        <div class="footer-col-title">Правовое</div>
        <a class="footer-link" @click="router.push('/terms')">Пользовательское соглашение</a>
      </div>


    </div>

    <!-- Нижняя полоса -->
    <div class="footer-bottom">
      <span>© {{ year }} BioSpectrum. Все права защищены.</span>
    </div>

  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const year = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  background: #f8fafc;
  margin-top: 4rem;
  border-top: 1px solid #e2e8f0;
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 2rem 1rem;
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

/* Колонки */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 140px;
}

.footer-brand {
  flex: 1.5;
  min-width: 180px;
}

.footer-col-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  margin-bottom: 0.4rem;
}

.footer-link {
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  transition: color 0.15s;
  text-decoration: none;
  line-height: 1.6;
}

.footer-link:hover {
  color: #0f172a;
}

/* Бренд */
.brand-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.03em;
}

.brand-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.footer-contact {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.footer-phone {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}

.tg-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #2aabee22;
  color: #2aabee;
  font-size: 0.85rem;
  transition: background 0.15s;
  text-decoration: none;
}

.tg-link:hover {
  background: #2aabee44;
}

.footer-hint {
  font-size: 0.68rem;
  color: #64748b;
  margin-top: -0.2rem;
}

/* Нижняя полоса */
.footer-bottom {
  padding: 0.6rem 2rem 0.8rem;
  max-width: 1280px;
  margin: 0 auto;
  font-size: 0.75rem;
  color: #64748b;
}
</style>
