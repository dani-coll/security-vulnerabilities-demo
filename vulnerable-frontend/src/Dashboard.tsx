import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  balance: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { username } = useSearch({ from: '/dashboard' });
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [tradeAmount, setTradeAmount] = useState<string>('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');

  const [cryptos] = useState<Crypto[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 42150.00, change24h: 2.5, balance: 0.5234 },
    { symbol: 'ETH', name: 'Ethereum', price: 2240.50, change24h: -1.2, balance: 3.2156 },
    { symbol: 'SOL', name: 'Solana', price: 98.75, change24h: 5.8, balance: 15.0 },
    { symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.0, balance: 5000.00 },
  ]);

  const totalBalance = cryptos.reduce((sum, crypto) => sum + (crypto.price * crypto.balance), 0);

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    if (!token) {
      navigate({ to: '/' });
      return;
    }
  }, [navigate]);

  const handleTrade = (type: 'buy' | 'sell', crypto: Crypto) => {
    setSelectedCrypto(crypto);
    setTradeType(type);
    setTradeAmount('');
  };

  const executeTrade = () => {
    if (!selectedCrypto || !tradeAmount) return;
    
    alert(`${tradeType.toUpperCase()} ${tradeAmount} ${selectedCrypto.symbol} - Trade executed successfully!`);
    setSelectedCrypto(null);
    setTradeAmount('');
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    navigate({ to: '/' });
  };

  const handleViewDetails = () => {
    navigate({ to: '/user-details', search: { username } });
  };

  return (
    <div className="dashboard-container crypto-wallet">
      <div className="wallet-header">
        <div className="wallet-header-top">
          <h2 className="wallet-title">Crypto Wallet</h2>
          <button className="icon-button" onClick={handleLogout} title="Logout">
            🚪 Logout
          </button>
        </div>
        <p className="wallet-user">@{username}</p>
      </div>

      <div className="wallet-balance-card">
        <p className="balance-label">Total Portfolio Value</p>
        <h3 className="balance-amount">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        <p className="balance-change positive">+$1,234.56 (2.3%) Today</p>
      </div>

      <div className="crypto-list">
        <h4 className="section-title">Your Assets</h4>
        {cryptos.map((crypto) => (
          <div key={crypto.symbol} className="crypto-item">
            <div className="crypto-info">
              <div className="crypto-icon">{crypto.symbol === 'BTC' ? '₿' : crypto.symbol === 'ETH' ? 'Ξ' : crypto.symbol === 'SOL' ? '◎' : '₮'}</div>
              <div className="crypto-details">
                <div className="crypto-name">{crypto.name}</div>
                <div className="crypto-balance">{crypto.balance} {crypto.symbol}</div>
              </div>
            </div>
            <div className="crypto-stats">
              <div className="crypto-price">${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className={`crypto-change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`}>
                {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
              </div>
              <div className="crypto-actions">
                <button className="trade-btn buy-btn" onClick={() => handleTrade('buy', crypto)}>Buy</button>
                <button className="trade-btn sell-btn" onClick={() => handleTrade('sell', crypto)}>Sell</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="wallet-footer">
        <button className="footer-link" onClick={handleViewDetails}>View Account Details</button>
      </div>

      {selectedCrypto && (
        <div className="trade-modal-overlay" onClick={() => setSelectedCrypto(null)}>
          <div className="trade-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto.name}</h3>
              <button className="close-btn" onClick={() => setSelectedCrypto(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="trade-info">
                <p>Current Price: <strong>${selectedCrypto.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></p>
                <p>Your Balance: <strong>{selectedCrypto.balance} {selectedCrypto.symbol}</strong></p>
              </div>
              <div className="trade-input-group">
                <label>Amount ({selectedCrypto.symbol})</label>
                <input 
                  type="number" 
                  className="trade-input"
                  placeholder="0.00"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(e.target.value)}
                  step="0.01"
                  min="0"
                />
                {tradeAmount && (
                  <p className="trade-total">
                    Total: ${(parseFloat(tradeAmount) * selectedCrypto.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                )}
              </div>
              <button 
                className={`execute-trade-btn ${tradeType}`}
                onClick={executeTrade}
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
              >
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedCrypto.symbol}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
