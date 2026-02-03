import type { ReactNode } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';

type Props = TextInputProps & {
  onClear?: () => void;
};

export function Search({ onClear, style, ...textInputProps }: Props): ReactNode {
  return (
    <View style={styles.row}>
      <TextInput style={[style, styles.input]} {...textInputProps} />
      {textInputProps.value && onClear ? (
        <Text style={styles.closeText} onPress={() => onClear()}>
          X
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
  },
  closeText: {
    borderColor: '#999',
    fontWeight: '700',
    textAlign: 'center',
    paddingRight: 10,
  },
});
