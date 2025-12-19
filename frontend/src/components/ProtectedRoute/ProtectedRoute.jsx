import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { CurrentUserContext } from '../../contexts/CurrentUserContext.js';

export default function ProtectedRoute({ children, anonymous = false }) {
  const location = useLocation();
  const from = location.state?.from || '/';

  const { isLoggedIn } = useContext(CurrentUserContext);

  if (anonymous && isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  if (!anonymous && !isLoggedIn) {
    return <Navigate to='/signin' state={{ from: location }} replace />;
  }

  return children;
}
