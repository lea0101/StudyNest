import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import '../../App.css';
import { storage, auth } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getDoc } from "firebase/firestore";
import NavBar from "../Home/NavBar";

import defaultIcon1 from '../../img/default_icon_1.png'
import defaultIcon2 from '../../img/default_icon_2.png'
import defaultIcon3 from '../../img/default_icon_3.png'
import defaultIcon4 from '../../img/default_icon_4.png'
import defaultIcon5 from '../../img/default_icon_5.png'
import defaultIcon6 from '../../img/default_icon_6.png'
import iconPlaceholder from '../../img/icon_placeholder.png'

import "./UserSettings.css"

import { db } from "../../config/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

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
  const [bio, setBio] = useState("");

  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // update the user's document in firestore
    // collection: users
    // document is indexed by user's uid
    // fields: username, displayname, icon
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      // set the document with the user's data
      setDoc(userDocRef, {username: user.email, displayname: user.displayName, icon: user.photoURL}, {merge: true});
    }
  }, [user]);

  useEffect(() => {
    // retrieve data (bio)
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setBio(userData.bio || "");
        }
      }
    }

    fetchUserData();
  }, [user]);

  const submitPrefs = async (e) => {
    e.preventDefault();
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
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
  
      // save bio to Firestore
      await setDoc(
        userDocRef,
        {
          bio: bio,
        },
        { merge: true }
      );
  
      // alert("Profile updated successfully!");
    }
  };

  const handleDeleteAccount = () => {
    setShowConfirmation(true);
  }

  const handleCancelConfirm = () => {
    setShowConfirmation(false);
  }

  const handleDeleteConfirm = async () => {
    // mark a user as deleted if they confirm the delete action
    if (auth.currentUser) {
      try {
        // mark the user as deleted in Firestore
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, { deleted: true });

        // log out the user after marking them as deleted
        await auth.signOut();

        // redirect to signup page
        navigate("/signup");
      } catch (error) {
        console.error("Error marking user as deleted: ", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  }

  return (
    <div className="Settings">
      <NavBar />

      <h1>User Settings</h1>

      <div className="settings-form-container">
        {/* <h4>Update Preferences</h4> */}

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

            <div>
              <br/>
              <label>Profile Bio<br/>
              <input type="text" value={bio} onChange={(e) => setBio(e.target.value)}/>
              </label>
            </div>
          </div>
          <br/>

          <div className="button-group">
            <button type="submit" class='save-button'>Save Changes</button>
            <button class='delete-account-button' onClick={handleDeleteAccount}>Delete My Account</button>
          </div>
        </form>

      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div>
          <div className="delete-modal">
              <div className="delete-content">
                <h3>!! Delete Account !!</h3>
                <p>Are you sure you want to delete your account? This action CANNOT be undone.</p>
                <div className="delete-modal-buttons">
                  <button className="cancel-leave-button" onClick={handleCancelConfirm}>Cancel</button>
                  <button className="confirm-leave-button" onClick={handleDeleteConfirm}>Yes</button>
                </div>
              </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserSettings;
