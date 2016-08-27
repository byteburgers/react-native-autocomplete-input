import React, { Component, PropTypes } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

class AutoComplete extends Component {
  static propTypes = {
    ...TextInput.propTypes,
    /**
     * These styles will be applied to the container which
     * surrounds the autocomplete component.
     */
    containerStyle: View.propTypes.style,
    /**
     * Assign an array of data objects which should be
     * rendered in respect to the entered text.
     */
    data: PropTypes.array,
    /*
     * These styles will be applied to the container which surrounds
     * the textInput component.
     */
    inputContainerStyle: View.propTypes.style,
    /**
     * These style will be applied to the result list view.
     */
    listStyle: ListView.propTypes.style,
    /**
     * `renderItem` will be called to render the data objects
     * which will be displayed in the result view below the
     * text input.
     */
    renderItem: PropTypes.func,
    /**
     * `onShowResults` will be called when list is going to
     * show/hide results.
     */
    onShowResults: PropTypes.func,
    /**
     * renders custom TextInput. All props passed to this function.
     */
    renderTextInput: PropTypes.func
  };

  static defaultProps = {
    data: [],
    defaultValue: '',
    renderItem: rowData => <Text>{rowData}</Text>
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows(props.data),
      showResults: props.data && props.data.length > 0
    };
  }

  componentWillReceiveProps(nextProps) {
    const dataSource = this.state.dataSource.cloneWithRows(nextProps.data);
    this._showResults(dataSource.getRowCount() > 0);
    this.setState({ dataSource });
  }

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  blur() {
    const { textInput } = this;
    textInput && textInput.blur();
  }

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  focus() {
    const { textInput } = this;
    textInput && textInput.focus();
  }

  _renderItems() {
    const { listStyle, renderItem } = this.props;
    const { dataSource } = this.state;
    return (
      <ListView
        dataSource={dataSource}
        keyboardShouldPersistTaps={true}
        renderRow={renderItem}
        style={[styles.list, listStyle]}
      />
    );
  }

  _showResults(show) {
    const { showResults } = this.state;
    const { onShowResults } = this.props;

    if (!showResults && show) {
      this.setState({ showResults: true });
      onShowResults && onShowResults(true);
    } else if (showResults && !show) {
      this.setState({ showResults: false });
      onShowResults && onShowResults(false);
    }
  }

  _renderTextInput() {
    const { onEndEditing, renderTextInput, style } = this.props;
    const props = {
      style: [styles.input, style],
      ref: ref => (this.textInput = ref),
      onEndEditing: e =>
        this._showResults(false) || (onEndEditing && onEndEditing(e)),
      ...this.props
    };

    return renderTextInput
      ? renderTextInput(props)
      : (<TextInput {...props} />);
  }

  render() {
    const { showResults } = this.state;
    const { containerStyle, inputContainerStyle } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {this._renderTextInput()}
        </View>
        {showResults && this._renderItems()}
      </View>
    );
  }
}

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 1,
  borderWidth: 1
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1
  },
  inputContainer: {
    ...border
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 3
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0
  }
});

export default AutoComplete;
