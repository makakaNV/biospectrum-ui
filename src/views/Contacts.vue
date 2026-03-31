<template>
  <div class="contacts-page">

    <div class="contacts-header">
      <h1 class="contacts-title">Адреса и контакты</h1>
    </div>

    <!-- Карта -->
    <div class="map-wrapper">
      <iframe
        src="https://yandex.ru/map-widget/v1/?ll=76.5715%2C60.9440&z=13&l=map&pt=76.590298%2C60.941276%2Cpm2rdl1~76.552695%2C60.946629%2Cpm2rdl2"
        width="100%"
        height="460"
        frameborder="0"
        allowfullscreen
        title="Офисы Биоспектрум на карте"
      ></iframe>
    </div>

    <!-- Офисы -->
    <div class="offices-grid">

      <!-- Офис 1 -->
      <div class="office-card">
        <div class="office-number">Офис 1</div>
        <h2 class="office-name">Дзержинского, 11</h2>

        <div class="office-info-list">
          <div class="office-info-row">
            <i class="pi pi-map-marker info-icon"></i>
            <div class="info-value">ул. Дзержинского, 11</div>
          </div>

          <div class="office-info-row">
            <i class="pi pi-clock info-icon"></i>
            <div class="info-hours">
              <span class="info-value">8:00 – 20:00</span>
              <span class="info-daily">ежедневно</span>
            </div>
          </div>

          <div class="office-info-row">
            <i class="pi pi-phone info-icon"></i>
            <div class="phones-inline">
              <span class="phone-inline-item">Общий: <a href="tel:+73466291345" class="info-link">+7 (3466) 29‒13‒45</a></span>
              <span class="phone-inline-item">Офис: <a href="tel:+73466291346" class="info-link">+7 (3466) 29‒13‒46</a></span>
            </div>
          </div>
        </div>

        <a
          href="https://yandex.ru/maps/?text=Нижневартовск%2C+улица+Дзержинского%2C+11"
          target="_blank"
          rel="noopener"
          class="route-btn"
        >
          <i class="pi pi-directions"></i>
          Построить маршрут
        </a>
      </div>

      <!-- Офис 2 -->
      <div class="office-card">
        <div class="office-number">Офис 2</div>
        <h2 class="office-name">Мира, 3Б</h2>

        <div class="office-info-list">
          <div class="office-info-row">
            <i class="pi pi-map-marker info-icon"></i>
            <div class="info-value">ул. Мира, 3Б</div>
          </div>

          <div class="office-info-row">
            <i class="pi pi-clock info-icon"></i>
            <div class="info-hours">
              <span class="info-value">9:00 – 19:00</span>
              <span class="info-daily">ежедневно</span>
            </div>
          </div>

          <div class="office-info-row">
            <i class="pi pi-phone info-icon"></i>
            <div class="phones-inline">
              <span class="phone-inline-item">Общий: <a href="tel:+73466291345" class="info-link">+7 (3466) 29‒13‒45</a></span>
              <span class="phone-inline-item">Офис: <a href="tel:+73466291347" class="info-link">+7 (3466) 29‒13‒47</a></span>
            </div>
          </div>
        </div>

        <a
          href="https://yandex.ru/maps/?text=Нижневартовск%2C+улица+Мира%2C+3Б"
          target="_blank"
          rel="noopener"
          class="route-btn"
        >
          <i class="pi pi-directions"></i>
          Построить маршрут
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.contacts-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 0 3rem;
}

.contacts-header {
  margin-bottom: 2rem;
}

.contacts-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* ── Карта ── */
.map-wrapper {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 12px rgba(30, 64, 175, 0.06);
  margin-bottom: 2rem;
  line-height: 0;
}

.map-wrapper iframe {
  display: block;
  width: 100%;
}

/* ── Сетка офисов ── */
.offices-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* ── Карточка офиса ── */
.office-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.75rem;
  box-shadow: 0 2px 12px rgba(30, 64, 175, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.office-number {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  width: fit-content;
}

.office-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.office-info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.office-info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
}

.info-icon {
  font-size: 1rem;
  color: #2563eb;
  margin-top: 2px;
  flex-shrink: 0;
  width: 18px;
  text-align: center;
}

.info-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
}

.info-hours {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.info-daily {
  font-size: 0.8rem;
  color: #64748b;
}

.phones-inline {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.phone-inline-item {
  font-size: 0.875rem;
  color: #64748b;
}

.info-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  white-space: nowrap;
}

.info-link:hover {
  text-decoration: underline;
}

.route-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
  padding: 0.625rem 1.25rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  width: fit-content;
  transition: background 0.15s, border-color 0.15s;
}

.route-btn:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}
</style>
