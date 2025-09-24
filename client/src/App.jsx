import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Clock, Hash, User, Coins, CheckCircle, XCircle, Activity, ChevronDown, List } from 'lucide-react';
import axios from 'axios';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{backgroundColor: '#1f2937', color: 'white'}}>
      {/* Force refresh - borders should be clearly visible now */}
      {/* Header */}
      <div className="bg-gray-800/60 backdrop-blur-lg border-b border-gray-600/30 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Solana Explorer
                </h1>
                <p className="text-sm text-white capitalize font-medium">{selectedNetwork} Network</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Network Selector */}
              <div className="relative">
                <select
                  value={selectedNetwork}
                  onChange={(e) => handleNetworkChange(e.target.value)}
                  className="bg-gray-700 border border-gray-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none cursor-pointer pr-8 font-medium"
                >
                  {availableNetworks.map(network => (
                    <option key={network} value={network} className="bg-gray-800 text-white capitalize">
                      {network}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
              </div>

              {/* Network Info */}
              {networkInfo && (
                <div className="text-right bg-gray-700/50 rounded-lg p-3 border border-gray-500/30">
                  <p className="text-sm text-white font-medium">Epoch: {networkInfo.epoch}</p>
                  <p className="text-sm text-white font-medium">Slot: {networkInfo.currentSlot.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Explore Solana {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}
          </h2>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Your comprehensive blockchain explorer for transactions, accounts, and network data
          </p>
        </section>

        {/* Functional Tiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Search Tile */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-8 shadow-xl" style={{border: '4px solid #9ca3af', backgroundColor: '#1f2937'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Search Explorer</h3>
            </div>

            <p className="text-white mb-4">Enter a transaction signature or account address to explore</p>
            <div className="text-xs text-gray-200 mb-6 bg-gray-700 p-3 rounded-lg border border-gray-600">
              <p>• Transaction signatures: Base58-encoded, ~88 characters</p>
              <p>• Account addresses: Base58-encoded, 32-44 characters</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter transaction signature or account address..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 text-white placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-olive-600 hover:bg-olive-700 disabled:opacity-50 rounded-xl font-semibold transition-all duration-200 text-white shadow-lg"
                style={{backgroundColor: '#84cc16', '--tw-ring-color': '#65a30d'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Searching...
                  </div>
                ) : (
                  'Search Blockchain'
                )}
              </button>
            </form>

            {/* Example Searches */}
            <div className="mt-6">
              <p className="text-white mb-3 font-medium">Quick Examples:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSearchInput('11111111111111111111111111111112');
                    setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                  }}
                  className="px-3 py-2 rounded-lg text-sm text-white transition-colors font-medium"
                  style={{backgroundColor: '#84cc16'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
                >
                  System Program
                </button>
                <button
                  onClick={() => {
                    setSearchInput('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
                    setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                  }}
                  className="px-3 py-2 rounded-lg text-sm text-white transition-colors font-medium"
                  style={{backgroundColor: '#84cc16'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
                >
                  Token Program
                </button>
                <button
                  onClick={() => {
                    setSearchInput('Vote111111111111111111111111111111111111111');
                    setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                  }}
                  className="px-3 py-2 rounded-lg text-sm text-white transition-colors font-medium"
                  style={{backgroundColor: '#84cc16'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
                >
                  Vote Program
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Tile */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl" style={{border: '4px solid #9ca3af', backgroundColor: '#1f2937'}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-700 rounded-lg">
                <List className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            </div>

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowRecentTransactions(!showRecentTransactions)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white transition-colors"
                style={{backgroundColor: '#84cc16'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
              >
                <List className="h-4 w-4" />
                {showRecentTransactions ? 'Hide' : 'Show'}
              </button>

              {showRecentTransactions && (
                <button
                  onClick={fetchRecentTransactions}
                  disabled={loadingRecent}
                  className="px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 text-white"
                  style={{backgroundColor: '#84cc16'}}
                  onMouseEnter={(e) => !loadingRecent && (e.target.style.backgroundColor = '#65a30d')}
                  onMouseLeave={(e) => !loadingRecent && (e.target.style.backgroundColor = '#84cc16')}
                >
                  {loadingRecent ? 'Loading...' : 'Refresh'}
                </button>
              )}
            </div>

            {showRecentTransactions && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {loadingRecent ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-transparent mx-auto mb-2"></div>
                    <p className="text-white text-sm">Loading...</p>
                  </div>
                ) : recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <div
                      key={tx.signature}
                      className="bg-gray-700 border border-gray-600 rounded-lg p-3 hover:border-gray-500 transition-all duration-200 cursor-pointer hover:bg-gray-650"
                      onClick={() => {
                        setSearchInput(tx.signature);
                        setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${tx.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                          <p className="font-mono text-xs text-white truncate max-w-24">
                            {tx.signature.slice(0, 8)}...
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          tx.status === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-sm text-center py-4">No recent transactions</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="bg-gray-800 border border-gray-600 rounded-2xl p-8 max-w-md mx-auto">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-400 border-t-transparent"></div>
              </div>
              <p className="text-white font-medium">Fetching data from Solana {selectedNetwork}...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="bg-gray-800 border border-red-500 rounded-2xl p-8 shadow-xl">
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-400 mb-2">Search Error</h3>
              <p className="text-white">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-4 px-4 py-2 rounded-lg text-white transition-colors"
                style={{backgroundColor: '#84cc16'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Transaction Results */}
        {transaction && (
          <section className="max-w-5xl mx-auto bg-gray-800 border border-gray-600 rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-3 bg-gray-700 rounded-xl">
                  <Hash className="h-6 w-6 text-white" />
                </div>
                <span className="text-white">Transaction Details</span>
              </h3>
              {transaction.status === 'success' ? (
                <span className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full font-semibold">
                  <CheckCircle className="h-5 w-5" />
                  Confirmed
                </span>
              ) : (
                <span className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-300 border border-red-400/30 rounded-full font-semibold">
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-semibold text-white shadow-lg"
                style={{backgroundColor: '#84cc16'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
              >
                View on Solana Explorer
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => setTransaction(null)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors"
              >
                Clear Results
              </button>
            </div>
          </section>
        )}

        {/* Account Results */}
        {account && (
          <section className="max-w-5xl mx-auto bg-gray-800 border border-gray-600 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-3xl font-bold flex items-center gap-3 mb-8">
              <div className="p-3 bg-gray-700 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <span className="text-white">Account Details</span>
            </h3>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <InfoCard icon={User} label="Address" value={account.address} />
                <InfoCard icon={Coins} label="Balance" value={`${account.balance} SOL`} />
              </div>
              <div className="space-y-6">
                <InfoCard icon={Hash} label="Data Size" value={`${account.dataSize} bytes`} />
                <InfoCard icon={CheckCircle} label="Executable" value={account.executable ? 'Yes' : 'No'} />
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href={`https://explorer.solana.com/address/${account.address}?cluster=${selectedNetwork === 'mainnet' ? 'mainnet-beta' : selectedNetwork}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-semibold text-white shadow-lg"
                style={{backgroundColor: '#84cc16'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#65a30d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#84cc16'}
              >
                View on Solana Explorer
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => setAccount(null)}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors"
              >
                Clear Results
              </button>
            </div>
          </section>
        )}

        {/* Recent Transactions Tile */}
        {showRecentTransactions && !transaction && !account && (
          <section className="max-w-5xl mx-auto mb-12">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl" style={{border: '4px solid #9ca3af', backgroundColor: '#1f2937'}}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-3 bg-gray-700 rounded-xl">
                    <List className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white">Recent Transactions on {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}</span>
                </h3>
                <button
                  onClick={fetchRecentTransactions}
                  disabled={loadingRecent}
                  className="px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 text-white"
                  style={{backgroundColor: '#84cc16'}}
                  onMouseEnter={(e) => !loadingRecent && (e.target.style.backgroundColor = '#65a30d')}
                  onMouseLeave={(e) => !loadingRecent && (e.target.style.backgroundColor = '#84cc16')}
                >
                  {loadingRecent ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {loadingRecent ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-400 border-t-transparent"></div>
                  </div>
                  <p className="text-white">Loading recent transactions...</p>
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.signature}
                      className="bg-gray-700 border border-gray-600 rounded-xl p-6 hover:border-gray-500 transition-all duration-200 cursor-pointer hover:bg-gray-650"
                      onClick={() => {
                        setSearchInput(tx.signature);
                        setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${tx.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                          <div>
                            <p className="font-mono text-sm text-white font-medium">
                              {tx.signature.slice(0, 12)}...{tx.signature.slice(-12)}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              Slot: {tx.slot?.toLocaleString()} • Fee: {tx.fee?.toFixed(6)} SOL
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-300 mb-1">
                            {tx.blockTime ? formatTimestamp(tx.blockTime) : 'Pending...'}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
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
                  <p className="text-white">No recent transactions available</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Network Stats Tile */}
        {networkInfo && !transaction && !account && !loading && (
          <section className="max-w-5xl mx-auto text-center py-12">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl" style={{border: '4px solid #9ca3af', backgroundColor: '#1f2937'}}>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="p-4 bg-gray-700 rounded-2xl shadow-lg">
                  <Activity className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">
                  {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)} Network Stats
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gray-700 p-8 rounded-xl shadow-lg hover:border-gray-300 transition-colors" style={{border: '3px solid #9ca3af', backgroundColor: '#374151'}}>
                  <div className="p-4 bg-gray-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-5xl font-bold text-white mb-3">{networkInfo.epoch}</p>
                  <p className="text-white font-semibold text-lg">Current Epoch</p>
                </div>

                <div className="bg-gray-700 p-8 rounded-xl shadow-lg hover:border-gray-300 transition-colors" style={{border: '3px solid #9ca3af', backgroundColor: '#374151'}}>
                  <div className="p-4 bg-gray-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Hash className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-5xl font-bold text-white mb-3">{networkInfo.currentSlot.toLocaleString()}</p>
                  <p className="text-white font-semibold text-lg">Current Slot</p>
                </div>

                <div className="bg-gray-700 p-8 rounded-xl shadow-lg hover:border-gray-300 transition-colors" style={{border: '3px solid #9ca3af', backgroundColor: '#374151'}}>
                  <div className="p-4 bg-gray-600 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-5xl font-bold text-white mb-3">{networkInfo.slotsInEpoch.toLocaleString()}</p>
                  <p className="text-white font-semibold text-lg">Slots in Epoch</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-600 bg-gray-800/50 mt-12 py-8 text-center">
        <p className="text-white font-medium">
          Solana Explorer - Built with React & Solana Web3.js
        </p>
        <p className="text-gray-300 text-sm mt-2">
          Exploring blockchain data across all Solana networks
        </p>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-xs">
            ✨ Vibe coded with{' '}
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline font-medium"
              style={{color: '#84cc16'}}
              onMouseEnter={(e) => e.target.style.color = '#65a30d'}
              onMouseLeave={(e) => e.target.style.color = '#84cc16'}
            >
              Claude Code
            </a>{' '}
            - Where ideas meet implementation through pure vibes 🎨
          </p>
        </div>
      </footer>
    </div>
  );
}

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-700 border border-gray-600 rounded-xl p-6 hover:border-gray-500 transition-all duration-200 shadow-lg">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-gray-600 rounded-lg">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-sm font-semibold text-white uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-sm font-mono break-all text-white leading-relaxed">{value}</p>
  </div>
);

export default App;