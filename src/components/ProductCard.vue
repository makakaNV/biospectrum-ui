<template>
  <div class="product-card">
    <Card>
      <template #header>
        <img :src="product.image" alt="product image" class="product-image"/>
      </template>
      <template #title>
        <div class="product-name">{{ product.name }}</div>
      </template>
      <template #subtitle>
        <div class="product-price">{{ formatCurrency(product.price) }}</div>
      </template>
      <template #footer>
        <Button icon="pi pi-shopping-cart" label="В корзину" class="w-full"></Button>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';

defineProps({
  product: {
    type: Object,
    required: true
  }
});

const formatCurrency = (value) => {
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
};
</script>

<style scoped>
.product-card {
  min-width: 250px; /* Задаем минимальную ширину карточки */
  margin-right: 1rem;
}
.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.product-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
}
</style>
