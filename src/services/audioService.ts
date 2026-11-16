export class AudioService {
  private static recognition: any = null;
  private static isListening: boolean = false;

  /**
   * Speaks given text using browser SpeechSynthesis with natural rate and pitch
   */
  public static speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    rate = 1.0,
    pitch = 1.0
  ): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Clean markdown syntax from text before speaking
    const cleanText = text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\$\$[\s\S]*?\$\$/g, 'mathematical equation')
      .replace(/\$[^\$]*?\$/g, 'formula');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Aaron'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Initializes Speech Recognition for hands-free audio answering
   */
  public static startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript + ' ';
        }
        onResult(fullTranscript.trim());
      };

      recog.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (onError) onError(event.error);
      };

      recog.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      recog.start();
      this.recognition = recog;
      this.isListening = true;
      return true;
    } catch (err: any) {
      if (onError) onError(err?.message || 'Could not start microphone');
      return false;
    }
  }

  public static stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
    }
  }

  public static isSupported(): { speechToText: boolean; textToSpeech: boolean } {
    const hasSTT = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    const hasTTS = 'speechSynthesis' in window;
    return { speechToText: hasSTT, textToSpeech: hasTTS };
  }
}
