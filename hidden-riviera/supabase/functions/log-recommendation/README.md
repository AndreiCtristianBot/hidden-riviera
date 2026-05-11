# log-recommendation Edge Function

Deploy:

```bash
supabase functions deploy log-recommendation
```

Set secrets:

```bash
supabase secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ALLOWED_ORIGIN=https://your-domain.example
```

Keep RLS enabled on `recommendation_requests` and `recommendation_results`. You do not need public
`insert` or `select` policies for these log tables because this function writes with
`SUPABASE_SERVICE_ROLE_KEY` server-side.

During local development, `http://localhost:5173`, `http://127.0.0.1:5173`, and Vite preview ports are allowed by CORS.

Test after deployment:

1. Run the app with `npm run dev`.
2. Generate an itinerary.
3. In Supabase SQL editor:

```sql
select * from recommendation_requests order by created_at desc limit 5;
select * from recommendation_results order by created_at desc limit 20;
```
