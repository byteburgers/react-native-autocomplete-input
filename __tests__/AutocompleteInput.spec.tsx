import React, { type ReactElement } from 'react';
import { render, screen, within } from '@testing-library/react-native';
import { FlatList, TextInput, type FlatListProps } from 'react-native';

import Autocomplete from '../index';

const ITEMS = [
  'A New Hope',
  'The Empire Strikes Back',
  'Return of the Jedi',
  'The Phantom Menace',
  'Attack of the Clones',
  'Revenge of the Sith',
] as const;

const suggestionListTestId = 'suggestionListTestId';
function TestSuggestionList<T>(props: FlatListProps<T>): ReactElement {
  return <FlatList {...props} testID={suggestionListTestId} />;
}

describe('<AutocompleteInput />', () => {
  it('should hide suggestion list on initial render', () => {
    render(<Autocomplete data={[]} renderResultList={TestSuggestionList} />);
    const suggestionList = screen.queryByTestId(suggestionListTestId);
    expect(suggestionList).not.toBeOnTheScreen();
  });

  it('should show suggestion list with suggestions when data gets updated with length > 0', () => {
    const { rerender } = render(<Autocomplete data={[]} renderResultList={TestSuggestionList} />);

    const hiddenSuggestionList = screen.queryByTestId(suggestionListTestId);
    expect(hiddenSuggestionList).not.toBeOnTheScreen();

    rerender(<Autocomplete data={ITEMS} renderResultList={TestSuggestionList} />);

    const suggestionList = screen.getByTestId(suggestionListTestId);
    expect(suggestionList).toBeOnTheScreen();

    const suggestions = within(suggestionList).getAllByRole('text');
    suggestions.forEach((suggestion, index) => {
      expect(suggestion).toHaveTextContent(ITEMS[index]);
    });
  });

  it('should apply default render list function', () => {
    render(<Autocomplete data={ITEMS} />);

    const suggestions = screen.getAllByRole('text');
    suggestions.forEach((suggestion, index) => {
      expect(suggestion).toHaveTextContent(ITEMS[index]);
    });
  });

  it('should hide suggestion list when data gets updated with length < 1', () => {
    const { rerender } = render(
      <Autocomplete data={ITEMS} renderResultList={TestSuggestionList} />,
    );

    const suggestionList = screen.getByTestId(suggestionListTestId);
    expect(suggestionList).toBeOnTheScreen();

    rerender(<Autocomplete data={[]} renderResultList={TestSuggestionList} />);

    const hiddenSuggestionList = screen.queryByTestId(suggestionListTestId);
    expect(hiddenSuggestionList).not.toBeOnTheScreen();
  });

  it('should render custom text input', () => {
    const customTextInputTestId = 'customTextInput';
    render(
      <Autocomplete
        data={[]}
        renderTextInput={(props) => <TextInput {...props} testID={customTextInputTestId} />}
      />,
    );

    const textInput = screen.getByTestId(customTextInputTestId);
    expect(textInput).toBeOnTheScreen();
  });

  it('should render default <TextInput /> if no custom one is supplied', () => {
    render(<Autocomplete data={[]} placeholder="Enter search" />);

    const input = screen.getByPlaceholderText('Enter search');
    expect(input).toBeOnTheScreen();
  });

  it('should forward the ref to the text input', async () => {
    let ref: React.RefObject<TextInput>;
    function TestForwardRefComponent() {
      ref = React.useRef<TextInput>(null);
      return <Autocomplete data={ITEMS} placeholder="TestText" ref={ref} />;
    }

    render(<TestForwardRefComponent />);
    expect(ref!.current?.constructor.name).toBe('TextInput');
  });

  it('should only pass text input props to the TextInput', () => {
    const MockTextInput = jest.fn(() => <></>) as jest.Mock<ReactElement>;

    render(
      <Autocomplete
        data={[]}
        placeholder="Enter search"
        renderResultList={() => <></>}
        renderTextInput={MockTextInput}
      />,
    );

    expect(MockTextInput).toHaveBeenCalledWith(
      {
        placeholder: 'Enter search',
        style: [
          {
            backgroundColor: 'white',
            height: 40,
            paddingLeft: 3,
          },
          undefined,
        ],
      },
      {},
    );
  });
});
