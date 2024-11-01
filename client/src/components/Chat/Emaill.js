import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Emaill = ({message, group_name, recipients, sendPingHandler}) => {
  const form = useRef();
  const { uid, displayName, photoURL } = auth.currentUser;

  var params = {
    user_email : ,
    to_name : recipients,
    from_name : displayName,
    group_name : group_name,
    message : message,
  };

  const sendEmail = (e) => {
    e.preventDefault();
    sendPingHandler();
    console.log(params);
    return

    /*emailjs*/
    /*  .send('service_StudyNe3st', 'template_StudyNe3st', params, {*/
    /*    publicKey: '_I8OBU3d80WJA-Nb3',*/
    /*  })*/
    /*  .then(*/
    /*    () => {*/
    /*      console.log('SUCCESS!');*/
    /*      alert("ping sent succesfully");*/
    /*    },*/
    /*    (error) => {*/
    /*      console.log('FAILED...', error.text);*/
    /*    },*/
      /*);*/
  };

  return (
    <button onClick={sendEmail}> Send Ping! </button>
    //<form ref={form} onSubmit={sendEmail} user_name={displayName}>
    //  <label>Email</label>
    //  <input type="email" name="user_email" />
    //  <label>Message</label>
    //  <textarea name="message"/>
    //  <input type="submit" value="Send" />
    //</form>
  );
};

export default Emaill;
