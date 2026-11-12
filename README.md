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
3. In `index.html`, replace `YOUR_SUPABASE_PROJECT_URL` with your project URL and `YOUR_SUPABASE_PUBLISHABLE_KEY` with the publishable (anon) key. Never put a Supabase secret/service-role key in browser code or GitHub.
4. In Supabase Authentication settings, enable email confirmations and set your deployed site URL plus allowed redirect URLs.
5. Register your own account in the app. Then run this SQL in Supabase SQL Editor, replacing the email:
   ```sql
   update public.profiles p set role = 'admin'
   from auth.users u
   where p.id = u.id and u.email = 'YOUR_ADMIN_EMAIL';
   ```
6. Deploy the repository with GitHub Pages or another static host using HTTPS.

## Important
- New registrations are always assigned the `player` role. Users cannot promote themselves to admin through the app.
- The Admin tab is hidden for players, and Supabase RLS independently blocks non-admin tournament creation/management.
- Live voice chat requires HTTPS, microphone permission, Supabase Realtime enabled, and a network that permits WebRTC. This first implementation uses a public STUN server only; reliable production voice across restrictive mobile networks needs a TURN service and real multi-device testing.
- Gift delivery is an admin-recorded status, not an automatic payment or game-currency transfer.
- Payments, text chat, match scoring, push notifications and APK packaging are not included yet.
- Do not commit secret keys. If a service-role/secret key was previously shared, rotate it in Supabase.

## Android
Once deployed over HTTPS, open the site in Chrome on Android and use **Add to Home screen**. A signed production APK requires a separate Android packaging/build and signing step.
