import React from 'react';
import type {
  FlatListProps,
  TextInputProps,
  StyleProp,
  ViewStyle,
  ListRenderItem,
} from 'react-native';
import PropTypes from 'prop-types';
import { FlatList, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

export type AutocompleteInputProps<T> = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  hideResults?: boolean;
  inputContainerStyle?: StyleProp<ViewStyle>;
  listContainerStyle?: StyleProp<ViewStyle>;
  onShowResults?: (showResults: boolean) => void;
  renderResultList?: (props: FlatListProps<T>) => React.ReactElement;
  renderTextInput?: (props: TextInputProps) => React.ReactElement;
  flatListProps?: Partial<Omit<FlatListProps<T>, 'data'>>;
  data: readonly T[];
};

function defaultKeyExtractor(_: unknown, index: number): string {
  return `key-${index}`;
}

function DefaultResultList<T>(props: FlatListProps<T>): React.ReactElement {
  return <FlatList {...props} />;
}

function DefaultTextInput(props: TextInputProps): React.ReactElement {
  return <TextInput {...props} />;
}

export const AutocompleteInput = React.forwardRef(function AutocompleteInputComponent<Item, Ref>(
  props: AutocompleteInputProps<Item>,
  ref: React.ForwardedRef<Ref>,
): React.ReactElement {
  const defaultRenderItems: ListRenderItem<Item> = ({ item }) => <Text>{String(item)}</Text>;

  const {
    data,
    containerStyle,
    hideResults,
    inputContainerStyle,
    listContainerStyle,
    onShowResults,
    onStartShouldSetResponderCapture = () => false,
    renderResultList: renderResultListFunction = DefaultResultList,
    renderTextInput: renderTextInputFunction = DefaultTextInput,
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

    return renderResultListFunction(listProps);
  }

  function renderTextInput() {
    const renderProps = {
      ...textInputProps,
      style: [styles.input, style],
      ref,
    };

    return renderTextInputFunction(renderProps);
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
