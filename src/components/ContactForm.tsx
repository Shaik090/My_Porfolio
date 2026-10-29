'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const configured = Boolean(serviceId && templateId && publicKey);

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const sending = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || sending.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    if (fields.get('website')) return;
    const name = String(fields.get('name') || '').trim();
    const email = String(fields.get('email') || '').trim();
    const subject = String(fields.get('subject') || '').trim();
    const message = String(fields.get('message') || '').trim();
    if (name.length < 2 || subject.length < 3 || message.length < 10) { setStatus('error'); return; }
    sending.current = true;
    setStatus('sending');
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            from_name: name,
            reply_to: email,
            subject,
            message,
          },
        }),
      });
      if (!response.ok) throw new Error('Message was not accepted');
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    } finally {
      sending.current = false;
    }
  }

  return <form id="contact-message" className="contact-message-form" onSubmit={submit} aria-labelledby="message-form-title">
    <div className="message-form-heading"><span>LET’S START A CONVERSATION</span><h3 id="message-form-title">Send me a message</h3><p>Have a role, project, or idea in mind? I’d love to hear about it.</p></div>
    {!configured && <p className="message-form-notice">The message form is being set up. You can connect with me on <a href="https://www.linkedin.com/in/shaik-nowman" target="_blank" rel="noopener noreferrer">LinkedIn<span className="visually-hidden"> (opens in a new tab)</span></a>.</p>}
    <fieldset disabled={!configured || status === 'sending'}>
      <legend className="visually-hidden">Your contact details and message</legend>
      <div className="message-form-fields"><label htmlFor="sender-name">Your name<input id="sender-name" name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your name"/></label><label htmlFor="sender-email">Your email<input id="sender-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></label></div>
      <label htmlFor="sender-subject">Subject<input id="sender-subject" name="subject" required minLength={3} maxLength={200} placeholder="What would you like to discuss?"/></label>
      <label htmlFor="sender-message">Your message<textarea id="sender-message" name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Tell me a little about your project or opportunity…"/></label>
      <div className="message-form-trap" aria-hidden="true"><label htmlFor="sender-website">Website<input id="sender-website" name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <button className="button primary message-submit" type="submit">{status === 'sending' ? <>Sending… <LoaderCircle size={17} className="message-spinner" aria-hidden="true"/></> : <>Send Message <ArrowUpRight size={17} aria-hidden="true"/></>}</button>
    </fieldset>
    <p className={`message-form-status ${status}`} role="status" aria-live="polite" aria-atomic="true">{status === 'sent' ? 'Your message was sent successfully. Thank you for reaching out!' : status === 'error' ? 'Your message could not be sent. Please try again or connect on LinkedIn.' : status === 'sending' ? 'Sending your message…' : ''}</p>
  </form>;
}
