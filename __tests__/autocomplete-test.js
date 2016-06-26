'use strict';

import Autocomplete from '../';
import React from 'react';
import { ListView } from 'react-native';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { shallow } from 'enzyme';

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
    expect(autocomplete.children()).to.have.length(1);
  });

  it('Should show suggestion list when data gets updated with length > 0', () => {
    const autocomplete = shallow(<Autocomplete data={[]} />);
    overrideGetRowCount(autocomplete, ITEMS);

    autocomplete.setProps({ data: ITEMS });
    expect(autocomplete.children()).to.have.length(2);
  });

  it('Should hide suggestion list when data gets updates with length < 1', () => {
    const autocomplete = shallow(<Autocomplete data={[]} />);
    overrideGetRowCount(autocomplete, []);

    autocomplete.setProps({ data: [] });
    expect(autocomplete.children()).to.have.length(1);
  });
});
