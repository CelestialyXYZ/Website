import "./assets/main.css"

import { createApp } from "vue"
import { createPinia } from "pinia"

//import of error report service and analytics service
import * as Sentry from "@sentry/vue"

import "viewerjs/dist/viewer.css"
import VueViewer from "v-viewer"

import App from "./App.vue"
import router from "./router"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueViewer as any)

Sentry.init({
  app,
  environment: import.meta.env.MODE,
  dsn: "https://694ba9b538ce785f71f7eec0f0e782c2@o4507628037865472.ingest.de.sentry.io/4507628048285776",
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  // Enable error monitoring on production only
  enabled: import.meta.env.MODE === "production"
})

app.mount("#app")
