export interface SpeechRecognitionPlugin {
  available(): Promise<{ available: boolean }>;
  start(options?: {
    language?: string;
    maxResults?: number;
    prompt?: string;
    partialResults?: boolean;
    popup?: boolean;
  }): Promise<{ matches: string[] }>;
  stop(): Promise<void>;
  getSupportedLanguages(): Promise<{ languages: string[] }>;
  hasPermission(): Promise<{ permission: boolean }>;
  requestPermission(): Promise<void>;
}

/**
 * Universal voice listener supporting Web Speech API (Chrome/Android WebView)
 * and falling back gracefully if not supported.
 */
export function startVoiceRecognition(
  onResult: (text: string) => void,
  onError: (err: string) => void,
  onEnd: () => void,
  lang: string = 'en-IN'
): { stop: () => void } {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition not supported on this browser/device.');
    onEnd();
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = lang; // 'en-IN', 'hi-IN', or 'mr-IN'
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      onError(event.error || 'Speech recognition failed');
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch {
          // ignore
        }
      },
    };
  } catch (err: any) {
    onError(err.message || 'Could not start voice recognition');
    onEnd();
    return { stop: () => {} };
  }
}
