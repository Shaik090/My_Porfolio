# EmailJS contact form

The portfolio uses the browser REST send endpoint from the official EmailJS documentation: https://www.emailjs.com/docs/rest-api/send/ . No extra SDK dependency or private key is required by this implementation.

## Connect the account

The supplied account identifiers are saved in the ignored `.env.local`. For a fresh checkout, copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

The connected email service and template must already exist. Set the recipient in the EmailJS template to your own inbox. The code does not expose a recipient email address in the form.

The current template parameters are `from_name`, `reply_to`, `subject`, and `message`, matching the user-confirmed template. Use `{{from_name}}` and `{{message}}` in the template body and `{{subject}}` in the subject, and `{{reply_to}}` in the Reply-To field. If your template uses different variable names, update the mapping in `src/components/ContactForm.tsx` to match before testing.

Add the same public environment variables to the deployment configuration and rebuild/redeploy; Next.js embeds NEXT_PUBLIC values at build time. If origin restrictions are enabled in EmailJS, allow the portfolio domain and the localhost origin used for testing. Never place an EmailJS private key or email password in these variables.

## Behavior

The form validates required inputs, prevents duplicate submits while sending, includes a hidden honeypot field, times out stalled requests, preserves the message after errors, and resets only after an accepted response. Status messages are announced accessibly. Without configuration, sending is disabled and LinkedIn remains available. The website's former visible recipient email and mailto links are replaced by form links. The downloadable resume retains its professional email contact.

## Verification boundary

Mocked browser tests intercept EmailJS requests before network delivery. These cover success, failure, retry, payload mapping, browser validation, pending state, and mobile layout. They do not prove delivery to an inbox. A configured UI-to-inbox test is still required after template settings are confirmed and a live test is authorized; no real email was sent during mock testing.

TypeScript, lint and the production build passed. The unconfigured production browser check confirmed disabled sending and a LinkedIn fallback, with no hydration/runtime errors. Temporary preview servers were stopped after verification.

## Supplied auto-reply template

Main contact template: `template_oktpcnf`. Auto-reply template: `template_yzz66bf`.

In the EmailJS dashboard, open the main template's **Auto-Reply** tab, link `template_yzz66bf`, and save. Set the reply template's recipient to `{{reply_to}}` and its greeting to `{{from_name}}`. Keep the main contact template recipient set to your own inbox. Official workflow: https://www.emailjs.com/docs/user-guide/auto-reply/ .

The application submits the main template once. EmailJS dispatches its linked auto-reply; the browser does not send a second acknowledgement. Merely supplying the reply template ID does not establish that dashboard link. Template variables and linking still require confirmation from the dashboard. Actual inbox delivery and automatic acknowledgement remain unverified until a controlled live submission is authorized and checked.

The supplied account identifiers were subsequently built and browser-tested against intercepted EmailJS requests. The initial name/email mapping, sending state, success, failure/retry, field reset and mobile layout passed. TypeScript/lint/production build passed. No real emails were sent; neither primary inbox receipt nor auto-reply delivery is claimed. The test server was stopped.
