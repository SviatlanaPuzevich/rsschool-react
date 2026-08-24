'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from './flyout.module.css';
import usePokemonStore from '@/stores/usePokemonStore';
import Button from '../button/Button';
import Alert from '../error/Alert';
import { exportPokemonsCsv } from '@/app/actions/exportPokemonsCsv';
import { initialExportCsvState } from '@/lib/exportCsvState';
import { downloadCsv } from '@/util/downloadCsv';

const Flyout = () => {
  const selectedPokemons = usePokemonStore((state) => state.selectedPokemons);
  const reset = usePokemonStore((state) => state.resetSelected);
  const t = useTranslations('Flyout');

  const [state, formAction, isPending] = useActionState(
    exportPokemonsCsv,
    initialExportCsvState
  );

  useEffect(() => {
    if (state.status === 'success') {
      downloadCsv(state.csv, state.filename);
    }
  }, [state]);

  if (selectedPokemons.length === 0) {
    return null;
  }

  return (
    <div className={styles.flyout}>
      <span>{t('selected', { count: selectedPokemons.length })}</span>
      <Button onClick={reset} buttonType="primary" text={t('unselectAll')} />

      <form action={formAction}>
        <input type="hidden" name="ids" value={selectedPokemons.join(',')} />
        <Button
          type="submit"
          text={isPending ? t('downloading') : t('download')}
          buttonType="primary"
          disabled={isPending}
        />
      </form>

      {state.status === 'error' && <Alert show message={t(state.error)} />}
    </div>
  );
};

export default Flyout;
