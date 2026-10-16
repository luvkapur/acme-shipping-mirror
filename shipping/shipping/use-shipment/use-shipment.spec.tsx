import { renderHook, waitFor } from '@testing-library/react';
import { createHttpClient, createMockTransport } from '@acme-modular/platform.utils.http-client';
import { plainMockShipments } from '@acme-modular/shipping.shipping.shipment';
import { useShipment } from './use-shipment.js';

// zero latency keeps the tests fast.
const client = createHttpClient({
  baseUrl: 'http://mock.local',
  transport: createMockTransport({ 'GET /shipments': () => plainMockShipments }, { latencyMs: 0 }),
});

it('loads the shipment of an order as a Shipment instance', async () => {
  const { result } = renderHook(() => useShipment('o-1003', { client }));
  expect(result.current.loading).toBe(true);
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.data?.id).toBe('s-2003');
  expect(result.current.data?.status).toBe('in-transit');
});

it('follows a change of order', async () => {
  const { result, rerender } = renderHook(({ orderId }) => useShipment(orderId, { client }), {
    initialProps: { orderId: 'o-1003' },
  });
  await waitFor(() => expect(result.current.data?.orderId).toBe('o-1003'));
  rerender({ orderId: 'o-1002' });
  await waitFor(() => expect(result.current.data?.delivered).toBe(true));
});

it('resolves undefined for an order that has not shipped', async () => {
  const { result } = renderHook(() => useShipment('o-1001', { client }));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.data).toBeUndefined();
  expect(result.current.error).toBeUndefined();
});

it('surfaces API errors', async () => {
  const offline = createHttpClient({ baseUrl: 'http://mock.local', transport: createMockTransport({}, { latencyMs: 0 }) });
  const { result } = renderHook(() => useShipment('o-1003', { client: offline }));
  await waitFor(() => expect(result.current.error).toBeTruthy());
});
