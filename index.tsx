import React from 'react';
import type {
  FlatListProps,
  TextInputProps,
  StyleProp,
  ViewStyle,
  ListRenderItemInfo,
} from 'react-native';
import PropTypes from 'prop-types';
import { FlatList, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

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

  function ResultListWrapper(): React.ReactElement {
    const resultListProps: FlatListProps<Item> = {
      data,
      renderItem: defaultRenderItem,
      keyExtractor: defaultKeyExtractor,
      ...flatListProps,
      style: [styles.list, flatListProps?.style],
    };

    return <ResultList {...resultListProps} />;
  }

  function TextInputWrapper(): React.ReactElement {
    const autocompleteTextInputProps = {
      ...textInputProps,
      style: [styles.input, style],
      ref,
    };

    return <AutocompleteTextInput {...autocompleteTextInputProps} />;
  }

  const showResults = data.length > 0;
  onShowResults?.(showResults);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, inputContainerStyle]}>
        <TextInputWrapper />
      </View>
      {!hideResults && (
        <View
          style={listContainerStyle}
          onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
        >
          {showResults && <ResultListWrapper />}
        </View>
      )}
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

AutocompleteInput.propTypes = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...TextInput.propTypes,
  /**
   * These styles will be applied to the container which
   * surrounds the autocomplete component.
   */
  containerStyle: ViewPropTypes ? ViewPropTypes.style : PropTypes.object,
  /**
   * Assign an array of data objects which should be
   * rendered in respect to the entered text.
   */
  data: PropTypes.array,
  /**
   * Props which can be applied to result `FlatList`.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  flatListProps: FlatList.propTypes || PropTypes.object,
  /**
   * Set to `true` to hide the suggestion list.
   */
  hideResults: PropTypes.bool,
  /**
   * These styles will be applied to the container which surrounds
   * the textInput component.
   */
  inputContainerStyle: ViewPropTypes ? ViewPropTypes.style : PropTypes.object,
  /**
   * These style will be applied to the result list.
   */
  listContainerStyle: ViewPropTypes ? ViewPropTypes.style : PropTypes.object,
  /**
   * `onShowResults` will be called when list is going to
   * show/hide results.
   */
  onShowResults: PropTypes.func,
  /**
   * `onShowResults` will be called when list is going to
   * show/hide results.
   */
  onStartShouldSetResponderCapture: PropTypes.func,
  /**
   * renders custom TextInput. All props passed to this function.
   */
  renderTextInput: PropTypes.func,
  /**
   * renders custom result list. Can be used to replace FlatList.
   * All props passed to this function.
   */
  renderResultList: PropTypes.func,
};
