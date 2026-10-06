import type { Caption, CaptionWord } from '../types/caption';
import type { BackendCaptionsResponse, BackendSegment, BackendWord } from './kalakarClient';

export function mapBackendCaptionsToFrontend(response: BackendCaptionsResponse): Caption[] {
  return response.segments.map((segment: BackendSegment): Caption => ({
    id: segment.id,
    startTime: segment.start_time,
    endTime: segment.end_time,
    is_edited: segment.is_edited,
    words: segment.words.map((word: BackendWord): CaptionWord => ({
      id: word.id,
      text: word.word_text,
      start: word.start_time,
      end: word.end_time,
      confidence: word.confidence,
      is_low_confidence: word.is_low_confidence,
    })),
  }));
}
