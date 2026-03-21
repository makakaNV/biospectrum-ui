<template>
  <div class="dashboard">

    <!-- ═══ 1. КАРУСЕЛЬ ═══ -->
    <section class="carousel-section mb-6">
      <Carousel :value="banners" :numVisible="1" :numScroll="1" :autoplayInterval="5000" circular>
        <template #item="{ data }">
          <div class="banner-slide border-round-xl overflow-hidden">
            <img :src="data.image" :alt="data.title" class="banner-bg" />
            <div class="banner-overlay" :style="{ background: data.overlay }"></div>
            <div class="banner-content">
              <div class="banner-text">
                <span class="banner-tag">{{ data.tag }}</span>
                <h2 class="banner-title">{{ data.title }}</h2>
                <p class="banner-sub">{{ data.sub }}</p>
                <Button :label="data.btn" class="banner-btn" @click="router.push(data.link)" />
              </div>
            </div>
          </div>
        </template>
      </Carousel>
    </section>

    <!-- ═══ 2. КАК ЭТО РАБОТАЕТ ═══ -->
    <section class="how-section mb-6">
      <div class="section-header">
        <h2 class="section-title">Три шага чтобы быть здоровым</h2>
      </div>
      <div class="steps-grid">
        <div class="step-card" v-for="step in steps" :key="step.num">
          <div class="step-icon-wrap">
            <i :class="step.icon"></i>
          </div>
          <div class="step-title">{{ step.title }}</div>
          <p class="step-desc">{{ step.desc }}</p>
          <div class="step-arrow" v-if="step.num < 3"><i class="pi pi-arrow-right"></i></div>
        </div>
      </div>
    </section>

    <!-- ═══ 3. АНАЛИЗЫ ПО НИЗКОЙ ЦЕНЕ ═══ -->
    <section class="cheap-section mb-6">
      <div class="section-header">
        <h2 class="section-title">Анализы по доступной цене</h2>
        <Button label="Все анализы" text icon="pi pi-arrow-right" iconPos="right" @click="router.push('/analyzes')" />
      </div>

      <div v-if="cheapLoading" class="flex justify-content-center py-4">
        <i class="pi pi-spin pi-spinner text-3xl" style="color: var(--primary-color);"></i>
      </div>
      <div v-else class="cheap-scroll">
        <div
          v-for="item in cheapAnalyses"
          :key="item.id"
          class="cheap-card"
        >
          <div class="cheap-icon-wrap">
            <i class="pi pi-heart" style="font-size: 1.3rem; color: #3b82f6;"></i>
          </div>
          <div class="cheap-name">{{ item.name }}</div>
          <div class="cheap-code text-color-secondary">{{ item.code }}</div>
          <div class="cheap-price">{{ formatCurrency(item.price) }}</div>
          <Button
            :icon="isInCart(item.id, 'analysis') ? 'pi pi-check' : 'pi pi-plus'"
            rounded
            size="small"
            :outlined="!isInCart(item.id, 'analysis')"
            :severity="isInCart(item.id, 'analysis') ? 'success' : undefined"
            class="mt-2"
            @click="toggleItem(item, 'analysis')"
          />
        </div>
      </div>
    </section>

    <!-- ═══ 4. КАТЕГОРИИ ═══ -->
    <section class="categories-section mb-6">
      <div class="section-header">
        <h2 class="section-title">Категории анализов</h2>
        <Button label="Все категории" text icon="pi pi-arrow-right" iconPos="right" @click="router.push('/analyzes')" />
      </div>

      <div v-if="catsLoading" class="flex justify-content-center py-4">
        <i class="pi pi-spin pi-spinner text-3xl" style="color: var(--primary-color);"></i>
      </div>
      <div v-else class="cats-grid">
        <div
          v-for="(cat, i) in categories"
          :key="cat.code"
          class="cat-card"
          :style="{ '--cat-color': catColors[i % catColors.length] }"
          @click="goToCategory(cat.code)"
        >
          <div class="cat-icon-wrap">
            <i :class="catIcons[i % catIcons.length]"></i>
          </div>
          <div class="cat-name">{{ cat.name }}</div>
          <i class="pi pi-chevron-right cat-arrow"></i>
        </div>
      </div>
    </section>

    <!-- ═══ 5. ПОЧЕМУ МЫ ═══ -->
    <section class="why-section mb-6">
      <div class="section-header">
        <h2 class="section-title">Почему выбирают нас</h2>
        <p class="section-sub">Качество, скорость и забота о каждом пациенте</p>
      </div>
      <div class="why-grid">
        <div v-for="adv in advantages" :key="adv.title" class="why-card">
          <div class="why-icon-wrap" :style="{ background: adv.bg, color: adv.color }">
            <i :class="adv.icon"></i>
          </div>
          <div class="why-title">{{ adv.title }}</div>
          <p class="why-desc">{{ adv.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ 6. CTA ═══ -->
    <section class="cta-section mb-2">
      <div class="cta-inner">
        <div class="cta-text">
          <h2 class="cta-title">Запишитесь сегодня — результаты уже завтра</h2>
          <p class="cta-sub">Широкий спектр анализов, точное оборудование, быстрая выдача результатов онлайн</p>
        </div>
        <div class="cta-actions">
          <Button label="Выбрать анализы" icon="pi pi-heart" size="large" class="cta-btn-main" @click="router.push('/analyzes')" />
          <Button label="Исследования" icon="pi pi-wave-pulse" size="large" outlined class="cta-btn-sec" @click="router.push('/panels')" />
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Carousel from 'primevue/carousel';
import Button from 'primevue/button';
import AnalysisService from '@/services/AnalysisService';
import { useCart } from '@/stores/cart';

const router = useRouter();
const { toggleItem, isInCart } = useCart();

// ── Карусель ──
const banners = ref([
  {
    tag: 'Специальное предложение',
    title: 'Скидка 10% на онкоскрининг',
    sub: 'Мужской и женский онкологические комплексы. Раннее выявление рака спасает жизни. Пройдите обследование сейчас по специальной цене',
    btn: 'Перейти к исследованиям',
    link: '/panels',
    image: '/images/banners/man_women_cropped.png',
    overlay: 'linear-gradient(to right, rgba(10,20,40,0.72) 0%, rgba(10,20,40,0.45) 55%, rgba(10,20,40,0.1) 100%)',
  },
  {
    tag: 'Новый офис',
    title: 'Посетите наш новый офис',
    sub: 'Современное оснащение, комфортная зона ожидания и удобная парковка - мы открылись по новому адресу в центре города',
    btn: 'Узнать адрес',
    link: '/about',
    image: '/images/banners/new_office_banner.png',
    overlay: 'linear-gradient(to right, rgba(10,20,40,0.72) 0%, rgba(10,20,40,0.45) 55%, rgba(10,20,40,0.1) 100%)',
  },
  {
    tag: 'Для всей семьи',
    title: 'Пройдите исследования всей семьёй',
    sub: 'Добавьте членов семьи прямо сейчас и оформляйте заказы для всех сразу',
    btn: 'Добавить пациентов',
    link: '/patients',
    image: '/images/banners/family_banner_cropped.png',
    overlay: 'linear-gradient(to right, rgba(10,30,20,0.70) 0%, rgba(10,30,20,0.42) 55%, rgba(10,30,20,0.08) 100%)',
  },
  {
    tag: 'Здоровье и витамины',
    title: 'Анализы на витамины и микроэлементы',
    sub: 'Усталость, снижение иммунитета, выпадение волос? Узнайте, каких витаминов не хватает вашему организму, и восстановите баланс',
    btn: 'Смотреть анализы',
    link: '/analyzes',
    image: '/images/banners/vitamins_banner.png',
    overlay: 'linear-gradient(to right, rgba(20,15,5,0.72) 0%, rgba(20,15,5,0.45) 55%, rgba(20,15,5,0.08) 100%)',
  },
]);

// ── Как это работает ──
const steps = ref([
  {
    num: 1,
    icon: 'pi pi-search',
    title: 'Выберите анализы',
    desc: 'Найдите нужные анализы или исследования в нашем каталоге и добавьте в корзину',
  },
  {
    num: 2,
    icon: 'pi pi-calendar',
    title: 'Оформите заказ',
    desc: 'Укажите пациента и удобный способ оплаты — всё займёт не более двух минут',
  },
  {
    num: 3,
    icon: 'pi pi-check-circle',
    title: 'Получите результат',
    desc: 'Результаты появятся в личном кабинете, а также на почте уже на следующий день',
  },
]);

// ── Анализы по низкой цене ──
const cheapAnalyses = ref([]);
const cheapLoading = ref(true);

const formatCurrency = (v) => {
  if (typeof v !== 'number') return '—';
  return v.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
};

const loadCheap = async () => {
  try {
    const res = await AnalysisService.searchAnalyses({ sortField: 'PRICE' }, { page: 0, limit: 8 });
    cheapAnalyses.value = res.data?.payload?.content ?? [];
  } catch {
    cheapAnalyses.value = [];
  } finally {
    cheapLoading.value = false;
  }
};

// ── Категории ──
const categories = ref([]);
const catsLoading = ref(true);

const catColors = [
  '#2563eb', '#0891b2', '#7c3aed', '#059669',
  '#d97706', '#dc2626', '#db2777', '#0284c7',
];

const catIcons = [
  'pi pi-heart', 'pi pi-eye', 'pi pi-sun', 'pi pi-bolt',
  'pi pi-shield', 'pi pi-chart-bar', 'pi pi-user', 'pi pi-star',
];

const loadCategories = async () => {
  try {
    const res = await AnalysisService.getCategories({ page: 0, limit: 12 });
    categories.value = res.data?.payload?.content ?? [];
  } catch {
    categories.value = [];
  } finally {
    catsLoading.value = false;
  }
};

const goToCategory = (code) => {
  router.push({ path: '/analyzes', query: { category: code } });
};

// ── Почему мы ──
const advantages = ref([
  {
    icon: 'pi pi-clock',
    title: 'Результаты за 1 день',
    desc: '80% анализов выполняем в день обращения. Сложные исследования не более 1–2 суток',
    bg: '#eff6ff', color: '#1d4ed8',
  },
  {
    icon: 'pi pi-cog',
    title: 'Точное оборудование',
    desc: 'Приборы мировых лидеров: Roche Diagnostics, Abbott, Sysmex - точность на уровне пикограмм',
    bg: '#f0fdf4', color: '#15803d',
  },
  {
    icon: 'pi pi-mobile',
    title: 'Результаты онлайн',
    desc: 'Как только анализ готов уведомление и доступ к результатам прямо в личном кабинете',
    bg: '#fdf4ff', color: '#7e22ce',
  },
  {
    icon: 'pi pi-comments',
    title: 'Бесплатная консультация',
    desc: 'Врач-лаборант поможет расшифровать результаты и направит к нужному специалисту',
    bg: '#fff7ed', color: '#c2410c',
  },
]);

onMounted(() => {
  loadCheap();
  loadCategories();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem 0 1rem;
}

/* ─ Общие ─ */
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
}
.section-sub {
  color: #64748b;
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

/* ─ 1. Карусель ─ */
.banner-slide {
  height: 340px;
  position: relative;
  user-select: none;
}
.banner-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
.banner-overlay {
  position: absolute;
  inset: 0;
}
.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 2.5rem 3rem;
}
.banner-text {
  max-width: 560px;
  color: #fff;
}
.banner-tag {
  display: inline-block;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.22rem 0.85rem;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}
.banner-title {
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 0.65rem;
  color: #fff;
  text-shadow: 0 1px 8px rgba(0,0,0,0.3);
}
.banner-sub {
  font-size: 0.93rem;
  line-height: 1.65;
  margin: 0 0 1.35rem;
  color: rgba(255,255,255,0.88);
  text-shadow: 0 1px 4px rgba(0,0,0,0.25);
}
.banner-btn {
  background: #fff !important;
  color: #1d4ed8 !important;
  border: none !important;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
.banner-btn:hover {
  background: #f0f9ff !important;
}

/* ─ 2. Как это работает ─ */
.how-section {
  background: #f5f7fa;
  border-radius: 16px;
  padding: 2rem;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  position: relative;
}
.step-card {
  background: #fff;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  padding: 1.25rem 1.25rem;
  position: relative;
  text-align: center;
}
.step-icon-wrap {
  font-size: 1.75rem;
  color: #3b82f6;
  margin: 0 0 0.75rem;
}
.step-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #0f172a;
}
.step-desc {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}
.step-arrow {
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
  z-index: 1;
}

/* ─ 3. Анализы по низкой цене ─ */
.cheap-scroll {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.75rem;
}
.cheap-scroll::-webkit-scrollbar { height: 6px; }
.cheap-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
.cheap-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

.cheap-card {
  flex-shrink: 0;
  width: 200px;
  background: #f5f7fa;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
  transition: box-shadow 0.15s, transform 0.15s;
}
.cheap-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.09);
  transform: translateY(-2px);
}
.cheap-icon-wrap {
  background: #eff6ff;
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
}
.cheap-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
}
.cheap-code {
  font-size: 0.75rem;
}
.cheap-price {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1d4ed8;
  margin-top: auto;
  padding-top: 0.5rem;
}

/* ─ 4. Категории ─ */
.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.875rem;
}
.cat-card {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: #f5f7fa;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s;
}
.cat-card:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transform: translateY(-2px);
  border-color: var(--cat-color);
}
.cat-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  color: var(--cat-color);
  background: color-mix(in srgb, var(--cat-color) 12%, white);
}
.cat-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
  flex: 1;
  line-height: 1.3;
}
.cat-arrow {
  color: #94a3b8;
  font-size: 0.75rem;
  flex-shrink: 0;
}

/* ─ 5. Почему мы ─ */
.why-section {
  background: #eef5ff;
  border-radius: 16px;
  padding: 2rem;
}
.why-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.why-card {
  background: #fff;
  border: 1px solid #e8edf2;
  border-radius: 12px;
  padding: 1.5rem 1.25rem;
  text-align: center;
}
.why-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}
.why-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}
.why-desc {
  font-size: 0.83rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0;
}

/* ─ 6. CTA ─ */
.cta-section {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #60a5fa 100%);
  border-radius: 16px;
  overflow: hidden;
}
.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.5rem 3rem;
  flex-wrap: wrap;
}
.cta-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
  line-height: 1.3;
}
.cta-sub {
  color: rgba(255,255,255,0.85);
  font-size: 0.95rem;
  margin: 0;
  max-width: 520px;
  line-height: 1.6;
}
.cta-actions {
  display: flex;
  gap: 0.875rem;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.cta-btn-main {
  background: #fff !important;
  color: #1d4ed8 !important;
  border: none !important;
  font-weight: 700;
}
.cta-btn-main:hover {
  background: #f0f9ff !important;
}
.cta-btn-sec {
  border-color: rgba(255,255,255,0.6) !important;
  color: #fff !important;
}
.cta-btn-sec:hover {
  background: rgba(255,255,255,0.1) !important;
}
</style>
