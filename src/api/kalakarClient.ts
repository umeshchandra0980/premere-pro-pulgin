/**
 * Kalakar Backend API Client
 * Connects the Premiere Pro UXP Plugin to the Kalakar Backend service
 * (https://github.com/umeshreddyB/plug-backend.git)
 */

export interface BackendConfig {
  baseUrl: string;
  apiKey: string;
}

export interface HealthResponse {
  status: string;
  service?: string;
  database?: string;
  env?: string;
  error?: string;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
}

export interface BackendWord {
  id: string;
  word_index: number;
  word_text: string;
  start_time: number;
  end_time: number;
  confidence: number;
  is_low_confidence: boolean;
}

export interface BackendSegment {
  id: string;
  segment_index: number;
  start_time: number;
  end_time: number;
  raw_text: string;
  is_edited: boolean;
  words: BackendWord[];
}

export interface BackendCaptionsResponse {
  job_id: string;
  total_segments: number;
  segments: BackendSegment[];
}

export interface BackendTemplate {
  id: string;
  name: string;
  font_family: string;
  font_size: number;
  font_color: string;
  background_color?: string;
  position: string;
  alignment: string;
  is_default: boolean;
}

export interface BackendProject {
  id: string;
  name: string;
  created_at: string;
}

const STORAGE_KEY_URL = 'kalakar_backend_url';
const STORAGE_KEY_KEY = 'kalakar_api_key';
export const RENDER_BACKEND_URL = 'https://plug-backend-jsfa.onrender.com';
export const LOCAL_BACKEND_URL = 'http://127.0.0.1:8000';
const DEFAULT_URL = RENDER_BACKEND_URL;

class KalakarApiClient {
  private baseUrl: string = DEFAULT_URL;
  private apiKey: string = '';

  constructor() {
    this.loadConfig();
  }

  public loadConfig(): BackendConfig {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        this.baseUrl =
          localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_URL;
        this.apiKey = localStorage.getItem(STORAGE_KEY_KEY) || '';
      }
    } catch (e) {
      console.warn('[KalakarClient] LocalStorage unavailable:', e);
    }
    return { baseUrl: this.baseUrl, apiKey: this.apiKey };
  }

  public setConfig(config: Partial<BackendConfig>): void {
    if (config.baseUrl !== undefined) {
      this.baseUrl = config.baseUrl.replace(/\/+$/, '');
      try {
        localStorage.setItem(STORAGE_KEY_URL, this.baseUrl);
      } catch {}
    }
    if (config.apiKey !== undefined) {
      this.apiKey = config.apiKey.trim();
      try {
        localStorage.setItem(STORAGE_KEY_KEY, this.apiKey);
      } catch {}
    }
  }

  public getConfig(): BackendConfig {
    return { baseUrl: this.baseUrl, apiKey: this.apiKey };
  }

  private getHeaders(contentType = 'application/json'): HeadersInit {
    const headers: Record<string, string> = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    return headers;
  }

  /** Check server health (no auth required) */
  public async checkHealth(overrideUrl?: string): Promise<HealthResponse> {
    const targetUrl = (overrideUrl || this.baseUrl).replace(/\/+$/, '');
    try {
      const res = await fetch(`${targetUrl}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        return {
          status: 'error',
          error: `HTTP ${res.status}: ${res.statusText}`,
        };
      }
      const data = await res.json();
      return data;
    } catch (err: any) {
      return {
        status: 'offline',
        error: err.message || 'Cannot reach backend server. Is it running on ' + targetUrl + '?',
      };
    }
  }

  /** Verify API key */
  public async getMe(): Promise<{ ok: boolean; user?: BackendUser; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/v1/auth/me`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        const errorText = await res.text();
        return { ok: false, error: `Auth failed (${res.status}): ${errorText}` };
      }
      const user = await res.json();
      return { ok: true, user };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Network request failed' };
    }
  }

  /** Quick Register for development */
  public async registerUser(email: string, name: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/v1/auth/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Register failed (${res.status}): ${text}`);
    }
    return res.json();
  }

  /** Create new API Key */
  public async createApiKey(keyName = 'premiere-pro-plugin'): Promise<string> {
    const res = await fetch(`${this.baseUrl}/v1/auth/api-keys`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name: keyName }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to create API key (${res.status}): ${text}`);
    }
    const data = await res.json();
    return data.raw_key;
  }

  /** List user projects */
  public async listProjects(): Promise<BackendProject[]> {
    const res = await fetch(`${this.baseUrl}/v1/projects`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  }

  /** Fetch captions for a completed job */
  public async getJobCaptions(jobId: string): Promise<BackendCaptionsResponse | null> {
    const res = await fetch(`${this.baseUrl}/v1/jobs/${jobId}/captions`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  }

  /** Update a caption segment text or timing */
  public async patchSegment(
    jobId: string,
    segmentId: string,
    patch: { raw_text?: string; start_time?: number; end_time?: number },
  ): Promise<boolean> {
    const res = await fetch(
      `${this.baseUrl}/v1/jobs/${jobId}/captions/segments/${segmentId}`,
      {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(patch),
      },
    );
    return res.ok;
  }

  /** Fetch style templates */
  public async listTemplates(): Promise<BackendTemplate[]> {
    const res = await fetch(`${this.baseUrl}/v1/templates`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  }

  /** Trigger Export (SRT or template JSON) */
  public async createExport(jobId: string, exportType: 'srt' | 'template_json'): Promise<any> {
    const res = await fetch(`${this.baseUrl}/v1/jobs/${jobId}/exports`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ export_type: exportType }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Export failed: ${text}`);
    }
    return res.json();
  }
}

export const kalakarApi = new KalakarApiClient();
