# Open Questions

## Blocking Question

### Username Authentication With Supabase

The user wants username/password instead of email/password.

Supabase Auth does not provide a native username/password sign-in flow in the same way it provides email/password sign-in. Before implementation, one of these approaches must be selected:

1. Username as UI identity, email under the hood
   - User signs up with a username and password in the app UI.
   - The app creates a synthetic internal email such as `username@between-the-lines.local`.
   - The user never interacts with email in normal usage.
   - This is the simplest path while still using Supabase Auth.

2. Custom auth system on top of Supabase database
   - Store credentials logic ourselves instead of using Supabase Auth directly.
   - This is more work and higher risk.
   - Not recommended for the first version.

## Recommendation

Use option 1 unless the user explicitly wants a fully custom auth system.
