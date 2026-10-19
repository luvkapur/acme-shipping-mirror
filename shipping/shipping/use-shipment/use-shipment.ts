import { useFetch } from '@acme-modular/platform.hooks.use-fetch';
import type { FetchState } from '@acme-modular/platform.hooks.use-fetch';
import { createHttpClient, createMockTransport } from '@acme-modular/platform.utils.http-client';
import type { HttpClient } from '@acme-modular/platform.utils.http-client';
import { Shipment, plainMockShipments } from '@acme-modular/shipping.shipping.shipment';
import type { PlainShipment } from '@acme-modular/shipping.shipping.shipment';

// previews and the demo app run without a backend. the base URL only gives
// `Request` an absolute URL; the mock transport never leaves the process.
const mockClient = createHttpClient({
  baseUrl: 'http://mock.local',
  transport: createMockTransport({ 'GET /shipments': () => plainMockShipments }, { latencyMs: 300 }),
});

export type UseShipmentOptions = {
  /** the API client. defaults to an in-memory mock of the demo shipments. keep it stable across renders. */
  client?: HttpClient;
};

/**
 * Loads the shipment for an order. `data` is `undefined` once loading
 * finishes if the order has not shipped yet.
 *
 * The shipments API has no per-order route, so the hook filters by `orderId`
 * on the client.
 *
 * @example
 * const { data: shipment, loading } = useShipment('o-1003');
 */
export function useShipment(orderId: string, { client = mockClient }: UseShipmentOptions = {}): FetchState<Shipment | undefined> {
  return useFetch(async () => {
    const plain = await client.get<PlainShipment[]>('/shipments');
    const match = plain.find((shipment) => shipment.orderId === orderId);
    return match ? Shipment.from(match) : undefined;
  }, [orderId, client]);
}
