import type { ReactNode } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';

type Props = TextInputProps & {
  onClear?: () => void;
};

export function Search({ onClear, style, ...textInputProps }: Props): ReactNode {
  return (
    <View style={styles.row}>
      <TextInput style={[style, styles.input]} {...textInputProps} />
      {textInputProps.value && onClear ? (
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => onClear()}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Text style={styles.closeBtnText}>×</Text>
        </TouchableOpacity>
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
  closeBtn: {
    paddingRight: 10,
  },
  closeBtnText: {
    fontWeight: '700',
    fontSize: 18,
  },
});
