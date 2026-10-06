import React, { useState, useEffect } from 'react';

import { kalakarApi } from '../../api/kalakarClient';
import { mapBackendCaptionsToFrontend } from '../../api/mappers';
import { MOCK_CAPTIONS } from '../../data/mockCaptions';

import { useCaptionContext } from '../../context/CaptionContext';
import type {
  TranscriptionLanguage,
  WordsOption,
} from '../../types/caption';
import { ToggleRow } from '../Shared/ToggleRow';
import { CaptionLine } from './CaptionLine';
import { DelaySlider } from './DelaySlider';
import { TranscriptionProgress } from './TranscriptionProgress';
import styles from './CaptionsTab.module.scss';

const PunctuationIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
    <circle cx="4" cy="10" r="1.4" />
    <path d="M9 3c1.5 0 2.5 1 2.5 2.3S10.5 8 9 8H8.2v1.8H6.5V3H9z" />
  </svg>
);

const GapsIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M2 7h3M9 7h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M5 4v6M9 4v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const EmphasisIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path
      d="M7 2.5l1.2 3.4H12l-2.8 2.1 1.1 3.5L7 9.6l-3.3 1.9 1.1-3.5L2 5.9h3.8L7 2.5z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export function CaptionsTab() {
  const {
    captions,
    setCaptions,
    deleteCaption,
    currentPlaybackTime,
    isTranscribing,
    setIsTranscribing,
    captionsSettings,
    updateCaptionsSettings,
    isBackendOnline,
    currentJobId,
    setCurrentJobId,
  } = useCaptionContext();

  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  const handleGenerateCaptions = async () => {
    if (!isBackendOnline) {
      setIsTranscribing(true);
      setTranscriptionError(null);
      setTimeout(() => {
        setCaptions(MOCK_CAPTIONS);
        setIsTranscribing(false);
      }, 2000);
      return;
    }

    try {
      setIsTranscribing(true);
      setTranscriptionError(null);
      
      const proj = await kalakarApi.createProject('Premiere Sequence ' + Date.now());
      const dummyAudio = new Blob(['dummy audio content'], { type: 'audio/mp3' });
      const media = await kalakarApi.uploadMedia(proj.id, dummyAudio, 'sequence.mp3');
      
      const langMap: Record<string, string> = {
        'hindi': 'hi-IN',
        'english': 'en-IN',
        'hindi-english': 'en-IN'
      };
      const backendLang = langMap[captionsSettings.transcriptionLanguage] || 'en-IN';
      
      const job = await kalakarApi.createJob(media.id, backendLang);
      setCurrentJobId(job.id);
    } catch (err: any) {
      setTranscriptionError(err.message || 'Failed to start transcription');
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    if (!currentJobId || !isTranscribing) return;

    let timeoutId: number;
    let isCancelled = false;

    const poll = async () => {
      try {
        const statusRes = await kalakarApi.getJobStatus(currentJobId);
        if (isCancelled) return;

        if (statusRes.status === 'done') {
          const capRes = await kalakarApi.getJobCaptions(currentJobId);
          if (capRes && !isCancelled) {
            setCaptions(mapBackendCaptionsToFrontend(capRes));
            setIsTranscribing(false);
          }
        } else if (statusRes.status === 'failed') {
          setTranscriptionError(statusRes.error_message || 'Transcription failed');
          setIsTranscribing(false);
          setCurrentJobId(null);
        } else {
          timeoutId = window.setTimeout(poll, 3000);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setTranscriptionError(err.message || 'Error checking status');
          setIsTranscribing(false);
          setCurrentJobId(null);
        }
      }
    };

    poll();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [currentJobId, isTranscribing, setCaptions, setIsTranscribing, setCurrentJobId]);

  const {
    transcriptionLanguage,
    wordsOption,
    linesOption,
    charactersLimit,
    delayMs,
    removePunctuation,
    removeGaps,
    removeEmphasis,
  } = captionsSettings;

  useEffect(() => {
    if (!currentJobId || !isBackendOnline) return;

    const timer = setTimeout(async () => {
      try {
        const res = await kalakarApi.resegment(currentJobId, {
          max_words_per_segment: wordsOption === 'auto' ? 10 : Math.max(1, Math.floor(charactersLimit / 5))
        });
        setCaptions(mapBackendCaptionsToFrontend(res));
      } catch (err) {
        console.error('Failed to resegment', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [wordsOption, linesOption, charactersLimit, currentJobId, isBackendOnline, setCaptions]);

  const onLanguageChange = (value: TranscriptionLanguage) => {
    updateCaptionsSettings({ transcriptionLanguage: value });
    // TODO: replace with real API call — re-transcribe with selected language
    console.log('[CaptionsTab] transcriptionLanguage →', value);
  };

  return (
    <div className={styles.root}>
      <div className={styles.formGroup}>
        <p className={styles.sectionLabel}>Language</p>
        <select
          className={styles.select}
          value={transcriptionLanguage}
          aria-label="Transcription language"
          onChange={(e) =>
            onLanguageChange(e.target.value as TranscriptionLanguage)
          }
        >
          <option value="hindi">Hindi</option>
          <option value="english">English</option>
          <option value="hindi-english">Hindi+English (code-mixed)</option>
        </select>
      </div>

      <div className={styles.row3}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Words</span>
          <select
            className={styles.select}
            value={wordsOption}
            aria-label="Words option"
            onChange={(e) =>
              updateCaptionsSettings({
                wordsOption: e.target.value as WordsOption,
              })
            }
          >
            <option value="default">Default</option>
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Lines</span>
          <select
            className={styles.select}
            value={linesOption}
            aria-label="Lines option"
            onChange={(e) =>
              updateCaptionsSettings({ linesOption: Number(e.target.value) })
            }
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Characters</span>
          <input
            type="number"
            className={styles.numberInput}
            min={10}
            max={120}
            value={charactersLimit}
            aria-label="Character limit"
            onChange={(e) =>
              updateCaptionsSettings({
                charactersLimit: Number(e.target.value) || 0,
              })
            }
          />
        </div>
      </div>

      <div className={styles.card}>
        <DelaySlider
          value={delayMs}
          onChange={(ms) => updateCaptionsSettings({ delayMs: ms })}
        />
      </div>

      <div className={styles.card}>
        <ToggleRow
          icon={PunctuationIcon}
          title="Remove punctuation"
          description="Strip commas, periods, and quotes from captions"
          checked={removePunctuation}
          onChange={(checked) =>
            updateCaptionsSettings({ removePunctuation: checked })
          }
        />
        <ToggleRow
          icon={GapsIcon}
          title="Remove gaps"
          description="Tighten timing by closing silent gaps"
          checked={removeGaps}
          onChange={(checked) => updateCaptionsSettings({ removeGaps: checked })}
        />
        <ToggleRow
          icon={EmphasisIcon}
          title="Remove emphasis"
          description="Normalize ALL-CAPS and stressed words"
          checked={removeEmphasis}
          onChange={(checked) =>
            updateCaptionsSettings({ removeEmphasis: checked })
          }
        />
      </div>

      <button
        type="button"
        className={styles.devBtn}
        onClick={handleGenerateCaptions}
        disabled={isTranscribing && !transcriptionError}
      >
        {isTranscribing && !transcriptionError ? 'Generating...' : 'Generate Captions'}
      </button>

      {isTranscribing || transcriptionError ? (
        <TranscriptionProgress error={transcriptionError} />
      ) : (
        <div className={styles.list}>
          <p className={styles.sectionLabel}>Captions</p>
          {captions.map((caption) => (
            <CaptionLine
              key={caption.id}
              caption={caption}
              currentPlaybackTime={currentPlaybackTime}
              onDelete={deleteCaption}
              jobId={currentJobId}
            />
          ))}
          {captions.length === 0 ? (
            <p className={styles.fieldLabel}>No captions yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
