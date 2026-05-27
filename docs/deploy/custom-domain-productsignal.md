# Custom Domain Setup: `productsignal.ru` + `www.productsignal.ru`

This runbook connects an existing Object Storage website deployment to:

- `https://productsignal.ru` (primary)
- `https://www.productsignal.ru`

It is designed for the current repository/deploy pipeline and does not change app runtime code.

## 1. Prerequisites

- Working deploy bucket in Yandex Object Storage (already in place).
- Static website hosting enabled on bucket:
  - `Index document`: `index.html`
  - `Error document`: `index.html` (SPA fallback).
- Public read access for website objects.
- Domain ownership for `productsignal.ru`.

## 2. Recommended architecture (production)

Use **Yandex Cloud CDN** in front of Object Storage:

1. CDN origin -> `http://<bucket>.website.yandexcloud.net`
2. Add hostnames:
   - `productsignal.ru`
   - `www.productsignal.ru`
3. Attach managed TLS certificate (Yandex Certificate Manager).
4. Point DNS records to CDN hostname.

Why this approach:

- HTTPS for custom domain.
- Better cache behavior and edge delivery.
- No dependency on local machine networking.

## 3. Yandex Cloud steps

1. Create/verify managed certificate for:
   - `productsignal.ru`
   - `www.productsignal.ru`
2. Complete domain validation (TXT records if requested by Certificate Manager).
3. Create CDN resource with Object Storage website origin.
4. Bind both domains to CDN resource.
5. Attach issued certificate to CDN custom domains.

## 4. DNS records to add

Use the CDN domain shown in Yandex Cloud after CDN creation, example placeholder:

- `d1234567890abcdef.cdn.yandex.net`

### Required records

1. Apex/root domain:
   - Host: `@`
   - Type: `ALIAS` or `ANAME` (preferred), or provider-specific flattening
   - Value: `<your-cdn-domain>`

2. WWW domain:
   - Host: `www`
   - Type: `CNAME`
   - Value: `<your-cdn-domain>`

3. Certificate validation records:
   - Type: `TXT`
   - Host/value exactly as shown in Certificate Manager

If your DNS provider does not support `ALIAS/ANAME` at apex:

- Move DNS to provider that supports flattening, or
- Use provider apex flattening feature, or
- Temporarily use `www` as canonical and redirect apex at registrar level.

## 5. GitHub Actions integration

Set additional repository secrets (optional but recommended):

- `PRODUCTION_URL` = `https://productsignal.ru`
- `PRODUCTION_WWW_URL` = `https://www.productsignal.ru`

Workflow `.github/workflows/deploy.yml` now:

- deploys to Object Storage as before;
- verifies health on `PRODUCTION_URL` (or bucket fallback if secret is missing);
- verifies `PRODUCTION_WWW_URL` when provided;
- prints primary/WWW/fallback URLs in deployment summary.

## 6. Verification checklist

After DNS propagation and certificate issuance:

1. Open:
   - `https://productsignal.ru`
   - `https://www.productsignal.ru`
2. Check:
   - HTTP 200/301/302 only
   - no TLS warnings
   - CSS/JS assets loaded from `assets/*`
   - no mixed-content errors
   - SPA deep links work (hash routes and refresh)

## 7. Rollback

If domain-level issues appear:

1. Keep CDN resource but temporarily switch DNS apex/`www` to previous stable target.
2. Keep Object Storage fallback URL available:
   - `http://<bucket>.website.yandexcloud.net`
3. Use existing GitHub Actions rollback workflow inputs for content rollback if needed.
