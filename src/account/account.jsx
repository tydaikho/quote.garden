import React from 'react';

import fireapp from 'shared/fireapp.jsx';

import Edit from 'account/edit.jsx';
import Auth from 'account/auth.jsx';

export default class Account extends React.Component {
  render() {
    return this.props.currentUser ?
      <Edit currentUser={this.props.currentUser} /> :
      <Auth />
    ;
  }
}