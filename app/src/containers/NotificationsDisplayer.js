import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import NotificationSystem from 'react-notification-system';
import { receiveNotification } from '../actions/notifAction';

const socket = io();

class NotificationsDisplayer extends Component {
  componentDidMount = () => {
    const token = localStorage.getItem('x-access-token');
    socket.emit('auth', token);
    socket.on('notification', this.notificationReceive);
    socket.on('message', this.messageReceive);
  }


  componentWillReceiveProps(newProps) {
    const { message, level } = newProps.notification;
    this.notificationSystem.addNotification({
      message,
      level,
    });
  }

  notificationReceive = (message) => {
    this.props.dispatch(receiveNotification(message, 'warning'));
  }

  messageReceive = ({ from }) => {
    this.props.dispatch(receiveNotification(`New message from ${from}`, 'warning'));
  }

  render() {
    return (
      <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
    );
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification.last,
  };
}

export default connect(mapStateToProps)(NotificationsDisplayer);