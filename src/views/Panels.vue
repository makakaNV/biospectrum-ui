<template>
  <div class="panels-page">
    <h1 class="mb-3">Исследования</h1>

    <div class="panels-layout">

      <!-- Левый сайдбар с группами -->
      <aside class="groups-sidebar">
        <button
          v-for="tab in tabs"
          :key="tab.code"
          class="group-btn"
          :class="{ active: selectedTab === tab.code }"
          @click="selectTab(tab.code)"
        >
          {{ tab.name }}
        </button>
      </aside>

      <!-- Список исследований -->
      <div class="panels-content">

        <!-- Описание группы -->
        <div v-if="currentDescription" class="group-description border-round p-3 mb-4">
          <div class="flex align-items-start gap-2">
            <i class="pi pi-info-circle mt-1 flex-shrink-0" style="color: #3b82f6; font-size: 1rem;"></i>
            <p class="m-0 text-color-secondary line-height-3" style="font-size: 0.9rem;">{{ currentDescription }}</p>
          </div>
        </div>

        <div v-if="panels.length > 0" class="panel-list">
          <PanelCard v-for="panel in panels" :key="panel.id" :panel="panel" />
        </div>

        <div v-else-if="!isLoading" class="text-center mt-5">
          <i class="pi pi-inbox text-4xl text-color-secondary mb-3" style="display:block"></i>
          <p class="text-color-secondary">Нет доступных исследований.</p>
        </div>

        <div v-if="isLoading" class="flex justify-content-center mt-4">
          <i class="pi pi-spin pi-spinner text-3xl text-color-secondary"></i>
        </div>

        <div class="flex justify-content-center mt-4" v-if="hasMore && !isLoading">
          <Button label="Показать ещё" outlined @click="fetchPanels" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import PanelService from '@/services/PanelService';
import PanelCard from '@/components/PanelCard.vue';

const ALL_TAB = { code: 'all', name: 'Все' };

const tabs = ref([ALL_TAB]);
const selectedTab = ref('all');
// code → description, сохраняется при загрузке групп
const groupDescriptions = ref({});
const panels = ref([]);
const page = ref(0);
const limit = 20;
const isLoading = ref(false);
const hasMore = ref(true);

const resetPagination = () => {
  panels.value = [];
  page.value = 0;
  hasMore.value = true;
};

const fetchPanels = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  try {
    let response;
    if (selectedTab.value === 'all') {
      response = await PanelService.getPanels({ page: page.value, limit });
    } else {
      response = await PanelService.getPanelsByGroup(selectedTab.value, { page: page.value, limit });
    }
    const payload = response.data.payload;
    panels.value.push(...(payload.content || []));
    page.value++;
    hasMore.value = payload.pagination.page < payload.pagination.pages - 1;
  } catch (e) {
    console.error('Ошибка при загрузке исследований:', e);
    hasMore.value = false;
  } finally {
    isLoading.value = false;
  }
};

const selectTab = (code) => {
  if (selectedTab.value === code) return;
  selectedTab.value = code;
  resetPagination();
  fetchPanels();
};

const currentDescription = computed(() => groupDescriptions.value[selectedTab.value] ?? null);

const loadGroups = async () => {
  try {
    const response = await PanelService.getGroups({ page: 0, limit: 100 });
    const groups = response.data.payload.content || [];
    tabs.value = [ALL_TAB, ...groups.map(g => ({ code: g.code, name: g.name }))];
    // Сохраняем описания по коду группы
    groups.forEach(g => {
      if (g.description) groupDescriptions.value[g.code] = g.description;
    });
  } catch (e) {
    console.error('Ошибка при загрузке групп:', e);
  }
};

onMounted(async () => {
  await loadGroups();
  fetchPanels();
});
</script>

<style scoped>
.panels-page {
  padding: 2rem 0;
}

.panels-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

/* Сайдбар */
.groups-sidebar {
  width: 215px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: sticky;
  top: 1rem;
}

.group-btn {
  background: #f5f7fa;
  border: 1.5px solid #e8edf2;
  border-left: 3px solid transparent;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-color);
  text-align: left;
  width: 100%;
  transition: all 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  line-height: 1.3;
}

.group-btn:hover {
  border-left-color: #3b82f6;
  color: #2563eb;
  background: #eaeff5;
}

.group-btn.active {
  background: #eaeff5;
  border-color: #d8e0ea;
  border-left: 4px solid #3b82f6;
  color: #2563eb;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

/* Контент */
.panels-content {
  flex: 1;
  min-width: 0;
}

.group-description {
  max-width: 560px;
  background: var(--surface-ground);
}

.panel-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
