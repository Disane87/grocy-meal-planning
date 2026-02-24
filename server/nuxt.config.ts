export default defineNuxtConfig({
  devtools: { enabled: false },

  // No pages/components needed — this is an API-only server
  components: false,
  pages: false,

  nitro: {
    preset: 'node-server',
  },

  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    },
  },
});
