import CloseButton from '../../../../assets/images/Close_button.svg';

export default function Popup(props) {
  const { onClose, children } = props;
  return (
    <div className='popup'>
      <div className='popup__content'>
        <div className='form__close-button' onClick={onClose}>
          <img
            className='form__label-close-button'
            src={CloseButton}
            alt='Botón para cerrar el formulario'
          />
        </div>
        {children}
      </div>
    </div>
  );
}
