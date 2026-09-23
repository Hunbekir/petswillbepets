import { useId, useState, type FormEvent } from 'react';
import { track } from '../../lib/analytics';
import { commerce } from '../../lib/commerce';

interface Props {
  productId: string;
  source: 'purchase' | 'footer' | 'closing';
  submitLabel: string;
  tone?: 'paper' | 'ink';
  /** id placed on the email input so in-page CTAs can focus it. */
  inputId?: string;
}

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'done'; preview: boolean }
  | { kind: 'error'; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function WaitlistForm({ productId, source, submitLabel, tone = 'paper', inputId }: Props) {
  const autoId = useId();
  const id = inputId ?? `email-${autoId}`;
  const msgId = `${id}-msg`;
  const [email, setEmail] = useState('');
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setState({ kind: 'error', message: 'Enter a valid email address.' });
      return;
    }
    setState({ kind: 'sending' });
    const res = await commerce.joinWaitlist({ email: value, productId, source });
    track({ name: 'waitlist_submitted', productId, source, ok: res.ok });
    if (res.ok) setState({ kind: 'done', preview: res.mode === 'preview' });
    else setState({ kind: 'error', message: res.message });
  }

  if (state.kind === 'done') {
    return (
      <div className={`waitlist waitlist--${tone} waitlist--done`} role="status">
        <p className="waitlist__thanks">You’re on the list.</p>
        {state.preview && (
          <p className="waitlist__note">
            Preview build: no sign-up service is connected yet, so this address was not stored.
          </p>
        )}
      </div>
    );
  }

  return (
    <form className={`waitlist waitlist--${tone}`} onSubmit={onSubmit} noValidate>
      <label className="waitlist__label" htmlFor={id}>
        Email address
      </label>
      <div className="waitlist__row">
        <input
          id={id}
          className="waitlist__input"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state.kind === 'error'}
          aria-describedby={state.kind === 'error' ? msgId : undefined}
          required
        />
        <button className={`btn ${tone === 'ink' ? 'btn--light' : 'btn--primary'}`} type="submit" disabled={state.kind === 'sending'}>
          {state.kind === 'sending' ? 'Joining…' : submitLabel}
        </button>
      </div>
      <p id={msgId} className="waitlist__error" aria-live="polite">
        {state.kind === 'error' ? state.message : ''}
      </p>
    </form>
  );
}
