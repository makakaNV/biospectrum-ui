<template>
  <div class="policy-page">
    <div v-if="loading" class="flex justify-content-center py-8">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--primary-color);"></i>
    </div>
    <div v-else class="policy-content prose" v-html="html"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { marked } from 'marked';

const html = ref('');
const loading = ref(true);

onMounted(async () => {
  const res = await fetch('/privacy-policy.md');
  const text = await res.text();
  html.value = marked(text);
  loading.value = false;
});
</script>

<style scoped>
.policy-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0 4rem;
}
</style>

<style>
.prose h2 { font-size: 1.4rem; font-weight: 800; margin: 2rem 0 0.75rem; }
.prose h3 { font-size: 1.1rem; font-weight: 700; margin: 1.5rem 0 0.5rem; }
.prose p  { font-size: 0.95rem; line-height: 1.75; color: var(--text-color-secondary); margin: 0 0 0.75rem; }
.prose ul, .prose ol { padding-left: 1.4rem; margin: 0 0 0.75rem; }
.prose li { font-size: 0.95rem; line-height: 1.75; color: var(--text-color-secondary); margin-bottom: 0.3rem; }
.prose strong { color: var(--text-color); }
.prose a { color: #22c55e; }
</style>
