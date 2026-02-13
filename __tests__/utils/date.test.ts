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

    describe('境界値・異常系', () => {
      it('"2024-02-30" は形式は正しいが日付として無効でエラーをスローする', () => {
        expect(() => parseDate('2024-02-30')).toThrow('Invalid date');
      });

      it('"2024-13-01" は月が13で無効でエラーをスローする', () => {
        expect(() => parseDate('2024-13-01')).toThrow('Invalid date');
      });

      it('"2024-00-01" は月が0で無効でエラーをスローする', () => {
        expect(() => parseDate('2024-00-01')).toThrow('Invalid date');
      });

      it('"2024-01-32" は日が32で無効でエラーをスローする', () => {
        expect(() => parseDate('2024-01-32')).toThrow('Invalid date');
      });

      it('"2023-02-29" は閏年ではないためエラーをスローする', () => {
        expect(() => parseDate('2023-02-29')).toThrow('Invalid date');
      });

      it('"2024-02-29" は閏年なので正常にパースされる', () => {
        const date = parseDate('2024-02-29');
        expect(date).toBeInstanceOf(Date);
        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(1); // 0-indexed
        expect(date.getDate()).toBe(29);
      });

      it('"0000-01-01" は年が0でも動作する', () => {
        const date = parseDate('0000-01-01');
        expect(date).toBeInstanceOf(Date);
      });

      it('"9999-12-31" は最大日付で正常にパースされる', () => {
        const date = parseDate('9999-12-31');
        expect(date).toBeInstanceOf(Date);
        expect(date.getFullYear()).toBe(9999);
        expect(date.getMonth()).toBe(11);
        expect(date.getDate()).toBe(31);
      });
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
      // ローカルタイムゾーンで2025-01-20にセット
      jest.setSystemTime(new Date(2025, 0, 20, 12, 0, 0));
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
