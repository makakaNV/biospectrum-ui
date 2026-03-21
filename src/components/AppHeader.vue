<template>
  <div class="header-wrapper">

    <!-- Верхняя полоса -->
    <div class="topbar">
      <div class="topbar-inner">

        <!-- Левая часть -->
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

        <!-- Правая часть -->
        <div class="topbar-sep" style="margin-left: auto;"></div>

        <div class="topbar-item topbar-phone">
          <div>
            <div class="phone-number">+7 (3466) 29‒13‒45</div>
            <div class="phone-sub">Бесплатный звонок по России</div>
          </div>
        </div>

      </div>
    </div>

    <!-- Основная навбар -->
    <Menubar :model="items">
      <template #start>
        <img src="/src/assets/logo.svg" alt="logo" height="40" class="mr-2" style="cursor:pointer" @click="router.push('/')" />
      </template>
      <template #end>
        <div class="flex align-items-center gap-5">
          <div class="cart-btn" @click="router.push('/cart')" title="Корзина">
            <i class="pi pi-shopping-cart" style="font-size: 1.4rem;"></i>
            <span v-if="count > 0" class="cart-badge">{{ count }}</span>
          </div>
          <i class="pi pi-user" style="font-size: 1.5rem; cursor: pointer;" @click="toggleUserMenu" aria-haspopup="true" aria-controls="overlay_menu"></i>
          <Menu ref="userMenu" id="overlay_menu" :model="userMenuItems" :popup="true" />
        </div>
      </template>
    </Menubar>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import AuthService from '@/services/AuthService';
import { useCart } from '@/stores/cart';

const { count } = useCart();
const router = useRouter();
const userMenu = ref();

const items = ref([
  { label: 'Анализы', icon: 'pi pi-fw pi-heart', command: () => { router.push('/analyzes'); } },
  { label: 'Исследования', icon: 'pi pi-fw pi-wave-pulse', command: () => { router.push('/panels'); } },
  { label: 'Мои заказы', icon: 'pi pi-fw pi-receipt', command: () => { router.push('/orders'); } },
  { label: 'Пациенты', icon: 'pi pi-fw pi-users', command: () => { router.push('/patients'); } },
  { label: 'Результаты анализов', icon: 'pi pi-fw pi-search', command: () => { router.push('/results-search'); } }
]);

const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const userMenuItems = ref([
  {
    label: 'Профиль',
    icon: 'pi pi-fw pi-user',
    command: () => { router.push('/profile'); }
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
        router.push('/login');
      }
    }
  }
]);
</script>

<style scoped>
.header-wrapper {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding-top: 6px;
  background: #27272a;
}

/* Топбар */
.topbar {
  background: #27272a;
  border-bottom: 1px solid #3f3f46;
  padding: 0 1rem;
}

.topbar-inner {
  display: flex;
  align-items: center;
  height: 28px;
}

.topbar-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 0.9rem;
  height: 100%;
  color: #a1a1aa;
  font-size: 0.78rem;
  white-space: nowrap;
  cursor: default;
}

.topbar-link {
  cursor: pointer;
  transition: color 0.15s;
}

.topbar-link:hover {
  color: #ffffff;
}

.topbar-icon {
  font-size: 0.75rem;
}

.topbar-sep {
  width: 1px;
  height: 16px;
  background: #3f3f46;
  flex-shrink: 0;
}

.phone-number {
  font-size: 0.82rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.phone-sub {
  font-size: 0.62rem;
  color: #71717a;
  line-height: 1;
}

/* Корзина */
.cart-btn {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #22c55e;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 1.4rem;
  height: 1.4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.3rem;
}
</style>
