import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Course.module.css';

const TOOK = [
  ['finished', 'Yes, I finished it'],
  ['in_progress', "I'm taking it now"],
  ['dropped', 'I started and quit'],
  ['no', "No, I didn't"],
];
const VERDICTS = [['worth_it', 'Worth it'], ['money_grab', 'Money grab']];
const AI = [[1, 'Made by a person'], [2, 'A little'], [3, 'Some'], [4, 'A lot'], [5, 'Mostly AI filler']];
const LEARNED = [[1, 'Nothing'], [2, 'A little'], [3, 'Some'], [4, 'A lot'], [5, 'Tons']];
const DIFFICULTY = [[1, 'Very easy'], [2, 'Easy'], [3, 'Just right'], [4, 'Hard'], [5, 'Very hard']];
const PAID = [['free', 'Nothing'], ['discount', 'A sale price'], ['full_price', 'Full price'], ['subscription', 'A subscription']];

// A question answered with pills. Built on real radio buttons for keyboards and screen readers.
const Choice = ({ name, legend, hint, options, value, onChange, optional }) => (
  <fieldset className={styles.field}>
    <legend className={styles.legend}>
      {legend} {optional && <span className={styles.optional}>Optional</span>}
    </legend>
    {hint && <p className={styles.hint}>{hint}</p>}
    <div className={styles.choices}>
      {options.map(([v, label]) => (
        <label key={v} className={`${styles.choice} ${value === v ? styles.choiceOn : ''}`}>
          <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
          {label}
        </label>
      ))}
    </div>
  </fieldset>
);

const RateForm = ({ course, tagOptions, enabled }) => {
  const router = useRouter();
  const [took, setTook] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [aiSlop, setAiSlop] = useState(null);
  const [learned, setLearned] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [paid, setPaid] = useState(null);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const isFree = course.pricing === 'audit' || course.pricing === 'free';
  const tookIt = took && took !== 'no';
  const commentLength = comment.trim().length;
  const commentOk = commentLength === 0 || (commentLength >= 10 && commentLength <= 2000);
  const ready = tookIt && verdict && commentOk && status !== 'sending';

  const toggleTag = (code) =>
    setTags((t) => (t.includes(code) ? t.filter((x) => x !== code) : t.length < 5 ? [...t, code] : t));

  const submit = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id, tookCourse: took, verdict, aiSlop, learned, difficulty, paid, tags, comment, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Your rating could not be saved.');
      setStatus('done');
      // Load the rebuilt page so the new rating shows in the summary and the list.
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (err) {
      setStatus('idle');
      setError(err.message);
    }
  };

  if (!enabled) {
    return (
      <div className={styles.rate}>
        <h2 className="display h2">Rate this course</h2>
        <p className={styles.rateIntro}>Ratings are switching on soon. Check back in a little while.</p>
      </div>
    );
  }

  if (status === 'done') {
    return (
      <div className={styles.rate} role="status">
        <h2 className="display h2">Thanks for telling the truth</h2>
        <p className={styles.rateIntro}>
          Your rating is in and helps the next person decide. If you rate this course again, your new answers replace these.
        </p>
      </div>
    );
  }

  const good = tagOptions.filter((t) => t.kind === 'good');
  const bad = tagOptions.filter((t) => t.kind === 'bad');

  return (
    <form className={styles.rate} onSubmit={submit} noValidate>
      <h2 className="display h2">Rate this course</h2>
      <p className={styles.rateIntro}>Anonymous, no account. One rating per person per course; rating again updates yours.</p>

      <Choice name="took" legend="Did you take this course?" options={TOOK} value={took} onChange={setTook} />

      {took === 'no' && (
        <p className={styles.notTaken}>
          Only people who took a course can rate it, so ratings stay honest. You can still compare it with other courses below.
        </p>
      )}

      {tookIt && (
        <>
          <Choice
            name="verdict"
            legend="Worth the money, or a money grab?"
            hint={isFree ? 'It is free to start, so think about your time too.' : null}
            options={VERDICTS}
            value={verdict}
            onChange={setVerdict}
          />
          <Choice name="ai" legend="How much of it was AI filler?" options={AI} value={aiSlop} onChange={setAiSlop} optional />
          <Choice name="learned" legend="How much did you learn?" options={LEARNED} value={learned} onChange={setLearned} optional />
          <Choice name="difficulty" legend="How hard was it?" options={DIFFICULTY} value={difficulty} onChange={setDifficulty} optional />
          <Choice name="paid" legend="What did you pay?" options={PAID} value={paid} onChange={setPaid} optional />

          {tagOptions.length > 0 && (
            <fieldset className={styles.field}>
              <legend className={styles.legend}>
                What stood out? <span className={styles.optional}>Up to 5</span>
              </legend>
              {[['The good', good], ['The bad', bad]].map(([title, list]) => (
                <div key={title} className={styles.tagGroup}>
                  <span className="label">{title}</span>
                  <div className={styles.choices}>
                    {list.map((t) => {
                      const on = tags.includes(t.code);
                      return (
                        <label key={t.code} className={`${styles.choice} ${on ? styles.choiceOn : ''} ${!on && tags.length >= 5 ? styles.choiceOff : ''}`}>
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleTag(t.code)} disabled={!on && tags.length >= 5} />
                          {t.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </fieldset>
          )}

          <div className={styles.field}>
            <label htmlFor="review-comment" className={styles.legend}>
              Anything people should know? <span className={styles.optional}>Optional</span>
            </label>
            <textarea
              id="review-comment"
              className={styles.textarea}
              rows={4}
              maxLength={2000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What was good, what was a waste, and who it's for."
            />
            <p className={styles.hint}>
              {commentLength > 0 && commentLength < 10 ? 'A few more words, please (10 characters at least).' : `${commentLength} / 2,000`}
            </p>
          </div>

          {/* Hidden from people; bots fill it in and get ignored. */}
          <div className={styles.trap} aria-hidden="true">
            <label>Website <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit" className="btn btn-dark" disabled={!ready}>
            {status === 'sending' ? 'Posting…' : 'Post my rating'}
          </button>
        </>
      )}
    </form>
  );
};

export default RateForm;
