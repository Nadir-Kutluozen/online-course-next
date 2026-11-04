import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { BackIcon, CheckIcon, CrossIcon } from './icons';
import styles from './Course.module.css';

const TOOK = [
  ['finished', 'Finished it'],
  ['in_progress', 'Taking it now'],
  ['dropped', 'Quit partway'],
];
const AI = ['Made by a person', 'A little AI', 'Some AI', 'A lot of AI', 'Mostly AI filler'];
const LEARNED = ['Nothing', 'A little', 'Some', 'A lot', 'Tons'];

// Tap a bar to set a 1-5 score. Tap the same one again to clear it.
const Scale = ({ label, words, value, onChange, tone }) => (
  <div className={styles.scale}>
    <div className={styles.scaleHead}>
      <span className={styles.scaleLabel}>{label}</span>
      <span className={styles.scaleWord}>{value ? words[value - 1] : 'Tap to rate'}</span>
    </div>
    <div className={`${styles.scaleBars} ${styles[tone]}`} role="radiogroup" aria-label={label}>
      {words.map((word, i) => {
        const n = i + 1;
        return (
          <button
            key={word}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} of 5: ${word}`}
            className={value && n <= value ? styles.scaleOn : ''}
            onClick={() => onChange(value === n ? null : n)}
          />
        );
      })}
    </div>
  </div>
);

const RateModal = ({ open, onClose, course, tagOptions, enabled }) => {
  const router = useRouter();
  const dialog = useRef(null);
  const [step, setStep] = useState('took');
  const [took, setTook] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [aiSlop, setAiSlop] = useState(null);
  const [learned, setLearned] = useState(null);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => {
    if (step === 'done' || step === 'no') {
      setStep('took');
      setTook(null);
      setVerdict(null);
    }
    onClose();
  };

  const commentLength = comment.trim().length;
  const commentOk = commentLength === 0 || (commentLength >= 10 && commentLength <= 2000);
  const toggleTag = (code) => setTags((t) => (t.includes(code) ? t.filter((x) => x !== code) : t.length < 5 ? [...t, code] : t));

  const submit = async () => {
    if (!took || !verdict || !commentOk || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id, tookCourse: took, verdict, aiSlop, learned, tags, comment, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Your rating could not be saved.');
      setStep('done');
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const steps = ['took', 'verdict', 'details'];
  const at = steps.indexOf(step);
  const good = tagOptions.filter((t) => t.kind === 'good');
  const bad = tagOptions.filter((t) => t.kind === 'bad');

  return (
    <dialog
      ref={dialog}
      className={styles.modal}
      aria-labelledby="rate-title"
      onClose={close}
      onClick={(e) => { if (e.target === dialog.current) close(); }}
    >
      <div className={styles.modalBox}>
        <div className={styles.modalTop}>
          {at > 0 ? (
            <button type="button" className={styles.iconBtn} onClick={() => setStep(steps[at - 1])} aria-label="Back"><BackIcon /></button>
          ) : <span />}
          {at >= 0 && (
            <span className={styles.progress} aria-label={`Step ${at + 1} of 3`}>
              {steps.map((s, i) => <span key={s} className={i <= at ? styles.progressOn : ''} />)}
            </span>
          )}
          <button type="button" className={styles.iconBtn} onClick={close} aria-label="Close"><CrossIcon /></button>
        </div>
        <p className={styles.modalCourse}>{course.title}</p>

        {!enabled && (
          <>
            <h2 id="rate-title" className={`display ${styles.modalTitle}`}>Ratings open soon</h2>
            <p className={styles.modalNote}>Check back in a little while.</p>
          </>
        )}

        {enabled && step === 'took' && (
          <>
            <h2 id="rate-title" className={`display ${styles.modalTitle}`}>Did you take it?</h2>
            <div className={styles.bigChoices}>
              {TOOK.map(([value, label]) => (
                <button key={value} type="button" className={`${styles.big} ${took === value ? styles.bigOn : ''}`} onClick={() => { setTook(value); setStep('verdict'); }}>
                  {label}
                </button>
              ))}
            </div>
            <button type="button" className={styles.textBtn} onClick={() => setStep('no')}>I didn&apos;t take it</button>
          </>
        )}

        {enabled && step === 'no' && (
          <>
            <h2 id="rate-title" className={`display ${styles.modalTitle}`}>Only people who took it rate it</h2>
            <p className={styles.modalNote}>That keeps the ratings honest. Upvote the ratings you agree with instead.</p>
            <button type="button" className="btn btn-dark" onClick={close}>Got it</button>
          </>
        )}

        {enabled && step === 'verdict' && (
          <>
            <h2 id="rate-title" className={`display ${styles.modalTitle}`}>Worth the money?</h2>
            <div className={styles.verdicts}>
              <button type="button" className={`${styles.verdictBtn} ${styles.vWorth} ${verdict === 'worth_it' ? styles.vOn : ''}`} onClick={() => { setVerdict('worth_it'); setStep('details'); }}>
                <CheckIcon size={34} />
                Worth it
              </button>
              <button type="button" className={`${styles.verdictBtn} ${styles.vGrab} ${verdict === 'money_grab' ? styles.vOn : ''}`} onClick={() => { setVerdict('money_grab'); setStep('details'); }}>
                <CrossIcon size={34} />
                Money grab
              </button>
            </div>
          </>
        )}

        {enabled && step === 'details' && (
          <>
            <h2 id="rate-title" className={`display ${styles.modalTitle}`}>A few quick taps</h2>
            <Scale label="AI filler" words={AI} value={aiSlop} onChange={setAiSlop} tone="toneAi" />
            <Scale label="How much you learned" words={LEARNED} value={learned} onChange={setLearned} tone="toneLearn" />
            {tagOptions.length > 0 && (
              <div className={styles.tagPick}>
                <span className={styles.scaleLabel}>What stood out? <span className={styles.muted}>Up to 5</span></span>
                <div className={styles.tagButtons}>
                  {[...good, ...bad].map((t) => {
                    const on = tags.includes(t.code);
                    return (
                      <button
                        key={t.code}
                        type="button"
                        aria-pressed={on}
                        disabled={!on && tags.length >= 5}
                        className={`${styles.tagBtn} ${on ? (t.kind === 'good' ? styles.tagOnGood : styles.tagOnBad) : ''}`}
                        onClick={() => toggleTag(t.code)}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <textarea
              className={styles.textarea}
              rows={3}
              maxLength={2000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment (optional)"
              aria-label="Comment"
            />
            {commentLength > 0 && commentLength < 10 && <p className={styles.modalNote}>A few more words, please.</p>}
            <div className={styles.trap} aria-hidden="true">
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button type="button" className={`btn btn-dark ${styles.postBtn}`} onClick={submit} disabled={!commentOk || sending}>
              {sending ? 'Posting…' : 'Post my rating'}
            </button>
            <p className={styles.modalFine}>Anonymous. Rating again replaces yours.</p>
          </>
        )}

        {step === 'done' && (
          <>
            <h2 id="rate-title" className={`display ${styles.modalTitle}`}>Thanks, it&apos;s posted</h2>
            <p className={styles.modalNote}>You just helped the next person decide.</p>
            <button type="button" className="btn btn-dark" onClick={close}>Done</button>
          </>
        )}
      </div>
    </dialog>
  );
};

export default RateModal;
