/* eslint-disable react/prefer-stateless-function */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

const connectBDrawer = (WrappedComponent) => {
  class ConnectedBD extends Component {
    render() {
      return (
        <WrappedComponent
          {...this.props}
          popDrawer={this.context.popDrawer}
          addTargetFunc={this.context.addTargetFunc}
          removeTarget={this.context.removeTarget}
        />
      );
    }
  }

  ConnectedBD.contextTypes = {
    popDrawer: PropTypes.func,
    addTargetFunc: PropTypes.func,
    removeTarget: PropTypes.func,
  };

  return hoistNonReactStatic(ConnectedBD, WrappedComponent);
};

export default connectBDrawer;
