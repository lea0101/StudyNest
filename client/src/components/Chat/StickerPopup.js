import { useState, useRef } from "react";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'

const StickerPopup = ({sendStickerHandler}) => {
  async function handleStickers() {
    const storageRef = ref(storage, "stickers/cats");
    let listResult = await listAll(storageRef);
    const imageUrlPromises = listResult.items.map(item => getDownloadURL(item));
    const productImageUrls = await Promise.all(imageUrlPromises);
    console.log(`In getProductImageUrls and productImageUrls is ${productImageUrls}`);
    return productImageUrls;
  }
  return (
      <button className="send_button button" type="button" onClick={handleStickers}>
        <FontAwesomeIcon icon={faNoteSticky}/>
      </button>
  )
}
export default StickerPopup;
