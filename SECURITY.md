# Security

Please report suspected vulnerabilities privately through GitHub's **Security → Report a vulnerability** option. Do not include credentials, personal attendee data, or exploitable details in a public issue.

Configuration belongs in local environment files or the hosting provider's environment settings. `.env.example` documents variable names and placeholder values only. Never commit database credentials, OAuth client secrets, email API keys, push private keys, session cookies, or production exports.

If a credential is accidentally committed, revoke or rotate it before considering history cleanup. Deleting the file alone does not remove it from Git history.
