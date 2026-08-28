'use client';

import { useActionState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/button/Button';
import { explainPokemon } from '@/app/actions/explainPokemon';
import { initialExplainState } from '@/lib/explainState';

interface Props {
  id: number;
}

const ExplainWithAI = ({ id }: Props) => {
  const locale = useLocale();
  const tPokemon = useTranslations('Pokemon');
  const tErrors = useTranslations('Errors');

  const [state, formAction, isPending] = useActionState(
    explainPokemon,
    initialExplainState
  );

  const showExplanation = state.status === 'success';
  const showError = state.status === 'error';

  return (
    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.75rem' }}>
      <form action={formAction}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="regenerate" value="false" />
        <Button
          type="submit"
          buttonType="primary"
          text={isPending ? tPokemon('explaining') : tPokemon('explainButton')}
          disabled={isPending}
        />
      </form>

      {showError && (
        <div role="alert" style={{ color: '#b42318' }}>
          {tErrors(state.error)}
          <div style={{ marginTop: '0.5rem' }}>
            <form action={formAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="regenerate" value="false" />
              <Button
                type="submit"
                buttonType="default"
                text={tPokemon('explainRetry')}
                disabled={isPending}
              />
            </form>
          </div>
        </div>
      )}

      {showExplanation && (
        <>
          <div
            role="status"
            style={{
              backgroundColor: '#fff7ed',
              border: '1px solid #f59e0b',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              color: '#9a5b00',
            }}
          >
            {tPokemon('aiWarning')}
          </div>

          <div style={{ whiteSpace: 'pre-wrap' }}>{state.explanation}</div>

          <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="regenerate" value="true" />
            <Button
              type="submit"
              buttonType="warning"
              text={tPokemon('explainRegenerate')}
              disabled={isPending}
            />
          </form>
        </>
      )}
    </div>
  );
};

export default ExplainWithAI;
