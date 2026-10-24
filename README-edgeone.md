# EdgeOne migration branch

This branch deploys public/ and cloud-functions/. It preserves the existing main branch and original Netlify site.

The editable HTML/CSS/JS and assets are in public/. The original generator remains in D:/working/个人志; regenerating from that source requires reapplying the form endpoint change.

Support form entries are private JSON objects in the supporter-registration Blob namespace, accessible to the Tencent account in the console. No public read/list endpoint is provided. Identical submissions on the same UTC day share a storage key to make retries idempotent. Stored entries do not verify payments. Existing Netlify form records are retained on Netlify; they are not yet imported.

Build: npm ci && npm run build. Test: npm test. The server validates consent, length, amount, content type, and same-origin requests, and uses a honeypot. Platform spam filtering is not replicated.
