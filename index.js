import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';

export const AutocompleteInput = (props) => {
  function renderResultList() {
    const { renderResultList: renderFunction, style } = props;
    const listProps = {
      style: [styles.list, style],
      ...props,
    };

    return renderFunction(listProps);
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
    // flatListProps is only used in defaultResultList
    // eslint-disable-next-line no-unused-vars
    flatListProps,
  } = props;

  const showResults = data.length > 0;
  // Notify listener if the suggestion will be shown.
  onShowResults && onShowResults(showResults);
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
  /**
   * renders custom result list. Can be used to replace FlatList.
   * All props passed to this function.
   */
  renderResultList: PropTypes.func,
};

const defaultKeyExtractor = (_, index) => `key-${index}`;
const defaultRenderItem = ({ item }) => <Text>{item}</Text>;
const defaultResultList = ({ data, flatListProps }) => <FlatList data={data} {...flatListProps} />;

AutocompleteInput.defaultProps = {
  data: [],
  onStartShouldSetResponderCapture: () => false,
  renderTextInput: (props) => <TextInput {...props} />,
  renderResultList: defaultResultList,
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
