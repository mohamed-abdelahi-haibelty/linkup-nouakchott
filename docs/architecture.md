# Architecture

Routes compose feature modules. Server actions authenticate the caller and delegate multi-step workflows to server-only services. Browser utilities never import Prisma, database credentials, or delivery services.

## Free registration

The registration service locks the event row, verifies approval, deadlines, capacity, duplicate registration, and organizer identity, and creates the participant and ticket in one serializable transaction. Serialization conflicts are retried up to three attempts. Rejected, cancelled, deleted, and demo events cannot issue tickets. Unregistering removes the ticket and participant together and cannot undo an already-used ticket.

QR images are generated locally. Email embeds the image as an attachment; ticket codes are not sent to a third-party QR image service. Email delivery happens after the database commit and cannot turn a successful registration into a failed response.

## Check-in and privacy

Both scanner entry points use one check-in service. It verifies the event, organizer, and time window, then atomically changes only an active ticket to used. Attendance is updated in the same transaction. Concurrent scans cannot both claim the same ticket.

Public attendee projections include ID, name, and avatar only. Organizer-only participant lists retain the contact information needed to manage their own events. Pending community posts are not exposed through the public detail query. Post-login redirects must remain on the configured application origin.

## Client state

Table cells that use Hooks are named components. Event lists use real request state rather than a simulated search delay. Media queries and carousel navigation subscribe to external state with `useSyncExternalStore`. Shared components retain typed row data; the table's heterogeneous column value types are contained at its library boundary.

## Persistence and operations

Existing migrations are preserved. Price and legacy registration-status fields are retained for database compatibility, while application workflows always create free events and confirmed registrations. No production schema change is needed for this refactor. Prisma configuration uses the version 7 configuration file and the existing Neon adapter.

The service worker caches static assets and an offline fallback only. It does not cache authenticated HTML, API responses, or React Server Component data. It retains push notifications and same-origin navigation from notifications without the old Workbox build plugins.

The regression suite checks domain behavior with mocked persistence. It does not claim to replace concurrent integration tests against PostgreSQL, authenticated browser tests, real camera scanning, or email/push delivery tests. Verify those in a configured staging environment before deploying the refactor. Bundled fonts and media retain their existing provenance; confirm redistribution rights before making source public.
