import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const Email = () => {
  const form = useRef();
  const { uid, displayName, photoURL } = auth.currentUser;

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_StudyNe3st', 'template_StudyNe3st', form.current, {
        publicKey: '_I8OBU3d80WJA-Nb3',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };
  console.log(displayName);

  return (
    <form ref={form} onSubmit={sendEmail} user_name={displayName}>
      <label>Email</label>
      <input type="email" name="user_email" />
      <label>Message</label>
      <textarea name="message"/>
      <input type="submit" value="Send" />
    </form>
  );
};

export default Email;
