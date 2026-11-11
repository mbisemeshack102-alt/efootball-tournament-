# KICKOFF WINS GIFTS

Mobile-first esports tournament app built with Expo Router and React Native.

## Supported game categories
- PUBG Mobile
- eFootball
- Free Fire

## Current foundation
- Mobile-first dark gaming dashboard
- Tournament discovery screen
- Login, registration and email verification-code screens (UI foundation)
- Updates, player chat and settings screens
- Supabase PostgreSQL schema with Row Level Security policies

## Supabase setup
1. Create a Supabase project.
2. Open the SQL Editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env`.
4. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Never put a Supabase Secret or `service_role` key in the mobile app or GitHub.

Authentication, realtime chat, notifications and tournament actions are not active until the Supabase project is connected and the client integration is completed.

## Run locally
```bash
npm install
npx expo start
```

## Validation
Run `npx expo lint` and `npx tsc --noEmit` before release.
