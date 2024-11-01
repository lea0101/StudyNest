import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import "./ChatBar.css"

const Emaill = ({message, roomName, recipients, sendPingHandler, isEnabled}) => {
  const form = useRef();
  const { uid, displayName} = auth.currentUser;

  var params = {
    user_email : recipients,
    from_name : displayName,
    group_name : roomName,
    message : message,
  };

  const sendEmail = (e) => {
    e.preventDefault();
    console.log("EMAIL")
    console.log(recipients)
    if (message === "" ) {
      alert("Cannot send empty message!");
    } else if (recipients.length === 0) {
      alert("Cannot send a ping to nobody!");
    } else {
      sendPingHandler();
    //console.log(params);
    //return

      emailjs.send('service_StudyNe3st', 'template_StudyNe3st', params, {
        publicKey: '_I8OBU3d80WJA-Nb3',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          alert("Ping sent succesfully");
        },
        (error) => {
          console.log('FAILED...', error.text);
          alert("An error was encountered while sending the ping.");
        },
      );
    }
  };

  return (
    <button disabled={!isEnabled} className="send_button button" onClick={sendEmail}> 
      <FontAwesomeIcon icon={faBell} fixedWidth /> 
    </button>
  );
};

export default Emaill;
