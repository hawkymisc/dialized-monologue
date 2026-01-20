/**
 * 日付ユーティリティ
 */
import {
  format,
  parseISO,
  isValid,
  startOfDay,
  addDays,
  differenceInDays,
  isAfter,
} from 'date-fns';

/**
 * DateをYYYY-MM-DD形式の文字列に変換
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * DateをISO 8601形式の文字列に変換
 */
export function formatDateTime(date: Date): string {
  return date.toISOString();
}

/**
 * YYYY-MM-DD形式の文字列をDateに変換
 * @throws {Error} 無効な日付形式の場合
 */
export function parseDate(dateString: string): Date {
  // YYYY-MM-DD形式のバリデーション
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    throw new Error(`Invalid date format: ${dateString}. Expected YYYY-MM-DD`);
  }

  // ISO 8601形式としてパース（date-fnsのparseISOは時刻なしの日付もパースできる）
  const date = parseISO(dateString);

  if (!isValid(date)) {
    throw new Error(`Invalid date: ${dateString}`);
  }

  return date;
}

/**
 * 指定された日付が今日かどうかを判定
 * 日付部分（YYYY-MM-DD）で比較する
 */
export function isToday(date: Date | string): boolean {
  const targetDateStr = typeof date === 'string' ? date : formatDate(date);
  const todayStr = formatDate(new Date());
  return targetDateStr === todayStr;
}

/**
 * 開始日から終了日までの日付配列を生成
 * start > end の場合は空配列を返す
 */
export function getDateRange(start: Date, end: Date): string[] {
  const startDay = startOfDay(start);
  const endDay = startOfDay(end);

  // start > end の場合は空配列
  if (isAfter(startDay, endDay)) {
    return [];
  }

  const days = differenceInDays(endDay, startDay) + 1;
  const result: string[] = [];

  for (let i = 0; i < days; i++) {
    const currentDate = addDays(startDay, i);
    result.push(formatDate(currentDate));
  }

  return result;
}

/**
 * エクスポートファイル名を生成
 * 形式: {prefix}_YYYY-MM-DD
 */
export function generateExportFilename(prefix: string): string {
  const today = formatDate(new Date());
  return `${prefix}_${today}`;
}
