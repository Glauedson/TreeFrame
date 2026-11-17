'use client';

import { useState } from 'react';

interface Props {
  initialValue: string;
  loading: boolean;
  onSubmit: (repo: string) => void;
}

const EXAMPLE_REPO = 'vercel/swr';

export function RepoForm({ initialValue, loading, onSubmit }: Props) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className="repo-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value.trim());
      }}
    >
      <label htmlFor="repo-input">GitHub repository</label>
      <div className="repo-form__row">
        <input
          id="repo-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="github.com/owner/name"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className="btn btn--primary" disabled={loading || !value.trim()}>
          {loading ? 'Reading…' : 'Build map'}
        </button>
      </div>
      <button type="button" className="link" onClick={() => { setValue(EXAMPLE_REPO); onSubmit(EXAMPLE_REPO); }}>
        Try {EXAMPLE_REPO}
      </button>
    </form>
  );
}
