'use strict';

import Autocomplete from '../';
import React from 'react';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
  ListView,
  Text
} from 'react-native';

const ITEMS = [
  "A New Hope",
  "The Empire Strikes Back",
  "Return of the Jedi",
  "The Phantom Menace",
  "Attack of the Clones",
  "Revenge of the Sith"
];

function overrideGetRowCount(autocomplete, data) {
  const DataSourcePrototype = ListView.DataSource.prototype;
  autocomplete.state().dataSource = Object.assign(DataSourcePrototype, {
    getRowCount: () => data.length
  });
}

describe('<AutocompleteInput />', () => {
  it('Should hide suggestion list on initial render', () => {
    const autocomplete = shallow(<Autocomplete data={[]} />);
    expect(autocomplete.length).to.equal(1);
    expect(autocomplete.childAt(1).children()).to.have.length(0);
  });

  it('Should show suggestion list when data gets updated with length > 0', () => {
    const autocomplete = shallow(<Autocomplete data={[]} />);
    overrideGetRowCount(autocomplete, ITEMS);

    autocomplete.setProps({ data: ITEMS });
    expect(autocomplete.childAt(1).children()).to.have.length(1);
  });

  it('Should hide suggestion list when data gets updates with length < 1', () => {
    const autocomplete = shallow(<Autocomplete data={[]} />);
    overrideGetRowCount(autocomplete, []);

    autocomplete.setProps({ data: [] });
    expect(autocomplete.childAt(1).children()).to.have.length(0);
  });

  it('should render custom text input', () => {
    const text = 'Custom Text Input';
    const autocomplete = shallow(
      <Autocomplete data={[]} foo="bar" renderTextInput={props =>
          <Text {...props}>{text}</Text>
        }
      />
    );

    const customInput = autocomplete.find('Text');
    expect(autocomplete.find('TextInput')).to.have.length(0);
    expect(customInput.children().get(0)).to.equal(text);
    expect(customInput.prop('foo')).to.equal('bar');
  });

  it('should render default <TextInput /> if no custom one is supplied', () => {
    const autocomplete = shallow(<Autocomplete data={[]} foo="bar" />);

    const textInput = autocomplete.childAt(0).children().first();
    expect(textInput.name()).to.equal('TextInput');
    expect(textInput.prop('foo')).to.equal('bar');
  });
});
