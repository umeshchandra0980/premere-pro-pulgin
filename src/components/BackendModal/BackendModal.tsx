import React, { useEffect, useState } from 'react';

import { kalakarApi } from '../../api/kalakarClient';
import { Modal } from '../Shared/Modal';
import styles from './BackendModal.module.scss';

export interface BackendModalProps {
  open: boolean;
  onClose: () => void;
  onStatusChange?: (online: boolean) => void;
}

export function BackendModal({ open, onClose, onStatusChange }: BackendModalProps) {
  const [baseUrl, setBaseUrl] = useState('http://127.0.0.1:8000');
  const [apiKey, setApiKey] = useState('');
  const [connectionState, setConnectionState] = useState<
    'idle' | 'checking' | 'online' | 'offline' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string>(
    'Not tested yet. Start your backend and click Test Connection.',
  );
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);

  useEffect(() => {
    if (open) {
      const cfg = kalakarApi.loadConfig();
      setBaseUrl(cfg.baseUrl || 'http://127.0.0.1:8000');
      setApiKey(cfg.apiKey || '');
      handleTest(cfg.baseUrl, cfg.apiKey);
    }
  }, [open]);

  const handleTest = async (testUrl = baseUrl, testKey = apiKey) => {
    setConnectionState('checking');
    setStatusMessage('Checking server health...');

    try {
      const health = await kalakarApi.checkHealth(testUrl);
      if (health.status === 'ok') {
        kalakarApi.setConfig({ baseUrl: testUrl, apiKey: testKey });

        if (testKey) {
          const auth = await kalakarApi.getMe();
          if (auth.ok) {
            setConnectionState('online');
            setStatusMessage(
              `Connected to Kalakar API (${health.env || 'dev'}). Authenticated as: ${auth.user?.name || auth.user?.email}`,
            );
            onStatusChange?.(true);
            return;
          } else {
            setConnectionState('online');
            setStatusMessage(
              `Server online, but API key verification failed: ${auth.error}. You can still generate a dev key.`,
            );
            onStatusChange?.(true);
            return;
          }
        } else {
          setConnectionState('online');
          setStatusMessage(
            `Server is running at ${testUrl}! Add an API key or click "Auto-Create Key" below.`,
          );
          onStatusChange?.(true);
          return;
        }
      } else {
        setConnectionState('offline');
        setStatusMessage(
          health.error || 'Server offline. Run: python run.py in plug-backend folder.',
        );
        onStatusChange?.(false);
      }
    } catch (e: any) {
      setConnectionState('error');
      setStatusMessage(`Connection error: ${e.message}`);
      onStatusChange?.(false);
    }
  };

  const handleSave = () => {
    kalakarApi.setConfig({ baseUrl, apiKey });
    handleTest(baseUrl, apiKey);
    onClose();
  };

  const handleGenerateDevKey = async () => {
    setIsGeneratingKey(true);
    setStatusMessage('Creating local user and API key on backend...');
    try {
      kalakarApi.setConfig({ baseUrl });
      const devEmail = `dev_${Date.now()}@kalakar.local`;
      await kalakarApi.registerUser(devEmail, 'Premiere Editor');
      const newKey = await kalakarApi.createApiKey('premiere-pro-panel');
      setApiKey(newKey);
      kalakarApi.setConfig({ apiKey: newKey });
      setConnectionState('online');
      setStatusMessage(`API Key generated and connected! (${newKey.slice(0, 14)}...)`);
      onStatusChange?.(true);
    } catch (err: any) {
      setStatusMessage(`Auto-key generation failed: ${err.message}`);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  return (
    <Modal open={open} title="Backend Connection (Kalakar API)" onClose={onClose}>
      <div className={styles.wrap}>
        <p className={styles.intro}>
          Connect this Premiere Pro panel to your <strong>plug-backend</strong> FastAPI
          service for Indian language STT, word alignment, and cloud exports.
        </p>

        <div className={styles.statusCard}>
          <div
            className={`${styles.statusDot} ${
              connectionState === 'online'
                ? styles.statusOnline
                : connectionState === 'offline'
                  ? styles.statusOffline
                  : styles.statusError
            }`}
          />
          <span className={styles.statusText}>{statusMessage}</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Backend Server URL</label>
          <input
            type="text"
            className={styles.input}
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://127.0.0.1:8000"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>API Key (X-API-Key)</label>
          <input
            type="text"
            className={styles.input}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="kalakar_xxxxxxxx..."
          />
        </div>

        <div className={styles.row}>
          <button
            type="button"
            className={`${styles.btn} ${styles.primaryBtn}`}
            onClick={() => handleTest()}
            disabled={connectionState === 'checking'}
          >
            {connectionState === 'checking' ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.secondaryBtn}`}
            onClick={handleGenerateDevKey}
            disabled={isGeneratingKey || connectionState !== 'online'}
            title="Automatically register a dev account and generate an API key"
          >
            {isGeneratingKey ? 'Generating...' : 'Auto-Create Key'}
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.secondaryBtn}`}
            onClick={handleSave}
          >
            Save & Close
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>How to start your backend server</label>
          <div className={styles.commandBox}>
            # In your plug-backend folder:<br />
            python run.py<br />
            # Or with uvicorn:<br />
            uvicorn app.main:app --reload --port 8000
          </div>
        </div>
      </div>
    </Modal>
  );
}
