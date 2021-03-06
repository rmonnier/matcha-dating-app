import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
// import ActionUnlike from 'material-ui/svg-icons/action/favorite-border';
import ActionLike from 'material-ui/svg-icons/action/favorite-border';
import callApi from '../callApi';

const style = {
  active: {
    color: 'rgba(200, 0, 0, 0.80)',
  },
  inactive: {
    color: 'rgba(0, 0, 50, 0.26)',
  },
};

class LikeButton extends Component {
  state = {
    alreadyLiked: false,
    error: '',
  };

  componentDidMount() {
    const { login } = this.props;
    const url = `/likes/${login}`;
    callApi(url, 'GET').then(({ data: { error, alreadyLiked } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyLiked });
      }
    });
  }

  onLikeClick = likes => () => {
    const { login } = this.props;
    const url = `/likes/${login}`;
    callApi(url, 'POST', { likes })
    .then(({ data: { error } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyLiked: likes });
      }
    });
  }

  render() {
    // console.log('RENDER', this.state);
    // if (this.state.error) { console.log(this.state.error); }
    const { alreadyLiked } = this.state;
    const { isMyProfile } = this.props;

    return (
        isMyProfile ?
        null :
        <IconButton tooltip="SVG Icon">
          {alreadyLiked ?
            <ActionLike color={style.active.color} onTouchTap={this.onLikeClick(false)} /> :
            <ActionLike color={style.inactive.color} onTouchTap={this.onLikeClick(true)} />
          }
        </IconButton>
    );
  }
}


LikeButton.propTypes = {
  login: PropTypes.string.isRequired,
  isMyProfile: PropTypes.bool,
};


LikeButton.defaultProps = {
  isMyProfile: false,
};

export default LikeButton;
