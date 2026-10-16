import type { PlainShipment } from './shipment.js';
import { Shipment } from './shipment.js';

/** demo shipments for the demo orders: o-1003 is in transit, o-1002 was delivered. */
export const plainMockShipments: PlainShipment[] = [
  {
    id: 's-2003',
    orderId: 'o-1003',
    carrier: 'UPS',
    trackingNumber: '1Z 999 AA1 01 2345 6784',
    estimatedDelivery: '2026-10-17T20:00:00.000Z',
    events: [
      { status: 'label-created', at: '2026-10-12T16:10:00.000Z', location: 'Reno, NV' },
      { status: 'picked-up', at: '2026-10-13T14:45:00.000Z', location: 'Reno, NV' },
      { status: 'in-transit', at: '2026-10-14T03:20:00.000Z', location: 'Salt Lake City, UT' },
      { status: 'in-transit', at: '2026-10-15T22:05:00.000Z', location: 'Dallas, TX' },
    ],
  },
  {
    id: 's-2002',
    orderId: 'o-1002',
    carrier: 'FedEx',
    trackingNumber: '7712 3456 7890',
    estimatedDelivery: '2026-10-01T20:00:00.000Z',
    events: [
      { status: 'label-created', at: '2026-09-28T18:30:00.000Z', location: 'Reno, NV' },
      { status: 'picked-up', at: '2026-09-29T15:00:00.000Z', location: 'Reno, NV' },
      { status: 'in-transit', at: '2026-09-30T09:40:00.000Z', location: 'Memphis, TN' },
      { status: 'out-for-delivery', at: '2026-10-01T13:15:00.000Z', location: 'Austin, TX' },
      { status: 'delivered', at: '2026-10-01T18:52:00.000Z', location: 'Austin, TX' },
    ],
  },
];

/** the demo shipments as `Shipment` instances. */
export function mockShipments(): Shipment[] {
  return plainMockShipments.map((plain) => Shipment.from(plain));
}
