import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Chat.css";

const SenderInfo = ({ message }) => {
  const [user] = useAuthState(auth);
  const messageOwner = (message.uid === user.uid) ? "me" : "them";

  return (
      <div className={`namebar ${messageOwner}`}>
        <img className={`avatar ${messageOwner}`} src={message.avatar} alt="user avatar" />
        <p className={`user-name ${messageOwner}`}>{message.name}</p>
      </div>
  )
}
export default SenderInfo;
