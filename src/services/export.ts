/**
 * エクスポートサービス
 */
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { DiaryEntry } from '../types';

/**
 * CSVフィールドをエスケープ
 * RFC 4180 準拠
 */
function escapeCSVField(field: string | number): string {
  // 数値はそのまま返す
  if (typeof field === 'number') {
    return String(field);
  }

  // カンマ、ダブルクォート、改行を含む場合はダブルクォートで囲む
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    // ダブルクォートは2つに重ねてエスケープ
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }

  return field;
}

/**
 * デフォルトのエクスポートファイル名を生成
 */
function generateDefaultFilename(prefix: string, extension: string): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}_${today}.${extension}`;
}

export const ExportService = {
  /**
   * DiaryEntryの配列をJSON文字列に変換
   */
  toJSON(entries: DiaryEntry[]): string {
    return JSON.stringify(entries);
  },

  /**
   * DiaryEntryの配列をCSV文字列に変換
   */
  toCSV(entries: DiaryEntry[]): string {
    const header = 'date,questionText,value,type\n';

    if (entries.length === 0) {
      return header;
    }

    const rows = entries.flatMap(entry =>
      entry.answers.map(answer => {
        const date = escapeCSVField(entry.date);
        const questionText = escapeCSVField(answer.questionText);
        const value = escapeCSVField(answer.value);
        const type = escapeCSVField(answer.type);
        return `${date},${questionText},${value},${type}`;
      })
    );

    return header + rows.join('\n') + '\n';
  },

  /**
   * コンテンツをファイルに書き込む
   */
  async writeToFile(content: string, filename: string): Promise<string> {
    const fileUri = `${(FileSystem as any).cacheDirectory}${filename}`;
    await (FileSystem as any).writeAsStringAsync(fileUri, content, {
      encoding: 'utf8',
    });
    return fileUri;
  },

  /**
   * ファイルを共有
   */
  async shareFile(fileUri: string, mimeType: string): Promise<void> {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('共有機能が利用できません');
    }
    await Sharing.shareAsync(fileUri, { mimeType });
  },

  /**
   * JSON形式でエクスポート
   */
  async exportAsJSON(entries: DiaryEntry[], filename?: string): Promise<void> {
    const fname = filename || generateDefaultFilename('diary', 'json');
    const content = this.toJSON(entries);
    const fileUri = await this.writeToFile(content, fname);
    await this.shareFile(fileUri, 'application/json');
  },

  /**
   * CSV形式でエクスポート
   */
  async exportAsCSV(entries: DiaryEntry[], filename?: string): Promise<void> {
    const fname = filename || generateDefaultFilename('diary', 'csv');
    const content = this.toCSV(entries);
    const fileUri = await this.writeToFile(content, fname);
    await this.shareFile(fileUri, 'text/csv');
  },
};
