# /actuator/health returns DOWN while containers are Up

**Symptom:** `curl.exe http://localhost:5000/actuator/health` returns `{"status":"DOWN"}`. `docker compose ps` shows all services Up, and the backend has no healthcheck, so Docker can't tell the app is unhealthy.

**Diagnosis:**
1. `docker compose logs backend --no-log-prefix --since 1m | Select-String "Caused by|Exception|ERROR|mail|health"`
2. Found `MailHealthIndicator: Mail health check failed` with `jakarta.mail.AuthenticationFailedException: 535-5.7.8 Username and Password not accepted`.

**Root cause:** Actuator aggregates all health indicators. The placeholder SMTP credentials made the mail indicator fail, which marked the whole app DOWN even though the database and app were fine.

**Fix:** Set `MANAGEMENT_HEALTH_MAIL_ENABLED=false` in the backend's environment in `docker-compose.yml`. Also added a backend `healthcheck` (wget against `/actuator/health`, `start_period: 60s`) so `docker compose ps` shows `(healthy)` or `(unhealthy)`.

**Prevention:** Only critical dependencies (the database) should gate health. Non-critical ones like mail should be excluded or non-fatal. Always define a container healthcheck so "Up" isn't mistaken for "healthy". The JRE Alpine image has no `curl`, so use `wget`.