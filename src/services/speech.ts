/**
 * 音声認識サービス
 *
 * Note: Expo Managed Workflowでは@react-native-voice/voiceが直接使えないため、
 * インターフェースを定義し、Development Build時に実装を差し替える設計
 *
 * 現在はモック実装（テスト用のシミュレーションメソッドを提供）
 */

export type SpeechState = 'idle' | 'listening' | 'processing' | 'error';

type ResultCallback = (transcript: string) => void;
type ErrorCallback = (error: string) => void;
type EndCallback = () => void;

interface SpeechServiceState {
  state: SpeechState;
  transcript: string;
  onResult: ResultCallback | null;
  onError: ErrorCallback | null;
  onEnd: EndCallback | null;
}

const initialState: SpeechServiceState = {
  state: 'idle',
  transcript: '',
  onResult: null,
  onError: null,
  onEnd: null,
};

let currentState: SpeechServiceState = { ...initialState };

/**
 * 音声認識サービス
 */
export const SpeechService = {
  /**
   * 音声認識が利用可能か確認
   * モック実装では常にfalse、実機では実際の状態を返す
   */
  isAvailable(): boolean {
    // TODO: Development Buildで実装時に実際の利用可能性を返す
    return false;
  },

  /**
   * 現在の状態を取得
   */
  getState(): SpeechState {
    return currentState.state;
  },

  /**
   * 現在の認識結果を取得
   */
  getTranscript(): string {
    return currentState.transcript;
  },

  /**
   * 音声認識を開始
   */
  async start(): Promise<boolean> {
    if (currentState.state === 'listening') {
      return false;
    }

    currentState.state = 'listening';
    currentState.transcript = '';
    return true;
  },

  /**
   * 音声認識を停止
   */
  async stop(): Promise<void> {
    currentState.state = 'idle';
  },

  /**
   * 音声認識をキャンセル
   */
  async cancel(): Promise<void> {
    currentState.state = 'idle';
    currentState.transcript = '';
  },

  /**
   * 結果コールバックを設定
   */
  setOnResult(callback: ResultCallback | null): void {
    currentState.onResult = callback;
  },

  /**
   * エラーコールバックを設定
   */
  setOnError(callback: ErrorCallback | null): void {
    currentState.onError = callback;
  },

  /**
   * 終了コールバックを設定
   */
  setOnEnd(callback: EndCallback | null): void {
    currentState.onEnd = callback;
  },

  /**
   * 状態をリセット
   */
  reset(): void {
    currentState = { ...initialState };
  },

  // ========================================
  // テスト用のメソッド（本番では使用しない）
  // ========================================

  /**
   * テスト用: 認識結果をシミュレート
   */
  simulateResult(text: string): void {
    currentState.transcript = text;
    currentState.onResult?.(text);
  },

  /**
   * テスト用: エラーをシミュレート
   */
  simulateError(error: string): void {
    currentState.state = 'error';
    currentState.onError?.(error);
  },

  /**
   * テスト用: 終了をシミュレート
   */
  simulateEnd(): void {
    currentState.state = 'idle';
    currentState.onEnd?.();
  },

  /**
   * テスト用: 認識結果を設定
   */
  setTranscript(text: string): void {
    currentState.transcript = text;
  },
};
