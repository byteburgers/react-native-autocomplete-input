import React from 'react';
import type {
  FlatListProps,
  TextInputProps,
  StyleProp,
  ViewStyle,
  ListRenderItemInfo,
} from 'react-native';
import { FlatList, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

export type AutocompleteInputProps<Item> = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  hideResults?: boolean;
  inputContainerStyle?: StyleProp<ViewStyle>;
  listContainerStyle?: StyleProp<ViewStyle>;
  onShowResults?: (showResults: boolean) => void;
  renderResultList?: React.FC<FlatListProps<Item>>;
  renderTextInput?: React.FC<TextInputProps>;
  flatListProps?: Partial<Omit<FlatListProps<Item>, 'data'>>;
  data: readonly Item[];
};

function defaultKeyExtractor(_: unknown, index: number): string {
  return `key-${index}`;
}

function defaultRenderItem<Item>({ item }: ListRenderItemInfo<Item>): React.ReactElement {
  return <Text>{String(item)}</Text>;
}

export const AutocompleteInput = React.forwardRef(function AutocompleteInputComponent<Item, Ref>(
  props: AutocompleteInputProps<Item>,
  ref: React.ForwardedRef<Ref>,
): React.ReactElement {
  const {
    data,
    containerStyle,
    hideResults,
    inputContainerStyle,
    listContainerStyle,
    onShowResults,
    onStartShouldSetResponderCapture = () => false,
    renderResultList: ResultList = FlatList,
    renderTextInput: AutocompleteTextInput = TextInput,
    flatListProps,
    style,
    ...textInputProps
  } = props;

  function TextInputWrapper(): React.ReactElement {
    const autocompleteTextInputProps = {
      ...textInputProps,
      style: [styles.input, style],
      ref,
    };

    return (
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <AutocompleteTextInput {...autocompleteTextInputProps} />;
      </View>
    );
  }

  function ResultListWrapper(): React.ReactElement | null {
    const resultListProps: FlatListProps<Item> = {
      data,
      renderItem: defaultRenderItem,
      keyExtractor: defaultKeyExtractor,
      ...flatListProps,
      style: [styles.list, flatListProps?.style],
    };

    const showResults = data.length > 0;
    onShowResults?.(showResults);

    const doNotShowResults = hideResults || !showResults;
    if (doNotShowResults) {
      return null;
    }

    return (
      <View
        style={listContainerStyle}
        onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
      >
        <ResultList {...resultListProps} />;
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInputWrapper />
      <ResultListWrapper />
    </View>
  );
});

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1,
};

const androidStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3,
  },
  inputContainer: {
    ...border,
    marginBottom: 0,
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    margin: 10,
    marginTop: 0,
  },
});

const iosStyles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  inputContainer: {
    ...border,
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3,
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
});

const styles = StyleSheet.create({
  ...Platform.select({
    android: androidStyles as unknown as typeof iosStyles,
    ios: iosStyles,
    default: iosStyles,
  }),
});

export default AutocompleteInput;
