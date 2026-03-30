<template>
  <div class="header-wrapper">
    <div class="header-layout">

      <!-- Лого — занимает высоту обеих полос -->
      <div class="logo-area" @click="router.push('/')">
        <img src="/src/assets/logo-blue-cutted.svg" alt="MedStorm" class="logo-img" />
      </div>

      <!-- Правая часть: топбар + навбар -->
      <div class="header-right">

        <!-- Верхняя полоса -->
        <div class="topbar">
          <div class="topbar-inner">

            <div class="topbar-item" v-tooltip.bottom="'Деятельность лаборатории Биоспектрум осуществляется исключительно в г. Нижневартовск'">
              <i class="pi pi-map-marker topbar-icon"></i>
              <span>Нижневартовск</span>
            </div>

            <div class="topbar-sep"></div>

            <div class="topbar-item topbar-link" @click="router.push('/contacts')">
              <span>Адреса и контакты</span>
            </div>

            <div class="topbar-sep"></div>

            <div class="topbar-item topbar-link" @click="router.push('/about')">
              <span>О компании</span>
            </div>

            <div class="topbar-sep" style="margin-left: auto;"></div>

            <div class="topbar-item topbar-phone">
              <div>
                <div class="phone-number">+7 (3466) 29‒13‒45</div>
                <div class="phone-sub">Бесплатный звонок по России</div>
              </div>
            </div>

          </div>
        </div>

        <!-- Нижняя полоса — навбар -->
        <div class="navbar">
          <nav class="nav-items">
            <button
              v-for="item in items"
              :key="item.label"
              class="nav-item"
              @click="item.command"
            >
              <i :class="item.icon" class="nav-icon"></i>
              <span>{{ item.label }}</span>
            </button>
          </nav>

          <div class="nav-actions">
            <div class="cart-btn" @click="router.push('/cart')" title="Корзина">
              <i class="pi pi-shopping-cart"></i>
              <span v-if="count > 0" class="cart-badge">{{ count }}</span>
            </div>
            <i class="pi pi-user nav-user-icon" @click="toggleUserMenu" aria-haspopup="true" aria-controls="overlay_menu"></i>
            <Menu ref="userMenu" id="overlay_menu" :model="userMenuItems" :popup="true" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import AuthService from '@/services/AuthService';
import { useCart } from '@/stores/cart';
import { isLoggedIn } from '@/stores/auth';

const { count } = useCart();
const router = useRouter();
const userMenu = ref();

const items = ref([
  { label: 'Анализы',            icon: 'pi pi-fw pi-heart',      command: () => router.push('/analyzes') },
  { label: 'Исследования',       icon: 'pi pi-fw pi-wave-pulse',  command: () => router.push('/panels') },
  { label: 'Мои заказы',         icon: 'pi pi-fw pi-receipt',     command: () => router.push('/orders') },
  { label: 'Пациенты',           icon: 'pi pi-fw pi-users',       command: () => router.push('/patients') },
  { label: 'Результаты анализов',icon: 'pi pi-fw pi-search',      command: () => router.push('/results-search') },
]);

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const userMenuItems = computed(() => {
  if (!isLoggedIn.value) {
    return [
      {
        label: 'Войти или создать аккаунт',
        icon: 'pi pi-fw pi-sign-in',
        command: () => router.push('/login'),
      },
    ];
  }
  return [
    {
      label: 'Профиль',
      icon: 'pi pi-fw pi-user',
      command: () => router.push('/profile'),
    },
    { separator: true },
    {
      label: 'Выйти',
      icon: 'pi pi-fw pi-sign-out',
      command: async () => {
        try {
          await AuthService.logout();
        } catch (error) {
          console.error('Ошибка выхода из системы на сервере:', error);
        } finally {
          localStorage.removeItem('authToken');
          isLoggedIn.value = false;
          router.push('/login');
        }
      },
    },
  ];
});
</script>

<style scoped>
/* ── Обёртка ── */
.header-wrapper {
  background: #f0f9ff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* ── Основная сетка: лого | правая часть ── */
.header-layout {
  display: flex;
  align-items: stretch;
}

/* ── Лого ── */
.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.75rem;
  background: #f0f9ff;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
}

/* Разделитель только на уровне нижнего навбара (52px снизу) */
.logo-area::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  height: 52px;
  width: 1px;
  background: #d8e0ea;
}

.logo-img {
  height: 44px;
  display: block;
}

/* ── Правая часть ── */
.header-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ── Топбар ── */
.topbar {
  background: #f0f9ff;
  border-bottom: 1px solid #d8e0ea;
  padding: 0 1rem;
}

.topbar-inner {
  display: flex;
  align-items: center;
  height: 32px;
}

.topbar-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.9rem;
  height: 100%;
  color: #64748b;
  font-size: 0.78rem;
  white-space: nowrap;
  cursor: default;
}

.topbar-link {
  cursor: pointer;
  transition: color 0.15s;
}

.topbar-link:hover {
  color: #1e40af;
}

.topbar-icon {
  font-size: 0.75rem;
}

.topbar-sep {
  width: 1px;
  height: 16px;
  background: #bae6fd;
  flex-shrink: 0;
}

.phone-number {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e40af;
  line-height: 1.3;
}

.phone-sub {
  font-size: 0.62rem;
  color: #64748b;
  line-height: 1;
}

/* ── Навбар ── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #eaeff5;
  padding: 0 1rem;
  height: 52px;
}

.nav-items {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  height: 100%;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 1rem;
  height: 100%;
  background: none;
  border: none;
  cursor: pointer;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  transition: color 0.15s, background 0.15s;
  border-radius: 6px;
  letter-spacing: 0.01em;
}

.nav-item:hover {
  color: #1d4ed8;
  background: #dce8f4;
}

.nav-icon {
  font-size: 0.85rem;
  opacity: 0.7;
}

/* ── Правая часть навбара ── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  padding-right: 0.5rem;
}

.cart-btn {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #374151;
  transition: color 0.15s;
}

.cart-btn .pi {
  font-size: 1.3rem;
}

.cart-btn:hover {
  color: #1d4ed8;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #3b82f6;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 1.3rem;
  height: 1.3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.25rem;
}

.nav-user-icon {
  font-size: 1.4rem;
  cursor: pointer;
  color: #374151;
  transition: color 0.15s;
}

.nav-user-icon:hover {
  color: #1d4ed8;
}
</style>
