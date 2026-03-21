# Gemini Workspace Configuration: medstorm-portal

This document provides instructional context for the Gemini AI assistant to effectively interact with the `medstorm-portal` codebase.

## Project Overview

`medstorm-portal` is a web application built with Vue.js 3. Based on the file structure and dependencies, it appears to be a portal for a medical service, likely for managing patients, analyses, studies, and orders.

The project is bootstrapped with `vite` and uses a modern JavaScript ecosystem.

### Core Technologies

- **Framework:** [Vue.js 3](https://vuejs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **UI Framework:** [PrimeVue](https://primevue.org/) with the `Aura` theme and [PrimeFlex](https://primeflex.org/) for layout.
- **Routing:** [Vue Router](https://router.vuejs.org/) manages navigation.
- **HTTP Client:** [Axios](https://axios-http.com/) is used for making API requests to backend services.
- **Language:** JavaScript

### Architecture

- **`src/main.js`**: The application entry point. It initializes Vue, PrimeVue, and the Vue Router.
- **`src/App.vue`**: The root Vue component.
- **`src/router/index.js`**: Defines the application's routes. Key routes include `/login`, `/register`, `/dashboard`, `/patients`, `/analyzes`, etc.
- **`src/views/*.vue`**: Components that represent the main pages of the application.
- **`src/components/*.vue`**: Reusable UI components used across different views.
- **`src/services/*.js`**: Modules responsible for encapsulating business logic and API communication. `api.js` likely contains the base Axios instance and configuration, while other files (`AuthService.js`, `PatientService.js`) use it to interact with specific backend endpoints.
- **`src/assets`**: Contains static assets like CSS and images.

## Building and Running

The project uses `npm` as the package manager. The following scripts are defined in `package.json`:

-   **Install dependencies:**
    ```bash
    npm install
    ```
-   **Run development server:** Starts a hot-reloading development server.
    ```bash
    npm run dev
    ```
-   **Build for production:** Compiles and minifies the application for production deployment into the `dist` directory.
    ```bash
    npm run build
    ```
-   **Preview production build:** Serves the production build locally to test it before deployment.
    ```bash
    npm run preview
    ```

## Development Conventions

- **Path Aliases:** The alias `@` is configured to point to the `src/` directory for cleaner import paths.
- **API Services:** API calls should be managed within the `src/services` directory. When adding new functionality that requires backend communication, a new service module should be created or an existing one updated.
- **Component-Based:** Follow Vue's component-based architecture. Create reusable components in `src/components` and page-level components in `src/views`.
- **Styling:** Global styles are in `src/assets/main.css`. Component-specific styles should be co-located within the `.vue` files using `<style scoped>` blocks. Leverage the PrimeFlex utility classes for layout and spacing where possible.
