# KICKOFF WINS GIFTS

Mobile-first esports tournament app built with Expo Router and React Native.

## Supabase connection
1. Create or open the Supabase project intended for KICKOFF WINS GIFTS.
2. In Supabase SQL Editor, run `supabase/schema.sql` from this app folder.
3. Copy `.env.example` to `.env` inside `efootball-app`.
4. Set `EXPO_PUBLIC_SUPABASE_URL` to the Supabase Project URL.
5. Set `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project's publishable key (starts with `sb_publishable_`).
6. In Supabase Authentication > Email, configure the confirmation email template to include the 6-digit token using `{{ .Token }}`.
7. Add the app redirect scheme `kickoffwinsgifts://auth/callback` to the Supabase Auth URL configuration if using email links.

Never put a Supabase Secret or `service_role` key in the mobile app or GitHub.

## Included
- Supabase client with persisted mobile sessions
- Email/password login
- Player registration with username metadata
- Six-digit email OTP verification and resend
- Starter schema for profiles, games, tournaments, participants, matches, chat and updates with RLS

## Run locally
```bash
npm install
npx expo start
``

The app must be restarted after changing environment variables. Realtime chat, payments, push notifications and production release signing need separate setup.
