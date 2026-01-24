import type { ReactNode } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

type Props = {
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
  placeholder: string;
  onClear?: () => void;
};

export function Search({ isLoading, query, setQuery, placeholder, onClear }: Props): ReactNode {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        editable={!isLoading}
        autoCorrect={false}
        value={query}
        onChangeText={setQuery}
        placeholder={placeholder}
      />
      <Text style={styles.closeText} onPress={() => onClear?.()}>
        X
      </Text>
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
    color: '#333',
    fontWeight: '700',
    padding: 10,
    textAlign: 'right',
  },
});
