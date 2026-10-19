import { render, screen } from '@testing-library/react';
import { Shipment, mockShipments, plainMockShipments } from '@acme-modular/shipping.shipping.shipment';
import { TrackingTimeline } from './tracking-timeline.js';

it('lists every scan oldest first', () => {
  render(<TrackingTimeline shipment={mockShipments()[0]} />);
  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(4);
  expect(items[0].textContent).toContain('Label created');
  expect(items[3].textContent).toContain('Dallas, TX');
});

it('highlights the latest scan as the current step', () => {
  const plain = plainMockShipments[1];
  // the carrier reported the scans newest first; the timeline still ends on delivery.
  render(<TrackingTimeline shipment={Shipment.from({ ...plain, events: [...plain.events].reverse() })} />);
  const items = screen.getAllByRole('listitem');
  const current = items.filter((item) => item.getAttribute('aria-current') === 'step');
  expect(current).toHaveLength(1);
  expect(current[0]).toBe(items[items.length - 1]);
  expect(current[0].textContent).toContain('Delivered');
});

it('shows the estimated delivery until the parcel arrives', () => {
  const { rerender } = render(<TrackingTimeline shipment={mockShipments()[0]} />);
  expect(screen.getByText('Estimated delivery Sat, Oct 17')).toBeTruthy();
  rerender(<TrackingTimeline shipment={mockShipments()[1]} />);
  expect(screen.queryByText(/Estimated delivery/)).toBeNull();
});
