# Deploy Luxurymarocvoyage on cPanel

This is a source package. It excludes `.env.local`, dependencies, and old build output. Build it on the cPanel host so Next.js creates Linux server files for your server.

## Before uploading

Ask your hosting provider to confirm that the plan supports **Node.js applications**, a Node.js version supported by Next.js 16 (use Node 20.9 or newer), and Passenger or cPanel Web Apps. If the account only serves PHP/static sites, this Next.js app cannot run there as-is; use a Node-capable hosting plan/provider.

## Deploy to the main domain

1. Back up the current site files and database. Confirm `luxurymarocvoyage.com` points to this cPanel account (DNS A/AAAA records, or the provider's nameservers).
2. In cPanel, open **Websites → Create Website / Node.js App** (or **Setup Node.js App** on older cPanel). Create a production app for `luxurymarocvoyage.com` and `www.luxurymarocvoyage.com` if offered. Use Node 20.9+ and an application directory outside `public_html`, such as `luxurymarocvoyage-app`. Some hosts must attach the domain to the app for you.
3. Upload and extract this ZIP into the application directory. Do not place the source tree in a publicly served folder unless the host configures the Node app as the domain's handler.
4. In cPanel Terminal, change to the app directory and install/build:

   ```sh
   npm ci
   ```

   Create `.env.production` in the app directory with the values below **before building**, then run:

   ```sh
   npm run build
   ```

   Standalone output is in `.next/standalone`.

5. Prepare the standalone runtime directory. From the application directory run:

   ```sh
   cp -a public .next/standalone/public
   mkdir -p .next/standalone/.next/static
   cp -a .next/static/. .next/standalone/.next/static/
   ```

   Configure cPanel's Node app **application root** as the absolute path to `.next/standalone`, startup file `server.js`, and production mode. Set `PORT` if the panel requires it (otherwise let Passenger provide it). Restart the app from cPanel after each deployment.

6. Copy `.env.production` into `.next/standalone/.env.production` so the running server can read its runtime database and SMTP settings. Restrict file permissions and never put real secrets in a ZIP or commit them to source control.
7. Enable/issue SSL for the domain in cPanel. Test both `https://luxurymarocvoyage.com` and `https://www.luxurymarocvoyage.com`, including a booking/contact submission and the French, English, and Spanish pages.

> cPanel interfaces and Node app routing differ by host. If your panel cannot attach the root domain directly to the Node app, ask the host to map the domain's Apache/Passenger vhost to the app; do not point the domain at `.next` or expose the source directory as static files.

## Production environment variables

Set these in `.env.production` (replace every placeholder):

```env
NEXT_PUBLIC_SITE_URL=https://luxurymarocvoyage.com
NEXT_PUBLIC_WHATSAPP_NUMBER=212776715010
NEXT_PUBLIC_ADDRESS=Bureau N°5, 2ème étage, Lot, 359, Marrakech 40000, Maroc
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_cpanel_database
DB_USER=your_cpanel_database_user
DB_PASSWORD=your_database_password
SMTP_HOST=your_smtp_host
SMTP_PORT=465
SMTP_USER=your_mailbox
SMTP_PASS=your_mailbox_password_or_app_password
SMTP_FROM=your_mailbox
SMTP_TO=your_inquiry_recipient
```

Create a MySQL/MariaDB database and user in cPanel, grant the user access, then import your existing `voyagemaroc.sql` backup using phpMyAdmin. Use the database name/user exactly as cPanel prefixes them (often `cpaneluser_dbname`). Your host may require a remote DB hostname instead of `localhost`. Do not upload `.env.local`.

`NEXT_PUBLIC_*` values are embedded during the production build, so rebuild after changing them. Database and SMTP values are read by the server at runtime; restart the Node app after changing them.

## Switch from preview to the main domain

Once the main domain is showing the production app, verify SSL, pages, database-backed tours, inquiry email, and sitemap at `/sitemap.xml`. Then disable or remove the old preview deployment in its hosting dashboard. DNS changes can take time to propagate. Do not cancel the old hosting until the new domain works.



