import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import callApi from '../callApi.js';
import ImageManager from './ImageManager.js';
import Geolocation from './Geolocation.js';
import UpdatePassword from './UpdatePassword.js';
import UpdateInfos from './UpdateInfos.js';

class MyProfileContainer extends Component {
  state = {
    profileLoaded: false,
    error: '',
  }

  componentDidMount() {
    const url = '/myprofile';
    callApi(url, 'GET')
    .then(({ data: { error, profile } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.profile = profile;
        this.setState({
          profileLoaded: true,
        });
      }
    });
  }

  render() {
    // console.log("render", this.state)
    const {
      profileLoaded,
      error,
    } = this.state;

    if (error || !profileLoaded) {
      return (<div><h1>{error || 'Loading...'}</h1></div>);
    }
    return (
      <div className="profile">
        <h1>{this.profile.login}</h1>
        <nav>
          <Link to="/myprofile/visits">My visits</Link>
          <Link to="/myprofile/likes">My likes</Link>
        </nav>
        <ImageManager
          profile={this.profile}
        />
        <UpdateInfos
          profile={this.profile}
        />
        <UpdatePassword />
        <Geolocation
          loc={this.profile.loc}
        />
      </div>
    );
  }

}


export default MyProfileContainer;
