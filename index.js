'use strict';

import React, { Component, PropTypes } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Timer from 'react-native-timer';

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
     * `customDelay` will be called only when text changed and
     * customDelay in millis have past with no changes.
     */
     customDelay: PropTypes.number,
   };

  static defaultProps = {
    data: [],
    defaultValue: '',
    customDelay: 0,
    renderItem: rowData => <Text>{rowData}</Text>
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.data),
      showResults: false,
      value: '',
    };
  }

  componentWillUnmount() {
    Timer.clearTimeout(this);
  }

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  blur() {
    const { textInput } = this.refs;
    textInput && textInput.blur();
  }

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  focus() {
    const { textInput } = this.refs;
    textInput && textInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    const dataSource = this.state.dataSource.cloneWithRows(nextProps.data);
    this._showResults(dataSource.getRowCount() > 0);
    this.setState({dataSource});
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
    if (!showResults && show) {
      this.setState({showResults: true});
    } else if (showResults && !show) {
      this.setState({showResults: false});
    }
  }

  _onChangeWithDelay(text) {
    this.setState({value:text}, () => {
      if(this.props.onChangeText != undefined){
        Timer.clearTimeout(this, 'onChangeWithDelay');
        Timer.setTimeout(
          this,
          'onChangeWithDelay',
          () => {this.props.onChangeText(this.state.value)},
          this.props.customDelay
        );
      }
    });
  }

  render() {
    const { showResults } = this.state;
    const { containerStyle, inputContainerStyle, onEndEditing, onChange, style, onChangeText, ...props } = this.props;
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          <TextInput
            style={[styles.input, style]}
            value={this.state.value}
            ref="textInput"
            onEndEditing={e =>
              this._showResults(false) || (onEndEditing && onEndEditing(e))
            }
            onChangeText = {text => this._onChangeWithDelay(text)}
            {...props}
          />
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
    flex: 1
  },
  inputContainer: {
    ...border,
    margin: 10,
    marginBottom: 0,
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
    margin: 10,
    marginTop: 0,
  }
});

export default AutoComplete;
