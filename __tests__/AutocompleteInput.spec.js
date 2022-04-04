import React from 'react';
import renderer from 'react-test-renderer';
import { FlatList, Text, TextInput, View } from 'react-native';
import Autocomplete from '..';

const ITEMS = [
  'A New Hope',
  'The Empire Strikes Back',
  'Return of the Jedi',
  'The Phantom Menace',
  'Attack of the Clones',
  'Revenge of the Sith',
];

describe('<AutocompleteInput />', () => {
  FlatList.propTypes = {};
  it('Should hide suggestion list on initial render', () => {
    const r = renderer.create(<Autocomplete data={[]} />);
    const autocomplete = r.root;

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(0);
  });

  it('Should show suggestion list when data gets updated with length > 0', () => {
    const testRenderer = renderer.create(<Autocomplete data={[]} />);
    const autocomplete = testRenderer.root;

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(0);

    testRenderer.update(<Autocomplete data={ITEMS} />);

    const list = autocomplete.findByType(FlatList);
    expect(list.props.data).toEqual(ITEMS);

    const texts = list.findAllByType(Text);
    expect(texts).toHaveLength(ITEMS.length);
  });

  it('Should hide suggestion list when data gets updates with length < 1', () => {
    const props = { data: ITEMS };
    const testRenderer = renderer.create(<Autocomplete {...props} />);
    const autocomplete = testRenderer.root;

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(1);
    testRenderer.update(<Autocomplete data={[]} />);

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(0);
  });

  it('should render custom text input', () => {
    const text = 'Custom Text Input';
    const testRenderer = renderer.create(
      <Autocomplete
        data={[]}
        foo="bar"
        renderTextInput={(props) => <Text {...props}>{text}</Text>}
      />
    );

    const autocomplete = testRenderer.root;
    const customTextInput = autocomplete.findByType(Text);

    expect(customTextInput.children[0].children).toEqual([text]);
    expect(autocomplete.findAllByType(TextInput)).toHaveLength(0);
  });

  it('should render default <TextInput /> if no custom one is supplied', () => {
    const props = { foo: 'bar' };
    const testRenderer = renderer.create(<Autocomplete data={[]} {...props} />);
    const autocomplete = testRenderer.root;
    const textInput = autocomplete.findByType(TextInput);

    expect(textInput.props).toEqual(expect.objectContaining(props));
  });

  it('should render default <FlatList /> if no custom one is supplied', () => {
    const testRenderer = renderer.create(<Autocomplete data={ITEMS} />);
    const autocomplete = testRenderer.root;
    const list = autocomplete.findByType(FlatList);

    expect(list.props.data).toEqual(ITEMS);
  });

  it('should only pass props in flatListProps to <FlatList />', () => {
    // Using keyExtractor isn't important for the test, but prevents a warning
    const keyExtractor = (_, index) => `key-${index}`;
    const flatListProps = { foo: 'bar', keyExtractor };
    const otherProps = { baz: 'qux' };
    const testRenderer = renderer.create(
      <Autocomplete data={ITEMS} flatListProps={flatListProps} {...otherProps} />
    );
    const autocomplete = testRenderer.root;
    const list = autocomplete.findByType(FlatList);

    expect(list.props).toEqual(expect.objectContaining(flatListProps));
    expect(list.props).toEqual(expect.not.objectContaining(otherProps));
  });

  it('should render a custom result list', () => {
    const testRenderer = renderer.create(
      <Autocomplete
        data={ITEMS}
        renderResultList={({ data, style }) => (
          <View style={style}>
            {data.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Text key={index}>{item}</Text>
            ))}
          </View>
        )}
      />
    );

    const autocomplete = testRenderer.root;

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(0);

    const texts = autocomplete.findAllByType(Text);
    expect(texts).toHaveLength(ITEMS.length);
  });
});
