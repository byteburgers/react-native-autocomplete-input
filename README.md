# react-native-autocomplete-input
[![npm version](https://badge.fury.io/js/react-native-autocomplete-input.svg)](https://badge.fury.io/js/react-native-autocomplete-input)
[![Build Status](https://travis-ci.org/l-urence/react-native-autocomplete-input.svg)](https://travis-ci.org/l-urence/react-native-autocomplete-input)

This is a pure javascript react-native component to display  autocomplete suggestions given an array of objects respective to the input text.

![Autocomplete Example](https://raw.githubusercontent.com/l-urence/react-native-autocomplete-input/master/example.gif)

## How to use react-native-autocomplete-input
Tested with RN >= 0.26.2. If you want to use RN < 0.26 try to install react-native-autocomplete-input <= 0.0.5.

First things first install the component from npmjs.org:

```shell
$ npm install --save react-native-autocomplete-input
```

or install HEAD from github.com:

```shell
$ npm install --save l-urence/react-native-autocomplete-input
```

### Example
This brief example should illustrate the usage of the autocomplete:

```javascript
// ...
render() {
  const { query } = this.state;
  const data = this._filterData(query)
  <Autocomplete
    data={data}
    defaultValue={query}
    onChangeText={text => this.setState({query: text})}
    renderItem={data => (
      <TouchableOpacity onPress={() =>
          this.setState({query: data})
        }
      >
        <Text>{data}</Text>
      </TouchableOpacity>
    )}
  />
}
// ...
```

The full example for Android and iOS from the screenshot can be found [here](//github.com/l-urence/react-native-autocomplete-input/blob/master/example/).

### Android
Android and iOS have different layout systems, because of that it is not possible to use overflows on Android (see [#20](//github.com/l-urence/react-native-autocomplete-input/issues/20)). For that reason it is necessary to wrap the autocomplete into a separate component on Android and align it *absolute* to your content, to allow  the suggestion list to overlap the other content.

```javascript
//...

render() {
  return(
    <View>
      <View style={styles.autocompleteContainer}>
        <Autocomplete {/* your props */} />
      </View>
    <Text>Some content</Text>
    <View>
  );
}

//...

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  }
});

```

## react-native-autocomplete-input props
| Prop | Type | Description |
:------------ |:---------------:| :-----|
| containerStyle | style | These styles will be applied to the container which surrounds the autocomplete component. |
| inputContainerStyle | style | These styles will be applied to the container which surrounds the textInput component. |
| style | style | These styles will be applied to the textInput component. |
| data | array | Assign an array of data objects which should be rendered in respect to the entered text. |
| listStyle | style | These style will be applied to the result list view. |
| renderItem | function | `renderItem` will be called to render the data objects which will be displayed in the result view below the text input. |
| renderSeparator | function | `renderSeparator` will be called to render the list separators which will be displayed between the list elements in the result view below the text input. |
| onShowResult | function | `onShowResult` will be called when the autocomplete suggestions appear or disappear.
| renderTextInput | function | render custom TextInput. All props passed to this function.

## Contribute
Feel free to open issues or do a PR!
