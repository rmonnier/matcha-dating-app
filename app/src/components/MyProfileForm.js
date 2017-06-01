import React from 'react';
import TagsInput from 'react-tagsinput';

import 'react-tagsinput/react-tagsinput.css';

import Geolocation from './Geolocation.js';

const MyProfileForm = (props) => {
  const {
    handleSubmit,
    firstname,
    updateFirstname,
    lastname,
    updateLastname,
    birthDate,
    updateBirthDate,
    gender,
    updateGender,
    lookingFor,
    updateLookingFor,
    tags,
    updateTags,
    location,
  } = props;

  return (
    <div className="myprofileform">
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">My name is </label>
          <input
            type="text"
            placeholder="firstname"
            className="name"
            onChange={updateFirstname}
            value={firstname}
          />
          <input
            type="text"
            placeholder="lastname"
            className="name"
            onChange={updateLastname}
            value={lastname}
          />
        </div>
        <br />
        <div>
          <label htmlFor="bday">My birthday is...</label>
          <input
            type="date"
            placeholder="birthDate"
            className="bday"
            onChange={updateBirthDate}
            value={birthDate}
          />
        </div>
        <br />
        <div>
          <label htmlFor="gender">{"I'm a..."}</label>
          <input
            type="radio"
            value="male"
            className="gender"
            onChange={updateGender}
            checked={gender === 'male'}
          />Dude
          <input
            type="radio"
            value="female"
            className="gender"
            onChange={updateGender}
            checked={gender === 'female'}
          />Girl
        </div>
        <br />
        <div>
          <label htmlFor="lookingFor">I want to have fun with a...</label>
          <input
            type="radio"
            value="male"
            className="lookingFor"
            onChange={updateLookingFor}
            checked={lookingFor === 'male'}
          />Dude
          <input
            type="radio"
            value="female"
            className="lookingFor"
            onChange={updateLookingFor}
            checked={lookingFor === 'female'}
          />Girl
          <input
            type="radio"
            value="both"
            className="lookingFor"
            onChange={updateLookingFor}
            checked={lookingFor === 'both'}
          />Whatever
        </div>
        <br />
        <TagsInput value={tags} onChange={updateTags} />
        <input type="submit" value="Save my changes" />
      </form>
      <br />
      <Geolocation
        location={location}
      />
    </div>
  );
};


export default MyProfileForm;
