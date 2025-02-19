import { HoneycombSDK } from '@honeycombio/opentelemetry-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

export const honeycombTracing = () => {
  // uses the HONEYCOMB_API_KEY and OTEL_SERVICE_NAME environment variables

  const sdk = new HoneycombSDK({
    instrumentations: [
      getNodeAutoInstrumentations({
        // we recommend disabling fs autoinstrumentation since it can be noisy
        // and expensive during startup
        '@opentelemetry/instrumentation-fs': {
          enabled: false,
        },
      }),
    ],
  });

  sdk.start();
};
