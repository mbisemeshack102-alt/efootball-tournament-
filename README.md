# KICKOFF WINS GIFTS

Gaming tournament web app for Free Fire, PUBG Mobile, Call of Duty Mobile, eFootball and more.

## Included
- Email sign-up, sign-in and email confirmation through Supabase Auth.
- Player dashboard and authenticated player directory.
- Admin dashboard for creating tournaments and managing gift inventory / delivery claims.
- Tournament registration with duplicate-registration protection.
- Gift dashboard: admins add gifts and mark player claims delivered; players submit one claim per gift.
- Live voice chat rooms by game/team using WebRTC and Supabase Realtime signaling; mute and leave controls.
- Kiswahili / English language selector saved on the device.
- Supabase Row Level Security (RLS) policies.

## Setup
1. Create/open your Supabase project.
2. In Supabase SQL Editor, run all SQL from `supabase/schema.sql` (including the gift dashboard tables and RLS policies).
3. The current branch already has the project's Supabase URL and publishable key configured. If the project is ever changed, update these values in `index.html` using the **publishable** key only. Never put a Supabase secret/service-role key in browser code or GitHub.
4. In Supabase **Authentication → URL Configuration**, set the deployed site URL and add it to the allowed redirect URLs. Enable email confirmations.
5. For a six-digit email verification code, open **Authentication → Email Templates → Confirm signup** and make sure the template includes `{{ .Token }}` (not only a confirmation-link URL). Save the template and verify that your email provider can send messages.
6. Register your own account in the app and verify the six-digit code sent to your email. Then run this SQL in Supabase SQL Editor, replacing the email:
   ```sql
   update public.profiles p set role = 'admin'
   from auth.users u
   where p.id = u.id and u.email = 'YOUR_ADMIN_EMAIL';
   ```
7. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. The workflow in `.github/workflows/deploy-pages.yml` deploys this branch automatically after each push. The expected site address is `https://mbisemeshack102-alt.github.io/efootball-tournament-/` once the first deployment succeeds. Use HTTPS.

## Important
- New registrations are always assigned the `player` role. Users cannot promote themselves to admin through the app.
- The Admin tab is hidden for players, and Supabase RLS independently blocks non-admin tournament creation/management.
- Live voice chat requires HTTPS, microphone permission, Supabase Realtime enabled, and a network that permits WebRTC. This first implementation uses a public STUN server only; reliable production voice across restrictive mobile networks needs a TURN service and real multi-device testing.
- Gift delivery is an admin-recorded status, not an automatic payment or game-currency transfer.
- ClickPesa BillPay payment submission is included for tournament entry fees. Set a fee when creating a tournament; players pay using Merchant Control Number 4078 and submit the ClickPesa transaction reference. An admin must verify the reference in the ClickPesa dashboard before the player is registered. Run `supabase/payments-clickpesa.sql` once in Supabase SQL Editor. This is manual verification, not an automatic ClickPesa API checkout/webhook; API access for the Kem merchant account was previously blocked pending KYC. Do not mark a payment paid unless it is confirmed in ClickPesa.
- Text chat and APK packaging are not included yet.
- Do not commit secret keys. If a service-role/secret key was previously shared, rotate it in Supabase.

## Android
Once deployed over HTTPS, open the site in Chrome on Android and use **Add to Home screen**. The service worker is registered automatically on HTTPS for the installable PWA shell. A signed production APK requires a separate Android packaging/build and signing step; this repository does not yet contain a signed APK.


## Notifications

### Player notifications
- The app now includes **Washa notification / Zima notification** controls in Settings.
- Players must sign in, open the app over HTTPS in Chrome on Android, enable notifications, and accept the Android permission prompt on each device.
- Admins can send a notification to all subscribed devices from **Admin → Tuma notification kwa wachezaji**.

### Background push (works when the app is closed)
1. Run `supabase/push-notifications.sql` once in Supabase SQL Editor. This creates the private `push_subscriptions` table.
2. In Supabase **Edge Functions → Secrets**, set:
   - `VAPID_PUBLIC_KEY` to the public key below.
   - `VAPID_PRIVATE_KEY` to the private key generated for this project (never put it in GitHub or browser code).
   - `VAPID_SUBJECT` to a contact such as `mailto:YOUR_ADMIN_EMAIL`.
   - `KWG_WEBHOOK_SECRET` to a long random secret if database webhooks will be used.
   - Ensure the standard `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` function secrets are present.
3. The public VAPID key is already configured in `index.html`. Do not change it unless you generate a matching new key pair.
4. Deploy the updated Edge Function code from `supabase/functions/push-notifications/index.ts` using Supabase **Edge Functions → push-notifications → Deploy** (or the Supabase CLI).
5. Deploy the GitHub Pages site over HTTPS. Each player signs in and enables notifications in Settings.
6. Optional automatic alerts for new tournament/result database rows require Supabase Database Webhooks (POST) to the function URL with header `x-kwg-webhook-secret` set to the same `KWG_WEBHOOK_SECRET`. Configure one INSERT webhook for `public.tournaments` and one for `public.tournament_results`.

The Admin broadcast action is protected by a server-side check of the user's `profiles.role = 'admin'`. The Edge Function uses the service-role key only on the server. Test on real Android devices; browser permission, HTTPS, battery restrictions, and device settings affect delivery.
 
## Required live checks before public launch
- Run the complete `supabase/schema.sql` in the Supabase SQL Editor; the browser app cannot create these tables automatically.
- Confirm a new email can receive and verify the six-digit OTP, then test login and logout.
- Promote the intended owner account to `admin` with the SQL above; do not expose service-role credentials.
- Test tournament creation/joining, results, gifts and gift claims with separate admin and player accounts.
- Test voice chat with at least two phones/accounts on different networks. The current WebRTC setup uses public STUN only; a TURN relay is recommended for reliable mobile-network connectivity.
- Background push notifications remain optional and require VAPID keys plus the documented Edge Function and database webhooks.
