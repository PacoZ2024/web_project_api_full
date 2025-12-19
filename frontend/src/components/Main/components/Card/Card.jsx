import { useState } from 'react';
import DeleteImageButton from '../../../../assets/images/Delete_button.svg';
import LikeButton from '../../../../assets/images/Like.svg';
import ImagePopup from '../Popup/image/ImagePopup.jsx';
import WithConfirmation from '../Popup/form/WithConfirmation/WithConfirmation.jsx';
import Popup from '../Popup/Popup.jsx';

export default function Card(props) {
  const [popup, setPopup] = useState(null);
  const { name, link, isLiked } = props.card;
  const [liked, setLiked] = useState(isLiked);
  const imageComponent = { children: <ImagePopup card={props.card} /> };
  const confirmationDelete = {
    children: <WithConfirmation card={props.card} />,
  };

  function handleOpenPopup(popup) {
    setPopup(popup);
  }

  function handleClosePopup() {
    setPopup(null);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
    liked ? setLiked(false) : setLiked(true);
  }

  return (
    <div className='content__card'>
      <div className='content__image-card'>
        <img
          className='content__image'
          src={link}
          alt={name}
          onClick={() => {
            handleOpenPopup(imageComponent);
          }}
        />
      </div>
      <div className='content__delete-button'>
        <img
          className='content__delete-button-label'
          src={DeleteImageButton}
          alt='Botón borrar imagen'
          onClick={() => {
            handleOpenPopup(confirmationDelete);
          }}
        />
      </div>
      <div className='content__image-tag'>
        <p className='content__image-title'>{name}</p>
        <div className='content__like-button'>
          <img
            className={
              liked
                ? 'content__like-button-label-active'
                : 'content__like-button-label'
            }
            src={LikeButton}
            alt='Botón me gusta'
            onClick={() => {
              handleLikeClick();
            }}
          />
        </div>
      </div>
      {popup && <Popup onClose={handleClosePopup}>{popup.children}</Popup>}
    </div>
  );
}
