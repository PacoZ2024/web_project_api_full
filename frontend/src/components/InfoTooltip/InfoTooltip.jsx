import SuccessIcon from '../../assets/images/Success-icon.svg';
import ErrorIcon from '../../assets/images/Error-icon.svg';

export default function InfoTooltip({ isSuccess, message }) {
  return (
    <div className='form popup__content-message'>
      <div className='popup__icon'>
        {isSuccess ? (
          <img src={SuccessIcon} alt='Éxito' />
        ) : (
          <img src={ErrorIcon} alt='Error' />
        )}
      </div>

      <p className='popup__message'>{message}</p>
    </div>
  );
}
