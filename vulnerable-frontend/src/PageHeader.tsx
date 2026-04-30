import { useNavigate } from '@tanstack/react-router';

interface PageHeaderProps {
  username: string;
}

const PageHeader = ({ username }: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    navigate({ to: '/' });
  };

  return (
    <div className="wallet-header">
      <div className="wallet-header-top">
        <h2 className="wallet-title">Crypto Wallet</h2>
        <button className="icon-button" onClick={handleLogout} title="Logout">
          🚪 Logout
        </button>
      </div>
      <p className="wallet-user">@{username}</p>
    </div>
  );
};

export default PageHeader;
