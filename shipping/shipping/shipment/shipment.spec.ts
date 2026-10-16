import { Shipment } from './shipment.js';
import { mockShipments, plainMockShipments } from './shipment.mock.js';

it('takes its status from the latest scan', () => {
  const [inTransit, delivered] = mockShipments();
  expect(inTransit.orderId).toBe('o-1003');
  expect(inTransit.status).toBe('in-transit');
  expect(inTransit.delivered).toBe(false);
  expect(delivered.status).toBe('delivered');
  expect(delivered.delivered).toBe(true);
});

it('orders scans by time even when the carrier reports them out of order', () => {
  const plain = plainMockShipments[1];
  const shuffled = Shipment.from({ ...plain, events: [...plain.events].reverse() });
  expect(shuffled.status).toBe('delivered');
  expect(shuffled.timeline.map((event) => event.status)).toEqual(plain.events.map((event) => event.status));
});

it('counts a shipment without scans as label created', () => {
  expect(Shipment.from({ ...plainMockShipments[0], events: [] }).status).toBe('label-created');
});

it('round-trips through a plain object', () => {
  expect(Shipment.from(plainMockShipments[0]).toObject()).toEqual(plainMockShipments[0]);
});
