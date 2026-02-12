/**
 * ナビゲーション型定義テスト
 * RootStackParamListの型安全性を検証
 */
import type { RootStackParamList } from '../../src/types/navigation';

describe('RootStackParamList', () => {
  describe('型定義', () => {
    it('Home画面はパラメータなし（undefined）', () => {
      const params: RootStackParamList['Home'] = undefined;
      expect(params).toBeUndefined();
    });

    it('DiaryInput画面はパラメータなし（undefined）', () => {
      const params: RootStackParamList['DiaryInput'] = undefined;
      expect(params).toBeUndefined();
    });

    it('DiaryDetail画面はentryIdパラメータを持つ', () => {
      const params: RootStackParamList['DiaryDetail'] = { entryId: 'entry-123' };
      expect(params.entryId).toBe('entry-123');
    });

    it('Settings画面はパラメータなし（undefined）', () => {
      const params: RootStackParamList['Settings'] = undefined;
      expect(params).toBeUndefined();
    });
  });

  describe('DiaryDetail パラメータ', () => {
    it('entryIdは文字列型である', () => {
      const params: RootStackParamList['DiaryDetail'] = { entryId: 'test-id' };
      expect(typeof params.entryId).toBe('string');
    });

    it('空文字列のentryIdも型として有効', () => {
      const params: RootStackParamList['DiaryDetail'] = { entryId: '' };
      expect(params.entryId).toBe('');
    });
  });
});
