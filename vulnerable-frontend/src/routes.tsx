import LoginForm from './LoginForm';
import UserDetails from './UserDetails';

const routes = [
  {
    path: '/',
    element: <LoginForm />,
  },
  {
    path: '/user-details',
    element: <UserDetails />,
  },
];

export default routes;
