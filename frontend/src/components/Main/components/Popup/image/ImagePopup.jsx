export default function ImagePopup(props) {
  const { name, link } = props.card;
  return (
    <div className='popup__content-image'>
      <img className='popup__image' src={link} alt={name} />
      <p className='popup__title-image'>{name}</p>
    </div>
  );
}
