# Using a Vercel domain

The application can use a free `vercel.app` production domain. Moving domains does not require replacing the Neon database or deleting application data.

1. Add the chosen name to the existing Vercel project's production domains.
2. Keep preview deployments protected while allowing the production domain to be public.
3. Update `NEXT_PUBLIC_SITE_URL`, `KINDE_SITE_URL`, `KINDE_POST_LOGIN_REDIRECT_URL`, and `KINDE_POST_LOGOUT_REDIRECT_URL` for the production origin.
4. In Kinde, allow `https://<production-domain>/api/auth/kinde_callback` and the new logout origin.
5. Rebuild the same deployed source revision to apply changed environment variables. Changing an alias alone does not update URLs embedded in a build.
6. Verify anonymous browsing, sign-in, logout, registration, ticket links, and organizer check-in before retiring an old custom domain.

The GitHub refactor branch is independent of restoring an existing deployment's domain. It can remain a draft pull request while the existing production source continues serving users.
