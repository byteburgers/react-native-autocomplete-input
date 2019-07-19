import React from 'react';
import renderer from 'react-test-renderer';
import { FlatList, Text, TextInput } from 'react-native';
import Autocomplete from '..';

const ITEMS = [
  'A New Hope',
  'The Empire Strikes Back',
  'Return of the Jedi',
  'The Phantom Menace',
  'Attack of the Clones',
  'Revenge of the Sith'
];

const keyExtractor = (item, index) => `key-${index}`;

describe('<AutocompleteInput />', () => {
  it('Should hide suggestion list on initial render', () => {
    const r = renderer.create(<Autocomplete data={[]} />);
    const autocomplete = r.root;

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(0);
  });

  it('Should show suggestion list when data gets updated with length > 0', () => {
    const testRenderer = renderer.create(<Autocomplete data={[]} />);
    const autocomplete = testRenderer.root;

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(0);

    testRenderer.update(<Autocomplete data={ITEMS} keyExtractor={keyExtractor} />);

    const list = autocomplete.findByType(FlatList);
    expect(list.props.data).toEqual(ITEMS);

    const texts = list.findAllByType(Text);
    expect(texts).toHaveLength(ITEMS.length);
  });

  it('Should hide suggestion list when data gets updates with length < 1', () => {
    const props = { data: ITEMS, keyExtractor };
    const testRenderer = renderer.create(<Autocomplete {...props} />);
    const autocomplete = testRenderer.root;

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(1);
    testRenderer.update(<Autocomplete data={[]} />);

    expect(autocomplete.findAllByType(FlatList)).toHaveLength(0);
  });

  it('should render custom text input', () => {
    const text = 'Custom Text Input';
    const testRenderer = renderer.create(
      <Autocomplete data={[]} foo="bar" renderTextInput={props => <Text {...props}>{text}</Text>} />
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
});
