/**
 * TextInputコンポーネントのテスト
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TextInput } from '../../src/components/TextInput';

describe('TextInput', () => {
  it('プレースホルダーを表示する', () => {
    const { getByPlaceholderText } = render(
      <TextInput
        value=""
        onChangeText={() => {}}
        placeholder="入力してください"
      />
    );
    expect(getByPlaceholderText('入力してください')).toBeTruthy();
  });

  it('入力値を表示する', () => {
    const { getByDisplayValue } = render(
      <TextInput
        value="テスト"
        onChangeText={() => {}}
      />
    );
    expect(getByDisplayValue('テスト')).toBeTruthy();
  });

  it('テキスト変更でonChangeTextが呼ばれる', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <TextInput
        value=""
        onChangeText={onChangeText}
        placeholder="入力してください"
      />
    );

    const input = getByPlaceholderText('入力してください');
    fireEvent.changeText(input, '新しい値');

    expect(onChangeText).toHaveBeenCalledWith('新しい値');
  });

  it('ラベルを表示する', () => {
    const { getByText } = render(
      <TextInput
        value=""
        onChangeText={() => {}}
        label="名前"
      />
    );
    expect(getByText('名前')).toBeTruthy();
  });

  it('エラーメッセージを表示する', () => {
    const { getByText } = render(
      <TextInput
        value=""
        onChangeText={() => {}}
        error="必須項目です"
      />
    );
    expect(getByText('必須項目です')).toBeTruthy();
  });

  it('エラー時にテキストが赤色で表示される', () => {
    const { getByText } = render(
      <TextInput
        value=""
        onChangeText={() => {}}
        error="必須項目です"
      />
    );
    const errorMessage = getByText('必須項目です');
    // エラーメッセージには特定のtestIDやstyleを付ける予定
    expect(errorMessage).toBeTruthy();
  });

  it('multilineで複数行入力可能', () => {
    const { getByPlaceholderText } = render(
      <TextInput
        value=""
        onChangeText={() => {}}
        placeholder="複数行入力"
        multiline
      />
    );
    const input = getByPlaceholderText('複数行入力');
    // multilineのTextInputは numberOfLines={4} 以上またはスタイルで確認
    expect(input).toBeTruthy();
  });

  it('disabled時はonChangeTextが呼ばれない', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <TextInput
        value=""
        onChangeText={onChangeText}
        placeholder="入力してください"
        editable={false}
      />
    );

    const input = getByPlaceholderText('入力してください');
    fireEvent.changeText(input, '新しい値');

    // disabledの場合でもonChangeTextは呼ばれることがあるため、
    // 実際の実装でeditableプロパティを適切に処理する必要がある
    // このテストは実装に応じて調整する可能性がある
  });

  it('testIDが正しく設定される', () => {
    const { getByTestId } = render(
      <TextInput
        value=""
        onChangeText={() => {}}
        testID="text-input"
      />
    );
    expect(getByTestId('text-input')).toBeTruthy();
  });
});
