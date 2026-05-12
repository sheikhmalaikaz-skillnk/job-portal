import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "YOUR_DSN",
  //tracesSampleRate: 1.0,
  sendDefaultPii: true,

  integrations: [
    Sentry.mongoIntegration(), // MongoDB / Mongoose tracing support
  ],
});