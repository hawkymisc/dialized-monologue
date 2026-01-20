/**
 * 日付ユーティリティのテスト
 */
import {
  formatDate,
  formatDateTime,
  parseDate,
  isToday,
  getDateRange,
  generateExportFilename,
} from '../../src/utils/date';

describe('date utils', () => {
  describe('formatDate', () => {
    it('DateをYYYY-MM-DD形式に変換する', () => {
      const date = new Date(2025, 0, 20); // 2025年1月20日
      expect(formatDate(date)).toBe('2025-01-20');
    });

    it('月を0埋めする', () => {
      const date = new Date(2025, 0, 5); // 2025年1月5日
      expect(formatDate(date)).toBe('2025-01-05');
    });

    it('日を0埋めする', () => {
      const date = new Date(2025, 11, 9); // 2025年12月9日
      expect(formatDate(date)).toBe('2025-12-09');
    });
  });

  describe('formatDateTime', () => {
    it('DateをISO 8601形式に変換する', () => {
      const date = new Date('2025-01-20T21:00:00.000Z');
      const result = formatDateTime(date);
      expect(result).toBe('2025-01-20T21:00:00.000Z');
    });

    it('異なるタイムゾーンでも正しくフォーマットする', () => {
      const date = new Date(Date.UTC(2025, 0, 20, 12, 30, 45, 123));
      const result = formatDateTime(date);
      expect(result).toBe('2025-01-20T12:30:45.123Z');
    });
  });

  describe('parseDate', () => {
    it('YYYY-MM-DD文字列をDateに変換する', () => {
      const result = parseDate('2025-01-20');
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(0); // 0-indexed
      expect(result.getDate()).toBe(20);
    });

    it('無効な形式でエラーをスローする', () => {
      expect(() => parseDate('invalid')).toThrow();
    });

    it('空文字でエラーをスローする', () => {
      expect(() => parseDate('')).toThrow();
    });

    it('部分的に正しい形式でもエラーをスローする', () => {
      expect(() => parseDate('2025-01')).toThrow();
    });
  });

  describe('isToday', () => {
    // テストの一貫性のため、現在時刻をモック
    beforeAll(() => {
      jest.useFakeTimers();
      // ローカルタイムゾーンで2025-01-20にセット
      jest.setSystemTime(new Date(2025, 0, 20, 12, 0, 0));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('今日のDateでtrueを返す', () => {
      const today = new Date(2025, 0, 20, 15, 0, 0);
      expect(isToday(today)).toBe(true);
    });

    it('今日の文字列でtrueを返す', () => {
      expect(isToday('2025-01-20')).toBe(true);
    });

    it('昨日でfalseを返す', () => {
      const yesterday = new Date(2025, 0, 19, 12, 0, 0);
      expect(isToday(yesterday)).toBe(false);
    });

    it('明日でfalseを返す', () => {
      const tomorrow = new Date(2025, 0, 21, 12, 0, 0);
      expect(isToday(tomorrow)).toBe(false);
    });

    it('文字列形式の昨日でfalseを返す', () => {
      expect(isToday('2025-01-19')).toBe(false);
    });
  });

  describe('getDateRange', () => {
    it('期間内の日付リストを返す', () => {
      const start = new Date(2025, 0, 1); // 2025-01-01
      const end = new Date(2025, 0, 3);   // 2025-01-03
      const result = getDateRange(start, end);
      expect(result).toEqual(['2025-01-01', '2025-01-02', '2025-01-03']);
    });

    it('同日の範囲で1要素の配列を返す', () => {
      const date = new Date(2025, 0, 1);
      const result = getDateRange(date, date);
      expect(result).toEqual(['2025-01-01']);
    });

    it('start > end の場合は空配列を返す', () => {
      const start = new Date(2025, 0, 3);
      const end = new Date(2025, 0, 1);
      const result = getDateRange(start, end);
      expect(result).toEqual([]);
    });

    it('月をまたぐ範囲でも正しく動作する', () => {
      const start = new Date(2025, 0, 30); // 2025-01-30
      const end = new Date(2025, 1, 2);    // 2025-02-02
      const result = getDateRange(start, end);
      expect(result).toEqual([
        '2025-01-30',
        '2025-01-31',
        '2025-02-01',
        '2025-02-02',
      ]);
    });
  });

  describe('generateExportFilename', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-01-20T12:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('プレフィックスと日付を含むファイル名を生成する', () => {
      const result = generateExportFilename('diary');
      expect(result).toBe('diary_2025-01-20');
    });

    it('異なるプレフィックスでも動作する', () => {
      const result = generateExportFilename('backup');
      expect(result).toBe('backup_2025-01-20');
    });
  });
});
