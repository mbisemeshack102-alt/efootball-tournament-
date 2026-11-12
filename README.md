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
- Payments, text chat and APK packaging are not included yet.
- Do not commit secret keys. If a service-role/secret key was previously shared, rotate it in Supabase.

## Android
Once deployed over HTTPS, open the site in Chrome on Android and use **Add to Home screen**. The service worker is registered automatically on HTTPS for the installable PWA shell. A signed production APK requires a separate Android packaging/build and signing step; this repository does not yet contain a signed APK.


## Background push notifications (when the app is closed)
This feature needs Web Push keys and one-time Supabase setup; it is not active merely by deploying the static site.

1. Generate a VAPID key pair using `npx web-push generate-vapid-keys`. Keep the **private** key secret.
2. In Supabase Edge Function secrets, set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (for example `mailto:your-admin-email@example.com`), and `KWG_WEBHOOK_SECRET` (a long random secret).
3. Put the same **public** VAPID key in `PUSH_VAPID_PUBLIC_KEY` in `index.html`. Never put the private key or Supabase service-role key in browser code.
4. Deploy the Edge Function: `supabase functions deploy push-notifications`.
5. Configure two Supabase Database Webhooks (POST) targeting `https://YOUR_PROJECT_REF.supabase.co/functions/v1/push-notifications`: one for INSERT on `public.tournaments`, and one for INSERT on `public.tournament_results`. Add header `x-kwg-webhook-secret: YOUR_KWG_WEBHOOK_SECRET` to both.
6. Deploy the site over HTTPS. Each player opens Settings and taps **Enable background push** on each device, then accepts the browser permission prompt.

Push notifications can arrive while the app is closed, subject to Android/browser notification and battery settings. Real-device testing is still required.


## Required live checks before public launch
- Run the complete `supabase/schema.sql` in the Supabase SQL Editor; the browser app cannot create these tables automatically.
- Confirm a new email can receive and verify the six-digit OTP, then test login and logout.
- Promote the intended owner account to `admin` with the SQL above; do not expose service-role credentials.
- Test tournament creation/joining, results, gifts and gift claims with separate admin and player accounts.
- Test voice chat with at least two phones/accounts on different networks. The current WebRTC setup uses public STUN only; a TURN relay is recommended for reliable mobile-network connectivity.
- Background push notifications remain optional and require VAPID keys plus the documented Edge Function and database webhooks.
