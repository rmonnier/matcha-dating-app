import React, { Component } from 'react';

import callApi from '../callApi';
import UpdateInfosForm from '../components/UpdateInfosForm';
import ErrorDisplayer from '../components/ErrorDisplayer';

class UpdateInfos extends Component {
  constructor(props) {
    super(props);
    const {
      firstname,
      lastname,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
      email,
      login,
    } = props.profile;
    this.state = {
      firstname,
      lastname,
      birthDate: new Date(birthDate).toISOString().substr(0, 10),
      gender,
      lookingFor,
      about,
      tags,
      email: '',
      error: [],
      message: '',
    };
    this.oldEmail = email;
    this.login = login;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      firstname,
      lastname,
      email,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
    } = this.state;
    const data = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
    };
    const url = '/myprofile';
    callApi(url, 'POST', data)
    .then(({ data: { error } }) => {
      if (error) {
        this.setState({ error, message: '' });
      } else {
        this.setState({
          message: 'Profile successfully updated !',
          error: [],
          email: '',
        });
      }
    });
  }

  updateFirstname = e => this.setState({ firstname: e.target.value })
  updateLastname = e => this.setState({ lastname: e.target.value })
  updateEmail = e => this.setState({ email: e.target.value })
  updateBirthDate = e => this.setState({ birthDate: e.target.value })
  updateGender = (event, index, value) => this.setState({ gender: value })
  updateLookingFor = (event, index, value) => this.setState({ lookingFor: value })
  updateAbout = e => this.setState({ about: e.target.value })
  updateTags = tags => this.setState({ tags })

  render() {
    // console.log("render", this.state)
    const {
      firstname,
      lastname,
      email,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
      message,
      error,
    } = this.state;
    const {
      login,
      oldEmail,
    } = this;

    return (
      <div className="updateinfos">
        <UpdateInfosForm
          firstname={firstname}
          updateFirstname={this.updateFirstname}
          lastname={lastname}
          updateLastname={this.updateLastname}
          email={email}
          oldEmail={oldEmail}
          updateEmail={this.updateEmail}
          birthDate={birthDate}
          updateBirthDate={this.updateBirthDate}
          gender={gender}
          updateGender={this.updateGender}
          lookingFor={lookingFor}
          updateLookingFor={this.updateLookingFor}
          about={about}
          updateAbout={this.updateAbout}
          tags={tags}
          updateTags={this.updateTags}
          login={login}
          handleSubmit={this.handleSubmit}
        />
        <p>{message || ''}</p>
        <ErrorDisplayer
          error={error}
        />
      </div>
    );
  }

}


export default UpdateInfos;
