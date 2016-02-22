'use strict';

import React, { Component, PropTypes } from 'react-native';

class StaticRenderer extends Component {
  static propTypes = {
    shouldUpdate: PropTypes.bool.isRequired,
    render: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    const { shouldUpdate } = nextProps;
    return shouldUpdate;
  }

  render() {
    return this.props.render();
  }
}

export default StaticRenderer;
