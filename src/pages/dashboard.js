import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { twitterAPI } from '../services/api';
import './dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [tweetText, setTweetText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await twitterAPI.getConnectedAccounts();
      setAccounts(response.data.accounts);
      if (response.data.accounts.length > 0) {
        setSelectedAccount(response.data.accounts[0].id);
      }
    } catch (error) {
      console.error('Ошибка при получении аккаунтов:', error);
      setMessage('Ошибка при загрузке аккаунтов');
    }
  };

  const handleAddAccount = async () => {
    try {
      const response = await twitterAPI.initiateAuth();
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Ошибка при добавлении аккаунта:', error);
      setMessage('Ошибка при добавлении аккаунта');
    }
  };

  const handleRemoveAccount = async (accountId) => {
    if (window.confirm('Вы уверены, что хотите отключить этот аккаунт?')) {
      try {
        await twitterAPI.removeAccount(accountId);
        setMessage('Аккаунт успешно отключён');
        fetchConnectedAccounts();
      } catch (error) {
        console.error('Ошибка при удалении аккаунта:', error);
        setMessage('Ошибка при удалении аккаунта');
      }
    }
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();
    if (!tweetText.trim() || !selectedAccount) {
      setMessage('Пожалуйста, введите текст твита и выберите аккаунт');
      return;
    }

    setIsLoading(true);
    try {
      await twitterAPI.postTweet({
        accountId: selectedAccount,
        text: tweetText
      });
      setMessage('Твит успешно опубликован!');
      setTweetText('');
    } catch (error) {
      console.error('Ошибка при публикации твита:', error);
      setMessage('Ошибка при публикации твита');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Панель управления</h1>
        <div className="user-info">
          <span>Добро пожаловать, {user?.name || user?.email}!</span>
          <button className="btn btn-secondary" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      {message && (
        <div className={`alert ${message.includes('успешно') ? 'alert-success' : 'alert-error'}`}>
          {message}
          <button className="alert-close" onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <main className="dashboard-main">
        {/* Секция подключённых аккаунтов */}
        <section className="accounts-section">
          <div className="section-header">
            <h2>Подключённые X-аккаунты</h2>
            <button className="btn btn-primary" onClick={handleAddAccount}>
              + Добавить аккаунт
            </button>
          </div>
          
          {accounts.length === 0 ? (
            <div className="empty-state">
              <p>У вас пока нет подключённых аккаунтов</p>
              <button className="btn btn-primary" onClick={handleAddAccount}>
                Подключить первый аккаунт
              </button>
            </div>
          ) : (
            <div className="accounts-grid">
              {accounts.map((account) => (
                <div key={account.id} className="account-card">
                  <div className="account-info">
                    <img 
                      src={account.profileImage || '/default-avatar.png'} 
                      alt={account.username}
                      className="account-avatar"
                    />
                    <div className="account-details">
                      <h3>@{account.username}</h3>
                      <p>{account.name}</p>
                      <span className="follower-count">
                        {account.followersCount} подписчиков
                      </span>
                    </div>
                  </div>
                  <div className="account-actions">
                    <span className={`status ${account.isActive ? 'active' : 'inactive'}`}>
                      {account.isActive ? 'Активен' : 'Неактивен'}
                    </span>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveAccount(account.id)}
                    >
                      Отключить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Форма публикации твита */}
        {accounts.length > 0 && (
          <section className="tweet-section">
            <h2>Опубликовать твит</h2>
            <form onSubmit={handleTweetSubmit} className="tweet-form">
              <div className="form-group">
                <label htmlFor="account-select">Выберите аккаунт:</label>
                <select 
                  id="account-select"
                  value={selectedAccount} 
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="form-control"
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      @{account.username} ({account.name})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="tweet-text">Текст твита:</label>
                <textarea
                  id="tweet-text"
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  placeholder="Что происходит?"
                  maxLength={280}
                  rows={4}
                  className="form-control"
                />
                <div className="character-count">
                  {tweetText.length}/280
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading || !tweetText.trim()}
                className="btn btn-primary"
              >
                {isLoading ? 'Публикуется...' : 'Опубликовать твит'}
              </button>
            </form>
          </section>
        )}

        {/* Статистика */}
        <section className="stats-section">
          <h2>Статистика</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{accounts.length}</div>
              <div className="stat-label">Подключённых аккаунтов</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {accounts.reduce((total, acc) => total + (acc.tweetsCount || 0), 0)}
              </div>
              <div className="stat-label">Всего твитов</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {accounts.reduce((total, acc) => total + (acc.followersCount || 0), 0)}
              </div>
              <div className="stat-label">Общая аудитория</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
