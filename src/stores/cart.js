import { reactive, computed } from 'vue';

const state = reactive({ items: [] });

export function useCart() {
  const addItem = (item, type) => {
    if (!state.items.find(i => i.id === item.id && i.type === type)) {
      state.items.push({ ...item, type });
    }
  };

  const removeItem = (id, type) => {
    const idx = state.items.findIndex(i => i.id === id && i.type === type);
    if (idx !== -1) state.items.splice(idx, 1);
  };

  const clearCart = () => { state.items.splice(0); };

  const isInCart = (id, type) => state.items.some(i => i.id === id && i.type === type);

  const count = computed(() => state.items.length);

  const itemPrice = (item) => {
    if (item.type === 'panel' && item.discountPercent > 0) {
      return item.price * (1 - item.discountPercent / 100);
    }
    return item.price || 0;
  };

  const total = computed(() =>
    state.items.reduce((sum, item) => sum + itemPrice(item), 0)
  );

  const totalDiscount = computed(() =>
    state.items.reduce((sum, item) => {
      if (item.type === 'panel' && item.discountPercent > 0) {
        return sum + item.price * (item.discountPercent / 100);
      }
      return sum;
    }, 0)
  );

  const toggleItem = (item, type) => {
    isInCart(item.id, type) ? removeItem(item.id, type) : addItem(item, type);
  };

  return { items: state.items, count, total, totalDiscount, addItem, removeItem, clearCart, isInCart, itemPrice, toggleItem };
}
