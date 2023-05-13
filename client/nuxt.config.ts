// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify', '@apollo/client'],
    },
    vite: {
        define: {
            'process.env.DEBUG': false,
        },
    },
    modules: [
        '@pinia/nuxt',
    ],
    pinia: {
        autoImports: [
            'defineStore',
        ],
    },
    imports: {
        dirs: ['stores'],
    }
})
