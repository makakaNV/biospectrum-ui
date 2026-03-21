<template>
  <div class="analyzes-page">
    <h1 class="mb-3">Анализы</h1>

    <!-- Компактная строка поиска -->
    <div class="search-bar border-round shadow-1 p-2 mb-4">
      <div class="flex gap-2 align-items-center">
        <IconField class="flex-grow-1">
          <InputIcon class="pi pi-search" />
          <InputText
            v-model="filters.keyword"
            placeholder="Поиск по названию, коду, описанию..."
            class="w-full"
            @keyup.enter="applySearch"
          />
        </IconField>
        <Button label="Найти" icon="pi pi-search" @click="applySearch" />
        <Button
          icon="pi pi-times"
          outlined
          severity="secondary"
          v-tooltip.top="'Сбросить'"
          @click="resetFilters"
          :disabled="!isSearchMode"
        />
        <Button
          :icon="showFilters ? 'pi pi-chevron-up' : 'pi pi-sliders-h'"
          outlined
          severity="secondary"
          v-tooltip.top="'Фильтры'"
          @click="showFilters = !showFilters"
        />
        <Button
          :icon="showSort ? 'pi pi-sort-amount-up-alt' : 'pi pi-sort-alt'"
          outlined
          severity="secondary"
          v-tooltip.top="'Сортировка'"
          @click="showSort = !showSort"
        />
      </div>

      <!-- Фильтры -->
      <div v-if="showFilters" class="mt-3 pt-3 border-top-1 surface-border">
        <div class="flex flex-wrap gap-3 align-items-end" style="row-gap: 1rem; width: 100%; min-width: 0;">
          <div class="flex flex-column gap-1 adv-field">
            <label class="text-sm font-medium">Название</label>
            <InputText v-model="filters.name" placeholder="Глюкоза" @keyup.enter="applySearch" />
          </div>
          <div class="flex flex-column gap-1 adv-field-sm">
            <label class="text-sm font-medium">Код</label>
            <InputText v-model="filters.code" placeholder="GL-40" @keyup.enter="applySearch" />
          </div>
          <div class="flex flex-column gap-1 adv-field">
            <label class="text-sm font-medium">Описание</label>
            <InputText v-model="filters.description" placeholder="Ключевое слово" @keyup.enter="applySearch" />
          </div>
<!--          <div class="flex flex-column gap-1 adv-field-sm">-->
<!--            <label class="text-sm font-medium">Точная цена (₽)</label>-->
<!--            <InputNumber v-model="filters.price" placeholder="2350" :min="0" :useGrouping="false" @keyup.enter="applySearch" />-->
<!--          </div>-->
        </div>
      </div>

      <!-- Сортировка -->
      <div v-if="showSort" class="mt-3 pt-3" :class="showFilters ? '' : 'border-top-1 surface-border'">
        <div class="flex align-items-end gap-2">
          <div class="flex flex-column gap-1 adv-field-sort">
            <label class="text-sm font-medium">Сортировка</label>
            <Select
              v-model="filters.sortField"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="По умолчанию"
              showClear
              @change="applySearch"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Основной layout: сайдбар + список -->
    <div class="analyzes-layout">

      <!-- Левый сайдбар с группами -->
      <aside class="groups-sidebar" :class="{ 'sidebar-dimmed': isSearchMode }">
        <button
          v-for="tab in tabs"
          :key="tab.code"
          class="group-btn"
          :class="{ active: selectedTab === tab.code && !isSearchMode }"
          :disabled="isSearchMode"
          @click="selectTab(tab.code)"
        >
          {{ tab.name }}
        </button>
      </aside>

      <!-- Список анализов -->
      <div class="analyzes-content">
        <div v-if="isSearchMode" class="text-sm text-color-secondary mb-3">
          <i class="pi pi-info-circle mr-1"></i>Поиск по всем категориям
        </div>

        <!-- Описание категории -->
        <div v-if="currentDescription && !isSearchMode" class="category-description border-round p-3 mb-4">
          <div class="flex align-items-start gap-2">
            <i class="pi pi-info-circle mt-1 flex-shrink-0" style="color: #3b82f6; font-size: 1rem;"></i>
            <p class="m-0 text-color-secondary line-height-3" style="font-size: 0.9rem;">{{ currentDescription }}</p>
          </div>
        </div>

        <div v-if="analyses.length > 0">
          <AnalysisCard v-for="analysis in analyses" :key="analysis.id" :analysis="analysis" />
        </div>

        <div v-else-if="!isLoading" class="text-center mt-5">
          <i class="pi pi-search text-4xl text-color-secondary mb-3" style="display:block"></i>
          <p class="text-color-secondary">Ничего не найдено.</p>
        </div>

        <div v-if="isLoading" class="flex justify-content-center mt-4">
          <i class="pi pi-spin pi-spinner text-3xl text-color-secondary"></i>
        </div>

        <div class="flex justify-content-center mt-4" v-if="hasMore && !isLoading">
          <Button label="Показать ещё" @click="loadMore" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import AnalysisService from '@/services/AnalysisService';
import AnalysisCard from '@/components/AnalysisCard.vue';

const ALL_TAB = { code: 'all', name: 'Все' };

const tabs = ref([ALL_TAB]);
const selectedTab = ref('all');
const categoryDescriptions = ref({});

const analyses = ref([]);
const page = ref(0);
const limit = ref(20);
const isLoading = ref(false);
const hasMore = ref(true);
const showFilters = ref(false);
const showSort = ref(false);

const filters = reactive({
  keyword: '',
  name: '',
  code: '',
  description: '',
  price: null,
  sortField: null,
});

const sortOptions = [
  { label: 'По названию', value: 'NAME' },
  { label: 'По коду',     value: 'CODE' },
  { label: 'По цене',     value: 'PRICE' },
];

const isSearchMode = computed(() => !!(
  filters.keyword?.trim() ||
  filters.name?.trim() ||
  filters.code?.trim() ||
  filters.description?.trim() ||
  filters.price !== null ||
  filters.sortField
));

const buildSearchBody = () => {
  const body = {};
  if (filters.keyword?.trim())     body.keyword     = filters.keyword.trim();
  if (filters.name?.trim())        body.name        = filters.name.trim();
  if (filters.code?.trim())        body.code        = filters.code.trim();
  if (filters.description?.trim()) body.description = filters.description.trim();
  if (filters.price !== null)      body.price       = filters.price;
  if (filters.sortField)           body.sortField   = filters.sortField;
  return body;
};

const resetPagination = () => {
  analyses.value = [];
  page.value = 0;
  hasMore.value = true;
};

const fetchAnalyses = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;
  try {
    let response;
    if (isSearchMode.value) {
      response = await AnalysisService.searchAnalyses(buildSearchBody(), { page: page.value, limit: limit.value });
    } else if (selectedTab.value === 'all') {
      response = await AnalysisService.getAnalyses({ page: page.value, limit: limit.value });
    } else {
      response = await AnalysisService.getAnalysesByCategory(selectedTab.value, { page: page.value, limit: limit.value });
    }
    const payload = response.data.payload;
    analyses.value.push(...(payload.content || []));
    page.value++;
    hasMore.value = payload.pagination.page < payload.pagination.pages - 1;
  } catch (error) {
    console.error('Ошибка при загрузке анализов:', error);
    hasMore.value = false;
  } finally {
    isLoading.value = false;
  }
};

const applySearch = () => { resetPagination(); fetchAnalyses(); };

const resetFilters = () => {
  filters.keyword = '';
  filters.name = '';
  filters.code = '';
  filters.description = '';
  filters.price = null;
  filters.sortField = null;
  resetPagination();
  fetchAnalyses();
};

const loadMore = () => fetchAnalyses();

const selectTab = (code) => {
  if (isSearchMode.value || selectedTab.value === code) return;
  selectedTab.value = code;
  resetPagination();
  fetchAnalyses();
};

const currentDescription = computed(() => categoryDescriptions.value[selectedTab.value] ?? null);

const loadCategories = async () => {
  try {
    const response = await AnalysisService.getCategories({ page: 0, limit: 100 });
    const categories = response.data.payload.content || [];
    tabs.value = [ALL_TAB, ...categories.map(c => ({ code: c.code, name: c.name }))];
    categories.forEach(c => {
      if (c.description) categoryDescriptions.value[c.code] = c.description;
    });
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
  }
};

onMounted(async () => {
  await loadCategories();
  fetchAnalyses();
});
</script>

<style scoped>
.analyzes-page {
  padding: 2rem 0;
}

/* Строка поиска */
.search-bar {
  background: #f5f7fa;
  border: 1px solid #e8edf2;
}

.adv-field      { flex: 1 1 140px; min-width: 0; }
.adv-field-sm   { flex: 0 1 100px; min-width: 0; }
.adv-field-sort { flex: 0 1 160px; min-width: 0; }

/* Основной layout */
.analyzes-layout {
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
  transition: opacity 0.2s;
}

.groups-sidebar.sidebar-dimmed {
  opacity: 0.4;
  pointer-events: none;
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

.group-btn:disabled {
  cursor: default;
}

.category-description {
  max-width: 560px;
  background: var(--surface-ground);
}

/* Контент */
.analyzes-content {
  flex: 1;
  min-width: 0;
}
</style>
