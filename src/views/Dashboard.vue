<template>
  <div class="dashboard">
    <div class="ad-carousel mb-5">
      <Carousel :value="products" :numVisible="1" :numScroll="1" :autoplayInterval="5000" circular>
        <template #item="slotProps">
          <div class="carousel-item border-round m-2 text-center p-4">
            <img :src="slotProps.data.image" :alt="slotProps.data.name" class="w-full border-round" />
            <h3 class="mt-2">{{ slotProps.data.name }}</h3>
          </div>
        </template>
      </Carousel>
    </div>

    <h2 class="mb-3">Популярные анализы</h2>
    <div class="popular-section mb-5">
      <div class="scroll-container">
        <ProductCard v-for="analysis in popularAnalyses" :key="analysis.id" :product="analysis" />
      </div>
    </div>

    <h2 class="mb-3">Популярные исследования</h2>
    <div class="popular-section">
      <div class="scroll-container">
        <ProductCard v-for="study in popularStudies" :key="study.id" :product="study" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Carousel from 'primevue/carousel';
import ProductCard from '@/components/ProductCard.vue';

const products = ref([
    { name: 'Скидка 20% на чек-ап', image: 'https://picsum.photos/id/10/800/250' },
    { name: 'Анализы на витамины', image: 'https://picsum.photos/id/20/800/250' },
    { name: 'Комплексное обследование', image: 'https://picsum.photos/id/30/800/250' }
]);

const popularAnalyses = ref([
  { id: 1, name: 'Общий анализ крови', price: 800, image: 'https://picsum.photos/id/101/250/150' },
  { id: 2, name: 'Биохимия крови (базовая)', price: 1500, image: 'https://picsum.photos/id/102/250/150' },
  { id: 3, name: 'Анализ на глюкозу', price: 400, image: 'https://picsum.photos/id/103/250/150' },
  { id: 4, name: 'Анализ на гормоны ЩЖ', price: 2200, image: 'https://picsum.photos/id/104/250/150' },
  { id: 5, name: 'Витамин D, 25-OH', price: 1800, image: 'https://picsum.photos/id/105/250/150' },
]);

const popularStudies = ref([
  { id: 1, name: 'УЗИ органов брюшной полости', price: 2500, image: 'https://picsum.photos/id/201/250/150' },
  { id: 2, name: 'ЭКГ с расшифровкой', price: 1200, image: 'https://picsum.photos/id/202/250/150' },
  { id: 3, name: 'МРТ головного мозга', price: 5500, image: 'https://picsum.photos/id/203/250/150' },
  { id: 4, name: 'КТ легких', price: 4000, image: 'https://picsum.photos/id/204/250/150' },
]);
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
}
.carousel-item {
  background-color: var(--surface-card);
}
.scroll-container {
  display: flex;
  overflow-x: auto;
  padding-bottom: 1rem; /* для тени скроллбара */
}
/* Стилизация скроллбара для лучшего вида */
.scroll-container::-webkit-scrollbar {
  height: 8px;
}
.scroll-container::-webkit-scrollbar-track {
  background: var(--surface-b);
  border-radius: 4px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: var(--surface-d);
  border-radius: 4px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--surface-e);
}
</style>
