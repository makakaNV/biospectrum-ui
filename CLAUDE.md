# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server with hot-reload (Vite)
npm run build     # Build for production (output to dist/)
npm run preview   # Serve production build locally
```

No test or lint scripts are configured.

## Architecture

**MedStorm Portal** is a Vue.js 3 SPA for managing medical analyses, studies, and patients. It connects to a backend at `https://medstorm-api.ru` using cookie-based auth.

**Stack:** Vue 3 (Composition API + `<script setup>`) · Vite · PrimeVue 4 (Aura theme) · PrimeFlex · Vue Router · Axios

### Structure

- `src/main.js` — entry point; initializes Vue, PrimeVue (Aura theme), and router
- `src/App.vue` — root component; checks auth on mount/route change via `AuthService.getMe()`
- `src/router/index.js` — client-side routes (no auth guards yet)
- `src/views/` — page-level components (Dashboard, Login, Register, Patients, Analyzes, etc.)
- `src/components/` — reusable components (AppHeader, PatientCard, AnalysisCard, ProductCard)
- `src/services/` — API layer; all backend calls go here
  - `api.js` — Axios instance with `baseURL: 'https://medstorm-api.ru'` and `withCredentials: true`
  - `AuthService.js` — login, register, getMe, logout
  - `PatientService.js` — paginated patient listing
  - `AnalysisService.js` — paginated analysis listing

### Conventions

- Path alias `@` → `src/` (configured in `vite.config.js` and `jsconfig.json`)
- New API endpoints → add to existing service or create a new file in `src/services/`
- New reusable UI → `src/components/`; new pages → `src/views/`
- Scoped styles in `.vue` files; PrimeFlex utilities for layout/spacing
- API responses follow shape: `{ payload: { content: [...], pagination: { page, pages } } }`
- No centralized state management — components manage local state with `ref`/`reactive`

### Authentication & Token Flow

Бэкенд (`https://medstorm-api.ru`) устанавливает JWT как `httpOnly` cookie с именем `Authorization` (`SameSite=Lax`, `secure=false`). Из-за cross-origin между `localhost:5173` и `medstorm-api.ru` браузер **не отправляет** эту cookie в XHR-запросах автоматически.

**Решение — токен хранится в `localStorage` и отправляется через заголовок:**

1. После логина токен извлекается из `response.data.payload.token` и сохраняется: `localStorage.setItem('authToken', token)`
2. В `src/services/api.js` настроен request-интерцептор, который добавляет `Authorization: Bearer <token>` к каждому запросу
3. Gateway валидирует токен из заголовка `Authorization` (должен начинаться с `Bearer ` и содержать точку)
4. При выходе токен удаляется: `localStorage.removeItem('authToken')`

**Не использовать Vite proxy** как замену — это ломает работу при активном VPN у разработчика.

### Known Gaps

- No route auth guards (commented "will add later")
- No global Axios 401 interceptor (only per-component redirect in `Patients.vue`)
- Orders, Profile, Studies views are stubs
- Dashboard uses mock data instead of API calls

## AI Assistance Guide
- *Разработка ведется на OC Windows*
- *Ты должен общаться на русском языке*