// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vee-validate/nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "shadcn-nuxt"
  ],
  plugins: [
    '~/plugins/theme.client.ts'
  ],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiBaseUrl: process.env.API_BASE_URL,
    authLoginEndpoint: process.env.AUTH_LOGIN_ENDPOINT,
    authRegisterEndpoint: process.env.AUTH_REGISTER_ENDPOINT,
    authForgotPasswordEndpoint: process.env.AUTH_FORGOT_PASSWORD_ENDPOINT,
    employeesGetAllEndpoint: process.env.EMPLOYEES_GET_ALL_ENDPOINT,
    employeesCreateEndpoint: process.env.EMPLOYEES_CREATE_ENDPOINT,
    employeesUpdateEndpoint: process.env.EMPLOYEES_UPDATE_ENDPOINT,
    employeesDeleteEndpoint: process.env.EMPLOYEES_DELETE_ENDPOINT,
    nomineesGetAllEndpoint: process.env.NOMINEES_GET_ALL_ENDPOINT,
    nomineesCreateEndpoint: process.env.NOMINEES_CREATE_ENDPOINT,
    nomineesUpdateEndpoint: process.env.NOMINEES_UPDATE_ENDPOINT,
    nomineesDeleteEndpoint: process.env.NOMINEES_DELETE_ENDPOINT,
    scoresGetAllEndpoint: process.env.SCORES_GET_ALL_ENDPOINT,
    scoresCreateEndpoint: process.env.SCORES_CREATE_ENDPOINT,
    scoresUpdateEndpoint: process.env.SCORES_UPDATE_ENDPOINT,
    scoresDeleteEndpoint: process.env.SCORES_DELETE_ENDPOINT,
    usersGetAllEndpoint: process.env.USERS_GET_ALL_ENDPOINT,
    usersCreateEndpoint: process.env.USERS_CREATE_ENDPOINT,
    usersUpdateEndpoint: process.env.USERS_UPDATE_ENDPOINT,
    usersDeleteEndpoint: process.env.USERS_DELETE_ENDPOINT,
    // Public keys (exposed to client-side)
    public: {
      apiBaseUrl: process.env.API_BASE_URL
    }
  },
  css: ["~/assets/css/tailwind.css"],
  image: {
    provider: "ipx",
    ipx: {},
  },
  typescript: {
    strict: false,
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  // colorMode: {
  //   classSuffix: "",
  //   preference: "light", // Default mode
  //   fallback: "light",
  //   storageKey: "theme", // Ensure it matches with your darkModeStore
  // },
  colorMode: {
    classSuffix: '',
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    storageKey: 'nuxt-color-mode'
  }
});