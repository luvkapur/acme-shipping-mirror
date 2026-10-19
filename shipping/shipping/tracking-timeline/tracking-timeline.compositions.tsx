import { AcmeTheme } from '@acme-modular/design.theme.acme-theme';
import { Shipment, mockShipments, plainMockShipments } from '@acme-modular/shipping.shipping.shipment';
import { TrackingTimeline } from './tracking-timeline.js';

export const InTransit = () => (
  <AcmeTheme>
    <TrackingTimeline shipment={mockShipments()[0]} />
  </AcmeTheme>
);

export const Delivered = () => (
  <AcmeTheme>
    <TrackingTimeline shipment={mockShipments()[1]} />
  </AcmeTheme>
);

export const DeliveryException = () => (
  <AcmeTheme>
    <TrackingTimeline
      shipment={Shipment.from({
        ...plainMockShipments[0],
        events: [
          ...plainMockShipments[0].events,
          { status: 'exception', at: '2026-10-16T08:30:00.000Z', location: 'Austin, TX' },
        ],
      })}
    />
  </AcmeTheme>
);
