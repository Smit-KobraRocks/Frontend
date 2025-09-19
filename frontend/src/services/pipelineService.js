import { EnvironmentConfig } from '../config/environment';

const PIPELINE_ENDPOINT = '/pipelines/parse';

// Lightweight service that encapsulates all pipeline API communication.

export class PipelineService {
  constructor({ apiBaseUrl = EnvironmentConfig.API_BASE_URL } = {}) {
    this.apiBaseUrl = apiBaseUrl;
  }

  async submitPipeline(payload) {
    const response = await fetch(`${this.apiBaseUrl}${PIPELINE_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Pipeline submission failed with status ${response.status}`);
    }

    return response.json();
  }
}

export const pipelineService = new PipelineService();
