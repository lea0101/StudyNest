import React, { useState } from "react"
import Select from "react-select";
import '../App.css';
import { storage, auth } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import NavBar from "./NavBar";

import defaultIcon1 from '../img/default_icon_1.png'
import defaultIcon2 from '../img/default_icon_2.png'
import defaultIcon3 from '../img/default_icon_3.png'
import defaultIcon4 from '../img/default_icon_4.png'
import defaultIcon5 from '../img/default_icon_5.png'
import defaultIcon6 from '../img/default_icon_6.png'
import iconPlaceholder from '../img/icon_placeholder.png'

const defaultIcons = [
    { value: 'icon1', label: 'Icon 1', image: defaultIcon1},
    { value: 'icon2', label: 'Icon 2', image: defaultIcon2},
    { value: 'icon3', label: 'Icon 3', image: defaultIcon3},
    { value: 'icon4', label: 'Icon 4', image: defaultIcon4},
    { value: 'icon5', label: 'Icon 5', image: defaultIcon5},
    { value: 'icon6', label: 'Icon 6', image: defaultIcon6},
]

function UserSettings() {
  var [user] = useAuthState(auth);
  var userDisplayName = user.displayName;
  var username = user.email;
  var icon = user.photoURL;

  const [userName, setUserName] = useState(username);
  const [displayName, setDisplayName] = useState(userDisplayName);
  const [profileIcon, setProfileIcon] = useState(icon);
  const [imgURL, setImgURL] = useState(icon); 

  const submitPrefs = (e) => {
	  e.preventDefault();
      const file = e.target[4]?.files[0];
      if (file) {
      // This means the user did upload a file.
      const storageRef = ref(storage, `user_icons/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed",
          (snapshot) =>
          {
          },
          (error) =>
          {
            alert("Error uploading file");
          },
          () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  updateProfile(user, {photoURL: downloadURL});
                  setImgURL(downloadURL)
              });
          }
      );
      }
      else {
      // Either the user did not upload a file, or they are using a default icon.
          const iconSelection = e.target[3];
          if (iconSelection)
          {
            updateProfile(user, {photoURL: profileIcon});
            setImgURL(profileIcon);
          }
      }
      // TODO: Processing to update username
      if (userDisplayName !== displayName)
      {
        userDisplayName = displayName;
        updateProfile(user, {displayName: displayName});
      }
  }

  return (
    <div className="Settings">
      <NavBar />
     <h1>User Settings</h1>
     <div className="settings-form-container">
	<h4>Update Preferences</h4>
	<form onSubmit={submitPrefs} className='prefs-form'>
      <label>Username<br/> 
        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}/>
      </label>
      <br/>
	  <label>Display Name<br/>
	  	<input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}/>
	  </label>
	  <br/>
	  <label>Profile Icon</label>
	  <div className="profile-icon-selection">
	  	<div>
	  	  <Select name="profileIconSelection" 
	  	  placeholder="Choose From the List"
	  	  className="profile-icon-dropdown"
	  	  onChange={(e) => setProfileIcon(e.image)}
	  	  value={profileIcon?.image}
                  options={defaultIcons}
                  formatOptionLabel={icon => (
                      <div className="profile-icon-option">
                          <img src={icon.image} alt={icon.label} class="profile-icon-option"/>
                      </div>
                  )} />
	  	</div>
        <br/>
	  	<div>
            <label>Or, upload your own...</label>
            <input id='file_upload_button' type='file' accept='image/*' />
	  	</div>
	  <br/>
      <div>
      <label>Preview</label>
      { (imgURL && <img src={imgURL} alt='' height={150} />) 
        || (profileIcon && <img src={profileIcon} alt='' height={150} />) }
      </div>
      </div>
      <br/>
	   <button type="submit" class='save-button'>Save Changes</button>
	</form>

     </div>
    </div>
  );
}

export default UserSettings;
