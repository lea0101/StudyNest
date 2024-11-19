import { useState, useRef } from "react";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faNoteSticky } from '@fortawesome/free-solid-svg-icons'

const StickerPopup = ({sendStickerHandler}) => {
  const imageUrls = useRef([]);
  const [showPopup, setShowPopup] = useState(false);
  
  async function handleStickers() {
    const storageRef = ref(storage, "stickers/cats");
    let listResult = await listAll(storageRef);
    const imageUrlPromises = listResult.items.map(item => getDownloadURL(item));
    const productImageUrls = await Promise.all(imageUrlPromises);
    console.log(`In getProductImageUrls and productImageUrls is ${productImageUrls}`);
    imageUrls.current = productImageUrls;
    setShowPopup(!showPopup);
    return productImageUrls;
  }
  return (
    <>
      <button className="send_button button" type="button" onClick={handleStickers}>
        <FontAwesomeIcon icon={faNoteSticky}/>
      </button>
      {showPopup && (
      <div class="sticker_container">
        <div className="image-grid">
          {
            imageUrls.current?.map((url) => {
              return (
                <img className="sticker_img" onClick={ () => {sendStickerHandler(url); setShowPopup(false)}} src={url}/>
                  )
            })
          }
          </div>
        </div>
      )}
    </>
  )
}
export default StickerPopup;
