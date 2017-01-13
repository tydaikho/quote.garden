// only in code tree root
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import fireapp from 'shared/fireapp.jsx';
import * as constants from 'shared/constants.jsx';
import * as queries from 'shared/queries.jsx';

import Loading from 'shared/loading.jsx';
import TopNav from 'shared/top-nav.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.unsubscribes = [];
    this.state = {
      isLoaded: false,
      currentUser: fireapp.auth().currentUser,
      viewName: null,
      viewUserId: null,
      viewQuoteId: null,
    };
    this.handleHashChange = () => this.updateRoute();
  }

  updateRoute() {
    console.log('hash', window.location.hash);
    console.log('hash split', window.location.hash.split('/'));

    //
    // hash possibilities:
    //                                      >>>
    //  #                                   >>>
    //  #/                                  >>>
    //  #$thing                             >>> #/$thing
    //  #/$unknown                          >>> #/$unknown (but render 404)
    //  #/$viewName                         >>> #/default/$viewName
    //  #/$profile.urlId                    >>> #/$profile.urlId/shuffle
    //  #/$profile.urlId/$viewName
    //  #/$profile.urlId/$viewName/$quoteId
    //

    //
    // view possibilities
    //  404 (unnamed >>> current path)
    //  home (unnamed >>> no path)
    //  account
    //  all
    //  edit
    //  shuffle
    //

    const hash = window.location.hash;
    const parts = hash.split('/');

    if (!hash.length || !parts.length) {
      // no route set, go home with default user
      return queries.getDefaultUserId().then(
        (userId) => this.setState({
          isLoaded: true,
          viewName: 'home',
          viewUserId: userId
        })
      );
    }

    if (parts.length === 1 && parts[0] === '#') {
      // almost no route set, reload empty
      return window.location.hash = '';
    }

    else if (parts[0] !== '#') {
      // malformed hash, reload with first / inserted
      return window.location.hash = '#/' + hash.slice(1);
    }

    else if (constants.VIEW_NAMES[parts[1]]) {
      // first part is a view name, reload with default user
      return window.location.hash = '#/default' + hash.slice(1);
    }

    else {
      // first part must be a user's profile.urlId (or an error)
      return queries.getUserIdByUrlId(parts[1]).then((userId) => {
        if (!userId) {
          // no user found, 404 with default user
          return queries.getDefaultUserId().then(
            (userId) => this.setState({
              isLoaded: true,
              viewName: '404',
              viewUserId: userId
            })
          );
        }
        // WE MADE IT !!!
        return this.setState({
          isLoaded: true,
          viewName: parts[2] || 'shuffle',
          viewQuoteId: parts[3] || null,
          viewUserId: userId,
        });
      });
    }
  }

  componentDidMount() {
    // add event listeners
    this.unsubscribes.push(
      fireapp.auth().onAuthStateChanged(
        (user) => this.setState({currentUser: user})
      )
    );
    window.addEventListener(
      'hashchange', this.handleHashChange
    );
    this.unsubscribes.push(() => {
      window.removeEventListener(
        'hashchange', this.handleHashChange
      );
    });
    // set current route
    this.updateRoute();
  }

  componentWillUnmount() {
    this.unsubscribes.forEach((fn) => fn());
  }

  render() {
    if (!this.state.isLoaded) {
      return <Loading />
    }
    switch (this.state.viewName) {
      default: return (
        <div>
          <p>{this.state.viewName}</p>
          <p>{this.state.viewQuoteId}</p>
          <p>{this.state.viewUserId}</p>
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));