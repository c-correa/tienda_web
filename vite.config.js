import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        register: 'register.html',
        dashboard_student: 'dashboard-student.html',
        dashboard_admin: 'dashboard-admin.html'
      }
    }
  }
});
