# KICKOFF WINS GIFTS

Gaming tournament web app for Free Fire, PUBG Mobile, Call of Duty Mobile, eFootball and more.

## Included
- Email/password sign-up and sign-in, six-digit signup OTP verification, passwordless email-code login, password recovery, and Google OAuth sign-in through Supabase Auth.
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
5. For six-digit signup verification, open **Authentication → Email Templates → Confirm signup** and include `{{ .Token }}` in the message body. For passwordless email-code login, open **Authentication → Email Templates → Magic Link** and include `{{ .Token }}`. The app verifies signup codes with `type: "signup"` and login codes with `type: "email"`.
6. Configure a **custom SMTP provider** under **Authentication → Settings → SMTP** (for example Resend, Brevo, Postmark, or SendGrid). The built-in Supabase mailer is restricted to project-team addresses and very low send limits; it is not suitable for public users. Never commit SMTP credentials to GitHub.
7. For password recovery, keep **Authentication → Email Templates → Reset Password** with a working `{{ .ConfirmationURL }}` link. Set the Supabase Site URL and allowed redirect list to the deployed app URL: `https://mbisemeshack102-alt.github.io/efootball-tournament-/`.
8. To enable Google sign-in, open **Authentication → Sign In / Providers → Google** and enable it with a Google OAuth Client ID and Client Secret created in Google Cloud Console. Add this exact authorized redirect URI in Google Cloud: `https://mljecunjrfgicasyhwac.supabase.co/auth/v1/callback`. Also ensure the app URL above is in Supabase's allowed redirect URLs. Google sign-in will not work until these credentials are supplied in the Supabase dashboard.
9. Register your own account in the app and verify the six-digit code sent to your email. Then run this SQL in Supabase SQL Editor, replacing the email:
6. Register your own account in the app and verify the six-digit code sent to your email. Then run this SQL in Supabase SQL Editor, replacing the email:
   ```sql
   update public.profiles p set role = 'admin'
   from auth.users u
   where p.id = u.id and u.email = 'YOUR_ADMIN_EMAIL';
   ```
10. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. The workflow in `.github/workflows/deploy-pages.yml` deploys this branch automatically after each push. The expected site address is `https://mbisemeshack102-alt.github.io/efootball-tournament-/` once the first deployment succeeds. Use HTTPS.

## Important
- New registrations are always assigned the `player` role. Users cannot promote themselves to admin through the app.
- The Admin tab is hidden for players, and Supabase RLS independently blocks non-admin tournament creation/management.
- Live voice chat requires HTTPS, microphone permission, Supabase Realtime enabled, and a network that permits WebRTC. This first implementation uses a public STUN server only; reliable production voice across restrictive mobile networks needs a TURN service and real multi-device testing.
- Gift delivery is an admin-recorded status, not an automatic payment or game-currency transfer.
- ClickPesa BillPay payment submission is included for tournament entry fees. Set a fee when creating a tournament; players pay using Merchant Control Number 4078 and submit the ClickPesa transaction reference. An admin must verify the reference in the ClickPesa dashboard before the player is registered. Run `supabase/payments-clickpesa.sql` once in Supabase SQL Editor. This is manual verification, not an automatic ClickPesa API checkout/webhook; API access for the Kem merchant account was previously blocked pending KYC. Do not mark a payment paid unless it is confirmed in ClickPesa.
- Text chat is not included yet. The repository builds an installable debug APK through GitHub Actions; a signed production APK requires release signing.
- Do not commit secret keys. If a service-role/secret key was previously shared, rotate it in Supabase.

## Android
Once deployed over HTTPS, open the site in Chrome on Android and use **Add to Home screen**. The service worker is registered automatically on HTTPS for the installable PWA shell and is bundled into Android builds. GitHub Actions builds an installable debug APK; a signed production APK requires release signing.


## Required live checks before public launch
- Push notifications were removed from the app, service worker, database setup, and Edge Function source. The service worker remains only for the offline app shell.
- Run the complete `supabase/schema.sql` in the Supabase SQL Editor; the browser app cannot create these tables automatically.
- Confirm a new email can receive and verify the six-digit OTP, then test login and logout.
- Promote the intended owner account to `admin` with the SQL above; do not expose service-role credentials.
- Test tournament creation/joining, results, gifts and gift claims with separate admin and player accounts.
- Test voice chat with at least two phones/accounts on different networks. The current WebRTC setup uses public STUN only; a TURN relay is recommended for reliable mobile-network connectivity.
- Background push notifications remain optional and require VAPID keys plus the documented Edge Function and database webhooks.
