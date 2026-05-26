# Production Deploy: Yandex Cloud Object Storage + GitHub Actions

## 1. Goal
This pipeline fully bypasses local network restrictions:
- deploy runs inside GitHub Cloud Runner;
- runner connects directly to Yandex Object Storage;
- local firewall/EDR/proxy/routing is not part of deploy path.

Result:
- auto deploy on `push` to `main`;
- manual deploy/rollback via `workflow_dispatch`;
- zero-downtime publish order for Vite SPA.

## 2. Repository state
- Workflow: `.github/workflows/deploy.yml`
- Triggers:
  - `push` to `main`
  - `workflow_dispatch` for manual run
- Environment:
  - auto mode: `production`
  - manual mode: `target_environment` input (default `production`)
- Artifact retention: 14 days (`dist-build`) for rollback

## 3. Yandex IAM setup
1. Open Yandex Cloud Console.
2. Create or reuse a deploy service account, for example `sa-sergey-portfolio-deploy`.
3. Grant role:
   - minimum: `storage.editor` on the folder containing the bucket.
4. Create a static access key:
   - `Access key ID`
   - `Secret access key`
5. Ensure bucket static website hosting is enabled:
   - `IndexDocument` = `index.html`
   - `ErrorDocument` = `index.html` (SPA fallback)

## 4. GitHub Secrets setup
Open repository `Settings -> Secrets and variables -> Actions -> New repository secret`.

Required secrets:
- `YC_BUCKET` - production bucket name, for example `sergey-portfolio-prod-20260511`
- `YC_ACCESS_KEY_ID` - static access key id
- `YC_SECRET_ACCESS_KEY` - static secret key
- `YC_REGION` - for example `ru-central1`

Validation:
1. Open `Actions`.
2. Run workflow `Deploy Production to Yandex Object Storage` manually.
3. Step `Validate required secrets` must pass.

## 5. Deploy flow
Pipeline performs:
1. `checkout` + `setup-node@v4` + `npm ci` + `npm run build`.
2. Fail-fast validation for `dist` and `dist/index.html`.
3. Upload build artifact `dist-build` (14 days).
4. Validate bucket website config (`get-bucket-website`).
5. Publish to Object Storage:
   - `dist/assets` with `Cache-Control: public,max-age=31536000,immutable` and `--delete` only in `assets`.
   - root files without deleting foreign bucket objects.
   - `index.html` last with `Cache-Control: no-cache,no-store,must-revalidate`.
6. Run MIME hardening pass for:
   - `.js`, `.css`, `.svg`, `.woff2`, `.webp`, `.json`, `.mp4`
7. Post-deploy verification:
   - website returns HTTP `200`
   - `index.html` contains `assets/*` references
8. Write final URLs to `Job Summary`.

## 6. Zero-downtime and cache strategy
Publish order:
1. Versioned assets first.
2. Root files second.
3. `index.html` last.

This avoids race conditions where a new `index.html` points to assets not uploaded yet.

Cache policy:
- `assets/*` -> `public,max-age=31536000,immutable`
- `index.html` -> `no-cache,no-store,must-revalidate`

## 7. Rollback strategy
Rollback is supported via `workflow_dispatch`.

### Option A: rollback from workflow input
1. Open `Actions -> Deploy Production to Yandex Object Storage`.
2. Click `Run workflow`.
3. Set `target_environment` (usually `production`).
4. Set `rollback_run_id` to a successful run id.
5. Keep `rollback_artifact_name` as `dist-build` unless you changed it.
6. Run workflow.

### Option B: rollback by code revert
1. Create a `revert` commit in `main`.
2. Push to `main`.
3. Auto deploy publishes reverted code.

## 8. Troubleshooting
### 8.1 Missing secret
Symptom:
- `Validate required secrets` fails.

Fix:
- check all required `YC_*` secrets and names.

### 8.2 Access denied (403)
Symptom:
- `AccessDenied` or `SignatureDoesNotMatch`.

Fix:
- rotate static key;
- verify `storage.editor` role;
- verify bucket and region values.

### 8.3 Website config missing
Symptom:
- `Verify bucket website hosting config` fails.

Fix:
- enable static website hosting;
- set `index.html` as both index and error document for SPA fallback.

### 8.4 404 for assets
Symptom:
- blank page, 404 on `assets/*.js`.

Fix:
- verify assets upload step succeeded;
- verify `index.html` upload is last.

### 8.5 Wrong MIME
Symptom:
- browser blocks scripts/styles/fonts/media.

Fix:
- check `MIME hardening pass` logs;
- extend MIME mapping if new file types were added.

## 9. Verification commands
Website checks:

```bash
curl -i "http://<bucket>.website.yandexcloud.net/"
curl -I "http://<bucket>.website.yandexcloud.net/assets/<asset-file>.js"
```

Website config check:

```bash
aws s3api get-bucket-website \
  --bucket "<bucket>" \
  --endpoint-url "https://storage.yandexcloud.net"
```

Workflow checks:

```bash
gh run list --workflow "deploy.yml" --limit 10
gh run view <run-id> --log
```

## 10. Optional preview architecture
As a next phase, add a separate preview workflow:
- trigger on pull requests;
- upload to prefix `preview/<sha>/`;
- comment preview URL in PR;
- clean old preview prefixes on schedule.

## 11. Production recommendations
- Enable branch protection on `main`.
- Require successful deploy workflow before merge.
- Add GitHub Environment protection rules for `production`.
- Add Slack/Telegram notifications for deploy status.
- Rotate Yandex keys on a regular schedule.
- When domain is connected, use Yandex Cloud CDN + HTTPS and keep bucket website URL as fallback.
