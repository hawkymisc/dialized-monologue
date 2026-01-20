/**
 * エクスポートサービスのテスト
 */
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ExportService } from '../../src/services/export';
import type { DiaryEntry } from '../../src/types';

// モックされた関数の型
const writeAsStringAsync = (FileSystem as any).writeAsStringAsync as jest.Mock;
const cacheDirectory = (FileSystem as any).cacheDirectory as string;

describe('ExportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('toJSON', () => {
    it('空配列で空のJSON配列を返す', () => {
      const result = ExportService.toJSON([]);
      expect(result).toBe('[]');
    });

    it('単一エントリーで全フィールドを含むJSONを返す', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '今日の気分は？', value: 4, type: 'rating' }
        ]
      };

      const result = ExportService.toJSON([entry]);
      const parsed = JSON.parse(result);

      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(entry);
    });

    it('複数エントリーで複数要素の配列JSONを返す', () => {
      const entry1: DiaryEntry = {
        id: 'test-id-1',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: []
      };
      const entry2: DiaryEntry = {
        id: 'test-id-2',
        date: '2025-01-21',
        createdAt: '2025-01-21T21:00:00.000Z',
        updatedAt: '2025-01-21T21:00:00.000Z',
        answers: []
      };

      const result = ExportService.toJSON([entry1, entry2]);
      const parsed = JSON.parse(result);

      expect(parsed).toHaveLength(2);
      expect(parsed[0]).toEqual(entry1);
      expect(parsed[1]).toEqual(entry2);
    });

    it('日本語を含むエントリーで日本語が保持される', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '今日の気分は？', value: '最高でした！', type: 'text' }
        ]
      };

      const result = ExportService.toJSON([entry]);
      const parsed = JSON.parse(result);

      expect(parsed[0].answers[0].value).toBe('最高でした！');
      expect(parsed[0].answers[0].questionText).toBe('今日の気分は？');
    });
  });

  describe('toCSV', () => {
    it('空配列でヘッダーのみのCSVを返す', () => {
      const result = ExportService.toCSV([]);
      expect(result).toBe('date,questionText,value,type\n');
    });

    it('単一回答でCSV変換する', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '気分', value: 4, type: 'rating' }
        ]
      };

      const result = ExportService.toCSV([entry]);
      const lines = result.split('\n');

      expect(lines[0]).toBe('date,questionText,value,type');
      expect(lines[1]).toBe('2025-01-20,気分,4,rating');
    });

    it('複数回答でCSV変換する（フラット化）', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '気分', value: 4, type: 'rating' },
          { questionId: 'q2', questionText: '出来事', value: '良い日', type: 'text' },
          { questionId: 'q3', questionText: '感想', value: 5, type: 'rating' }
        ]
      };

      const result = ExportService.toCSV([entry]);
      const lines = result.split('\n').filter((line: string) => line.length > 0);

      expect(lines).toHaveLength(4); // ヘッダー + 3データ行
      expect(lines[1]).toBe('2025-01-20,気分,4,rating');
      expect(lines[2]).toBe('2025-01-20,出来事,良い日,text');
      expect(lines[3]).toBe('2025-01-20,感想,5,rating');
    });

    it('カンマを含む回答をダブルクォートで囲む', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '感想', value: '今日は,良い日だった', type: 'text' }
        ]
      };

      const result = ExportService.toCSV([entry]);
      expect(result).toContain('"今日は,良い日だった"');
    });

    it('ダブルクォートを含む回答をエスケープする', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '感想', value: '彼は"すごい"と言った', type: 'text' }
        ]
      };

      const result = ExportService.toCSV([entry]);
      expect(result).toContain('"彼は""すごい""と言った"');
    });

    it('改行を含む回答をダブルクォートで囲む', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '感想', value: '1行目\n2行目', type: 'text' }
        ]
      };

      const result = ExportService.toCSV([entry]);
      expect(result).toContain('"1行目\n2行目"');
    });

    it('rating型の数値はクォートなしで出力する', () => {
      const entry: DiaryEntry = {
        id: 'test-id',
        date: '2025-01-20',
        createdAt: '2025-01-20T21:00:00.000Z',
        updatedAt: '2025-01-20T21:00:00.000Z',
        answers: [
          { questionId: 'q1', questionText: '気分', value: 4, type: 'rating' }
        ]
      };

      const result = ExportService.toCSV([entry]);
      const lines = result.split('\n');
      // 数値はクォートなし
      expect(lines[1]).toBe('2025-01-20,気分,4,rating');
    });
  });

  describe('writeToFile', () => {
    it('キャッシュディレクトリにファイルを書き込む', async () => {
      const content = 'test content';
      const filename = 'test.json';
      const expectedUri = 'file:///cache/test.json';

      (writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);

      const result = await ExportService.writeToFile(content, filename);

      expect(writeAsStringAsync).toHaveBeenCalledWith(
        expectedUri,
        content,
        { encoding: 'utf8' }
      );
      expect(result).toBe(expectedUri);
    });
  });

  describe('shareFile', () => {
    it('共有可能な場合に共有シートを表示する', async () => {
      const fileUri = 'file:///cache/test.json';
      const mimeType = 'application/json';

      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

      await ExportService.shareFile(fileUri, mimeType);

      expect(Sharing.isAvailableAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalledWith(fileUri, { mimeType });
    });

    it('共有不可の場合にエラーをスローする', async () => {
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      await expect(
        ExportService.shareFile('file://test', 'application/json')
      ).rejects.toThrow('共有機能が利用できません');
    });
  });

  describe('exportAsJSON', () => {
    it('JSONエクスポートの統合テスト', async () => {
      const entries: DiaryEntry[] = [
        {
          id: 'test-id',
          date: '2025-01-20',
          createdAt: '2025-01-20T21:00:00.000Z',
          updatedAt: '2025-01-20T21:00:00.000Z',
          answers: []
        }
      ];

      (writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

      await ExportService.exportAsJSON(entries);

      expect(writeAsStringAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalledWith(
        expect.stringContaining('diary_'),
        { mimeType: 'application/json' }
      );
    });

    it('カスタムファイル名を使用する', async () => {
      const entries: DiaryEntry[] = [];
      const customFilename = 'my-diary.json';

      (writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

      await ExportService.exportAsJSON(entries, customFilename);

      expect(Sharing.shareAsync).toHaveBeenCalledWith(
        expect.stringContaining(customFilename),
        { mimeType: 'application/json' }
      );
    });
  });

  describe('exportAsCSV', () => {
    it('CSVエクスポートの統合テスト', async () => {
      const entries: DiaryEntry[] = [
        {
          id: 'test-id',
          date: '2025-01-20',
          createdAt: '2025-01-20T21:00:00.000Z',
          updatedAt: '2025-01-20T21:00:00.000Z',
          answers: [
            { questionId: 'q1', questionText: '気分', value: 4, type: 'rating' }
          ]
        }
      ];

      (writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

      await ExportService.exportAsCSV(entries);

      expect(writeAsStringAsync).toHaveBeenCalled();
      expect(Sharing.shareAsync).toHaveBeenCalledWith(
        expect.stringContaining('diary_'),
        { mimeType: 'text/csv' }
      );
    });

    it('CSVのMIMEタイプがtext/csvである', async () => {
      const entries: DiaryEntry[] = [];

      (writeAsStringAsync as jest.Mock).mockResolvedValue(undefined);
      (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);

      await ExportService.exportAsCSV(entries);

      expect(Sharing.shareAsync).toHaveBeenCalledWith(
        expect.any(String),
        { mimeType: 'text/csv' }
      );
    });
  });
});
