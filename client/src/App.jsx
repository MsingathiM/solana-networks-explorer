import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Clock, Hash, User, Coins, CheckCircle, XCircle, Activity, ChevronDown, List, Sparkles, Zap, TrendingUp } from 'lucide-react';
import axios from 'axios';
import AnimatedBackground from './AnimatedBackground';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('testnet');
  const [availableNetworks, setAvailableNetworks] = useState(['testnet', 'devnet', 'mainnet']);
  const [loading, setLoading] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [error, setError] = useState('');
  const [showRecentTransactions, setShowRecentTransactions] = useState(true);

  useEffect(() => {
    fetchAvailableNetworks();
    fetchNetworkInfo();
    if (showRecentTransactions) {
      fetchRecentTransactions();
    }
  }, [selectedNetwork]);

  const fetchAvailableNetworks = async () => {
    try {
      const response = await axios.get('/api/networks');
      setAvailableNetworks(response.data.networks);
    } catch (err) {
      console.error('Error fetching networks:', err);
    }
  };

  const fetchNetworkInfo = async () => {
    try {
      const response = await axios.get(`/api/network-info?network=${selectedNetwork}`);
      setNetworkInfo(response.data);
    } catch (err) {
      console.error('Error fetching network info:', err);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      setLoadingRecent(true);
      const response = await axios.get(`/api/recent-transactions?network=${selectedNetwork}&limit=10`);
      setRecentTransactions(response.data.transactions);
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
      setRecentTransactions([]);
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleNetworkChange = (network) => {
    setSelectedNetwork(network);
    setTransaction(null);
    setAccount(null);
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setError('');
    setTransaction(null);
    setAccount(null);

    try {
      // Try to fetch as transaction first
      try {
        const response = await axios.get(`/api/transaction/${searchInput}?network=${selectedNetwork}`);
        setTransaction(response.data);
        return;
      } catch (txError) {
        // Not a transaction, try as account
      }

      // Try to fetch as account
      try {
        const response = await axios.get(`/api/account/${searchInput}?network=${selectedNetwork}`);
        setAccount(response.data);
      } catch (accountError) {
        setError(`Not a valid transaction signature or account address on ${selectedNetwork}`);
      }
    } catch (err) {
      setError('An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f3f0' }}>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main content container */}
      <div className="min-h-screen relative z-10">
        {/* Beige Header */}
        <header className="beige-light shadow-sm section-border mb-4">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 beige-button rounded-lg shadow-md">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold" style={{ color: '#5a3f08' }}>
                    Solana Explorer
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8b6914' }}></div>
                    <p className="text-sm font-medium capitalize" style={{ color: '#8b6914' }}>{selectedNetwork} Network</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Beige Network Selector */}
                <div className="relative">
                  <select
                    value={selectedNetwork}
                    onChange={(e) => handleNetworkChange(e.target.value)}
                    className="beige-light rounded-lg px-4 py-2 font-medium appearance-none cursor-pointer pr-10 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    style={{ color: '#5a3f08' }}
                  >
                    {availableNetworks.map(network => (
                      <option key={network} value={network} className="capitalize">
                        {network}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: '#8b6914' }} />
                </div>

                {/* Beige Network Info */}
                {networkInfo && (
                  <div className="beige-accent rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4" style={{ color: '#8b6914' }} />
                      <span className="text-xs font-medium" style={{ color: '#8b6914' }}>Network Stats</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs" style={{ color: '#5a3f08' }}>Epoch: <span className="font-semibold" style={{ color: '#8b6914' }}>{networkInfo.epoch}</span></p>
                      <p className="text-xs" style={{ color: '#5a3f08' }}>Slot: <span className="font-semibold" style={{ color: '#8b6914' }}>{networkInfo.currentSlot.toLocaleString()}</span></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Beige Hero Section */}
          <section className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 beige-accent rounded-full">
              <Zap className="h-4 w-4" style={{ color: '#8b6914' }} />
              <span className="font-medium text-sm" style={{ color: '#8b6914' }}>Lightning Fast • Secure • Decentralized</span>
            </div>

            <h2 className="text-5xl font-bold mb-4" style={{ color: '#5a3f08' }}>
              Explore Solana{' '}
              <span className="capitalize" style={{ color: '#8b6914' }}>{selectedNetwork}</span>
            </h2>

            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: '#8b6914' }}>
              Your comprehensive blockchain explorer for transactions, accounts, and network data
            </p>
          </section>

          {/* Section Divider */}
          <div className="section-divider"></div>

          {/* Beige Functional Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Beige Search Card */}
            <div className="lg:col-span-2 card-hover rounded-2xl p-8 section-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 beige-button rounded-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold" style={{ color: '#5a3f08' }}>Search Explorer</h3>
              </div>

              <p className="mb-4" style={{ color: '#8b6914' }}>
                Enter a transaction signature or account address to explore the blockchain
              </p>

              <div className="beige-accent p-4 rounded-lg mb-6">
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8b6914' }}></div>
                    <span style={{ color: '#8b6914' }}>Transaction signatures: Base58-encoded, ~88 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#a67c52' }}></div>
                    <span style={{ color: '#8b6914' }}>Account addresses: Base58-encoded, 32-44 characters</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#8b6914' }} />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter transaction signature or account address..."
                    className="w-full pl-12 pr-4 py-4 beige-light rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                    style={{ color: '#5a3f08' }}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="beige-button text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="loading-spinner"></div>
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Search className="h-5 w-5" />
                        <span>Search Blockchain</span>
                      </div>
                    )}
                  </button>
                </div>
              </form>

              {/* Beige Example Searches */}
              <div className="mt-6">
                <p className="mb-3 font-medium" style={{ color: '#8b6914' }}>Quick Examples:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setSearchInput('11111111111111111111111111111112');
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="beige-button-secondary px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    System Program
                  </button>
                  <button
                    onClick={() => {
                      setSearchInput('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="beige-button-secondary px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Token Program
                  </button>
                  <button
                    onClick={() => {
                      setSearchInput('Vote111111111111111111111111111111111111111');
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="beige-button-secondary px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    Vote Program
                  </button>
                </div>
              </div>
            </div>

            {/* Beige Recent Activity Card */}
            <div className="card-hover rounded-2xl p-6 section-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 beige-button rounded-lg">
                  <List className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: '#5a3f08' }}>Recent Activity</h3>
              </div>

              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setShowRecentTransactions(!showRecentTransactions)}
                  className="beige-button-secondary px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  {showRecentTransactions ? 'Hide' : 'Show'}
                </button>

                {showRecentTransactions && (
                  <button
                    onClick={fetchRecentTransactions}
                    disabled={loadingRecent}
                    className="beige-button px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {loadingRecent ? 'Loading...' : 'Refresh'}
                  </button>
                )}
              </div>

              {showRecentTransactions && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {loadingRecent ? (
                    <div className="text-center py-4">
                      <div className="loading-spinner mx-auto mb-2"></div>
                      <p className="text-sm" style={{ color: '#8b6914' }}>Loading transactions...</p>
                    </div>
                  ) : recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <div
                        key={tx.signature}
                        className="beige-accent rounded-lg p-3 hover:bg-opacity-80 transition-all duration-200 cursor-pointer border hover:border-amber-600"
                        onClick={() => {
                          setSearchInput(tx.signature);
                          setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${tx.status === 'success' ? 'bg-green-600' : 'bg-red-600'}`} />
                            <p className="font-mono text-xs truncate max-w-24" style={{ color: '#5a3f08' }}>
                              {tx.signature.slice(0, 8)}...
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            tx.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center py-4" style={{ color: '#8b6914' }}>No recent transactions</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Beige Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="beige-light rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="loading-spinner"></div>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#5a3f08' }}>Searching Blockchain</h3>
                <p style={{ color: '#8b6914' }}>
                  Fetching data from Solana <span className="capitalize font-semibold">{selectedNetwork}</span>...
                </p>
              </div>
            </div>
          )}

          {/* Beige Error State */}
          {error && (
            <div className="max-w-lg mx-auto text-center py-12">
              <div className="beige-light rounded-2xl p-8 shadow-lg border border-red-300">
                <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-600 mb-2">Search Error</h3>
                <p className="mb-6" style={{ color: '#8b6914' }}>{error}</p>
                <button
                  onClick={() => setError('')}
                  className="beige-button px-6 py-3 rounded-xl font-semibold"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Section Divider */}
          {(transaction || account) && <div className="section-divider"></div>}

          {/* Beige Transaction Results */}
          {transaction && (
            <section className="max-w-6xl mx-auto mb-12">
              <div className="card-hover rounded-2xl p-8 section-border">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 beige-button rounded-lg">
                      <Hash className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold" style={{ color: '#5a3f08' }}>
                        Transaction Details
                      </h3>
                      <p className="mt-1" style={{ color: '#8b6914' }}>Detailed blockchain information</p>
                    </div>
                  </div>
                  {transaction.status === 'success' ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded-full font-bold">
                      <CheckCircle className="h-5 w-5" />
                      Confirmed
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 border border-red-300 rounded-full font-bold">
                      <XCircle className="h-5 w-5" />
                      Failed
                    </span>
                  )}
                </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InfoCard icon={Hash} label="Signature" value={transaction.signature} />
                <InfoCard icon={Clock} label="Timestamp" value={formatTimestamp(transaction.blockTime)} />
                <InfoCard icon={Coins} label="Fee" value={`${transaction.fee} SOL`} />
              </div>
              <div className="space-y-6">
                <InfoCard icon={User} label="Signer" value={transaction.details.signer} />
                <InfoCard icon={Hash} label="Slot" value={transaction.slot.toLocaleString()} />
                <InfoCard icon={Hash} label="Instructions" value={transaction.details.instructions} />
              </div>
            </div>

                <div className="mt-8 flex gap-4">
                  <a
                    href={`https://explorer.solana.com/tx/${transaction.signature}?cluster=${selectedNetwork === 'mainnet' ? 'mainnet-beta' : selectedNetwork}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="beige-button flex items-center gap-2"
                  >
                    <span>View on Solana Explorer</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setTransaction(null)}
                    className="beige-button-secondary"
                  >
                    Clear Results
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Beige Account Results */}
          {account && (
            <section className="max-w-6xl mx-auto mb-12">
              <div className="card-hover rounded-2xl p-8 section-border">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 beige-button rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold" style={{ color: '#5a3f08' }}>
                      Account Details
                    </h3>
                    <p className="mt-1" style={{ color: '#8b6914' }}>Comprehensive account information</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <InfoCard icon={User} label="Address" value={account.address} />
                    <InfoCard icon={Coins} label="Balance" value={`${account.balance} SOL`} />
                  </div>
                  <div className="space-y-6">
                    <InfoCard icon={Hash} label="Data Size" value={`${account.dataSize} bytes`} />
                    <InfoCard icon={CheckCircle} label="Executable" value={account.executable ? 'Yes' : 'No'} />
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={`https://explorer.solana.com/address/${account.address}?cluster=${selectedNetwork === 'mainnet' ? 'mainnet-beta' : selectedNetwork}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="beige-button flex items-center gap-2"
                  >
                    <span>View on Solana Explorer</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setAccount(null)}
                    className="beige-button-secondary"
                  >
                    Clear Results
                  </button>
                </div>
              </div>
            </section>
          )}

        {/* Section Divider */}
        {showRecentTransactions && !transaction && !account && <div className="section-divider"></div>}

        {/* Recent Transactions Tile */}
        {showRecentTransactions && !transaction && !account && (
          <section className="max-w-5xl mx-auto mb-12">
            <div className="card-hover rounded-2xl p-8 shadow-2xl section-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-3 beige-button rounded-xl">
                    <List className="h-6 w-6 text-white" />
                  </div>
                  <span style={{ color: '#5a3f08' }}>Recent Transactions on {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}</span>
                </h3>
                <button
                  onClick={fetchRecentTransactions}
                  disabled={loadingRecent}
                  className="beige-button disabled:opacity-50"
                >
                  {loadingRecent ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {loadingRecent ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="loading-spinner"></div>
                  </div>
                  <p style={{ color: '#8b6914' }}>Loading recent transactions...</p>
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.signature}
                      className="beige-accent border border-amber-300 rounded-xl p-6 hover:border-amber-600 transition-all duration-200 cursor-pointer hover:bg-amber-50"
                      onClick={() => {
                        setSearchInput(tx.signature);
                        setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${tx.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                          <div>
                            <p className="font-mono text-sm font-medium" style={{ color: '#5a3f08' }}>
                              {tx.signature.slice(0, 12)}...{tx.signature.slice(-12)}
                            </p>
                            <p className="text-xs mt-1" style={{ color: '#8b6914' }}>
                              Slot: {tx.slot?.toLocaleString()} • Fee: {tx.fee?.toFixed(6)} SOL
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs mb-1" style={{ color: '#8b6914' }}>
                            {tx.blockTime ? formatTimestamp(tx.blockTime) : 'Pending...'}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status === 'success' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p style={{ color: '#8b6914' }}>No recent transactions available</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section Divider */}
        {networkInfo && !transaction && !account && !loading && <div className="section-divider"></div>}

        {/* Network Stats Tile */}
        {networkInfo && !transaction && !account && !loading && (
          <section className="max-w-5xl mx-auto text-center py-12">
            <div className="card-hover rounded-2xl p-8 shadow-2xl section-border">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="p-4 beige-button rounded-2xl shadow-lg">
                  <Activity className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold" style={{ color: '#5a3f08' }}>
                  {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)} Network Stats
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="beige-accent p-8 rounded-xl shadow-lg hover:border-amber-600 transition-colors section-border">
                  <div className="p-4 beige-button rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-5xl font-bold mb-3" style={{ color: '#5a3f08' }}>{networkInfo.epoch}</p>
                  <p className="font-semibold text-lg" style={{ color: '#8b6914' }}>Current Epoch</p>
                </div>

                <div className="beige-accent p-8 rounded-xl shadow-lg hover:border-amber-600 transition-colors section-border">
                  <div className="p-4 beige-button rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Hash className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-5xl font-bold mb-3" style={{ color: '#5a3f08' }}>{networkInfo.currentSlot.toLocaleString()}</p>
                  <p className="font-semibold text-lg" style={{ color: '#8b6914' }}>Current Slot</p>
                </div>

                <div className="beige-accent p-8 rounded-xl shadow-lg hover:border-amber-600 transition-colors section-border">
                  <div className="p-4 beige-button rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-5xl font-bold mb-3" style={{ color: '#5a3f08' }}>{networkInfo.slotsInEpoch.toLocaleString()}</p>
                  <p className="font-semibold text-lg" style={{ color: '#8b6914' }}>Slots in Epoch</p>
                </div>
              </div>
            </div>
          </section>
        )}
        </main>

        {/* Enhanced Footer */}
        <footer className="relative mt-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-emerald-500/10"></div>
          <div className="relative glass-effect border-t border-white/10 py-12">
            <div className="container mx-auto px-4 text-center">
              <div className="mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-4">
                  Solana Explorer
                </h3>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  Built with React & Solana Web3.js - Your gateway to the Solana blockchain
                </p>
              </div>

              <div className="flex justify-center items-center gap-8 mb-8">
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Real-time Data</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Secure & Fast</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Multi-Network</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <p className="text-white/50 text-sm">
                  ✨ Vibe coded with{' '}
                  <a
                    href="https://claude.ai/code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-transparent bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text hover:from-emerald-400 hover:to-purple-400 transition-all duration-300 font-semibold"
                  >
                    Claude Code
                  </a>{' '}
                  - Where ideas meet implementation through pure vibes 🎨
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="card-hover rounded-xl p-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 beige-button rounded-lg">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span className="text-sm font-semibold uppercase tracking-wide" style={{ color: '#8b6914' }}>{label}</span>
    </div>
    <p className="text-sm font-mono break-all leading-relaxed beige-accent p-3 rounded-lg" style={{ color: '#5a3f08' }}>
      {value}
    </p>
  </div>
);

export default App;