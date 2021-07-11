import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Platform, StyleSheet, Text, TextInput, View, ViewPropTypes } from 'react-native';

export const AutocompleteInput = (props) => {
  function renderResultList(data, listProps) {
    const { style, ...flatListProps } = listProps;

    return <FlatList data={data} style={[styles.list, style]} {...flatListProps} />;
  }

  function renderTextInput() {
    const { renderTextInput: renderFunction, style } = props;
    const textProps = {
      style: [styles.input, style],
      ...props,
    };

    return renderFunction(textProps);
  }

  const {
    data,
    containerStyle,
    hideResults,
    inputContainerStyle,
    listContainerStyle,
    onShowResults,
    onStartShouldSetResponderCapture,
    flatListProps,
  } = props;

  const showResults = data.length > 0;
  // Notify listener if the suggestion will be shown.
  onShowResults && onShowResults(showResults);
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.inputContainer, inputContainerStyle]}>{renderTextInput(props)}</View>
      {!hideResults && (
        <View
          style={listContainerStyle}
          onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
        >
          {showResults && renderResultList(data, flatListProps)}
        </View>
      )}
    </View>
  );
};

AutocompleteInput.propTypes = {
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
};

const defaultKeyExtractor = (_, index) => `key-${index}`;
const defaultRenderItem = ({ item }) => <Text>{item}</Text>;

AutocompleteInput.defaultProps = {
  data: [],
  onStartShouldSetResponderCapture: () => false,
  renderTextInput: (props) => <TextInput {...props} />,
  flatListProps: {
    renderItem: defaultRenderItem,
    keyExtractor: defaultKeyExtractor,
  },
};

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1,
};

const androidStyles = {
  container: {
    flex: 1,
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
};

const iosStyles = {
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
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3,
  },
  ...Platform.select({
    android: androidStyles,
    ios: iosStyles,
    default: iosStyles,
  }),
});

export default AutocompleteInput;
