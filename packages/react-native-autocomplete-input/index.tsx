import React, { ReactElement } from 'react';
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

function defaultRenderItems<Item>({ item }: ListRenderItemInfo<Item>): React.ReactElement {
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
    renderTextInput: customRenderTextInput = (props) => <TextInput {...props} />,
    flatListProps,
    style,
    ...textInputProps
  } = props;

  function renderResultList(): React.ReactElement {
    const listProps: FlatListProps<Item> = {
      data,
      renderItem: defaultRenderItems,
      keyExtractor: defaultKeyExtractor,
      ...flatListProps,
      style: [styles.list, flatListProps?.style],
    };

    return <ResultList {...listProps} />;
  }

  function renderTextInput(): React.ReactNode {
    const renderProps = {
      ...textInputProps,
      style: [styles.input, style],
      ...(ref && { ref }),
    };

    return customRenderTextInput(renderProps);
  }

  const showResults = data.length > 0;
  onShowResults?.(showResults);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, inputContainerStyle]}>{renderTextInput()}</View>
      {!hideResults && (
        <View
          style={listContainerStyle}
          onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
        >
          {showResults && renderResultList()}
        </View>
      )}
    </View>
  );
}) as <Item, Ref>(
  props: AutocompleteInputProps<Item> & { ref?: React.ForwardedRef<Ref> },
) => ReactElement;

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
