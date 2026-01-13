/**
 * 音声認識サービスのテスト
 *
 * TDD: RED -> GREEN -> REFACTOR
 *
 * Note: Expo Managed Workflowでは@react-native-voice/voiceが使えないため、
 * インターフェースを定義し、将来の実装に備える
 */

import { SpeechService, SpeechState } from '../../src/services/speech';

describe('SpeechService', () => {
  beforeEach(() => {
    SpeechService.reset();
  });

  describe('initial state', () => {
    it('should have idle state initially', () => {
      expect(SpeechService.getState()).toBe('idle');
    });

    it('should have empty transcript initially', () => {
      expect(SpeechService.getTranscript()).toBe('');
    });

    it('should not be available by default (mock implementation)', () => {
      // モック実装では利用不可、実機では利用可能になる
      expect(SpeechService.isAvailable()).toBe(false);
    });
  });

  describe('start', () => {
    it('should change state to listening when started', async () => {
      await SpeechService.start();
      expect(SpeechService.getState()).toBe('listening');
    });

    it('should return false if already listening', async () => {
      await SpeechService.start();
      const result = await SpeechService.start();
      expect(result).toBe(false);
    });
  });

  describe('stop', () => {
    it('should change state to idle when stopped', async () => {
      await SpeechService.start();
      await SpeechService.stop();
      expect(SpeechService.getState()).toBe('idle');
    });
  });

  describe('cancel', () => {
    it('should cancel listening and clear transcript', async () => {
      await SpeechService.start();
      SpeechService.setTranscript('テスト'); // テスト用のセッター
      await SpeechService.cancel();

      expect(SpeechService.getState()).toBe('idle');
      expect(SpeechService.getTranscript()).toBe('');
    });
  });

  describe('event listeners', () => {
    it('should call onResult callback when transcript is updated', async () => {
      const onResult = jest.fn();
      SpeechService.setOnResult(onResult);

      await SpeechService.start();
      SpeechService.simulateResult('こんにちは'); // テスト用のシミュレーター

      expect(onResult).toHaveBeenCalledWith('こんにちは');
    });

    it('should call onError callback when error occurs', async () => {
      const onError = jest.fn();
      SpeechService.setOnError(onError);

      await SpeechService.start();
      SpeechService.simulateError('Recognition failed');

      expect(onError).toHaveBeenCalledWith('Recognition failed');
      expect(SpeechService.getState()).toBe('error');
    });

    it('should call onEnd callback when recognition ends', async () => {
      const onEnd = jest.fn();
      SpeechService.setOnEnd(onEnd);

      await SpeechService.start();
      SpeechService.simulateEnd();

      expect(onEnd).toHaveBeenCalled();
      expect(SpeechService.getState()).toBe('idle');
    });
  });

  describe('reset', () => {
    it('should reset all state and callbacks', async () => {
      const onResult = jest.fn();
      SpeechService.setOnResult(onResult);
      await SpeechService.start();
      SpeechService.setTranscript('テスト');

      SpeechService.reset();

      expect(SpeechService.getState()).toBe('idle');
      expect(SpeechService.getTranscript()).toBe('');
    });
  });
});
