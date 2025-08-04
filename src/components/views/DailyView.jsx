import React, { useState, useMemo } from 'react';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  Search,
  Edit3,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const DailyView = (props) => {
  const { trades, notes, isMobile, setNotes } = props;
  const [selectedDate, setSelectedDate] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Get unique dates from trades
  const tradeDates = useMemo(() => {
    const dates = [...new Set(trades.map(trade => trade.timestamp.split('T')[0]))];
    return dates.sort((a, b) => new Date(b) - new Date(a));
  }, [trades]);

  // Filter and sort trades
  const filteredTrades = useMemo(() => {
    let filtered = trades.filter(trade => {
      const matchesDate = selectedDate === 'all' || trade.timestamp.split('T')[0] === selectedDate;
      const matchesSearch = searchTerm === '' || 
        trade.ticker.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });

    // Sort trades
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.timestamp);
          bVal = new Date(b.timestamp);
          break;
        case 'symbol':
          aVal = a.ticker;
          bVal = b.ticker;
          break;
        case 'pnl':
          aVal = a.pnl || 0;
          bVal = b.pnl || 0;
          break;
        case 'entry':
          aVal = a.entry || 0;
          bVal = b.entry || 0;
          break;
        default:
          aVal = new Date(a.timestamp);
          bVal = new Date(b.timestamp);
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [trades, selectedDate, searchTerm, sortBy, sortOrder]);

  // Group trades by date for daily summaries
  const dailySummaries = useMemo(() => {
    const summaries = {};
    
    filteredTrades.forEach(trade => {
      const date = trade.timestamp.split('T')[0];
      if (!summaries[date]) {
        summaries[date] = {
          date,
          trades: [],
          totalPnL: 0,
          wins: 0,
          losses: 0
        };
      }
      
      summaries[date].trades.push(trade);
      summaries[date].totalPnL += trade.pnl || 0;
      
      if (trade.outcome === 'win') {
        summaries[date].wins++;
      } else if (trade.outcome === 'loss') {
        summaries[date].losses++;
      }
    });
    
    return Object.values(summaries).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredTrades]);

  const handleNoteEdit = (date) => {
    setEditingNote(date);
    setNoteText(notes[date] || '');
  };

  const saveNote = () => {
    if (editingNote) {
      setNotes({ ...notes, [editingNote]: noteText });
      setEditingNote(null);
      setNoteText('');
    }
  };

  const cancelNoteEdit = () => {
    setEditingNote(null);
    setNoteText('');
  };

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        {/* Mobile Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Daily View</h2>
          <Calendar className="h-6 w-6 text-blue-600" />
        </div>

        {/* Mobile Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dates</option>
            {tradeDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Daily Summaries */}
        <div className="space-y-4">
          {dailySummaries.map(summary => (
            <div key={summary.date} className="bg-white rounded-lg shadow-sm">
              {/* Daily Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {new Date(summary.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <span className={`font-bold ${
                    summary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {summary.totalPnL >= 0 ? '+' : ''}${summary.totalPnL.toFixed(0)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{summary.trades.length} trades</span>
                  <span>{summary.wins}W / {summary.losses}L</span>
                </div>
              </div>

              {/* Daily Note */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                {editingNote === summary.date ? (
                  <div className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add daily notes..."
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={saveNote}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelNoteEdit}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {notes[summary.date] ? (
                        <p className="text-sm text-gray-700">{notes[summary.date]}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No notes for this day</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleNoteEdit(summary.date)}
                      className="ml-2 text-blue-600"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Trades List */}
              <div className="divide-y divide-gray-100">
                {summary.trades.map(trade => (
                  <div key={trade.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-lg">{trade.ticker}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          trade.outcome === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.outcome}
                        </span>
                      </div>
                      <span className={`font-bold ${
                        trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(0)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="block text-xs text-gray-500">Entry</span>
                        <span className="font-medium">${trade.entry}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Exit</span>
                        <span className="font-medium">${trade.exitPrice}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500">Qty</span>
                        <span className="font-medium">{trade.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(trade.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No trades found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="space-y-6">
      {/* Desktop Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Daily Trading Journal</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-5 w-5" />
          <span>Raw trading log</span>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search symbols..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date Filter */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dates</option>
            {tradeDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="symbol">Sort by Symbol</option>
            <option value="pnl">Sort by P&L</option>
            <option value="entry">Sort by Entry</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>

      {/* Desktop Daily Summaries */}
      <div className="space-y-6">
        {dailySummaries.map(summary => (
          <div key={summary.date} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Daily Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(summary.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {summary.trades.length} trades • {summary.wins} wins, {summary.losses} losses
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${
                    summary.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {summary.totalPnL >= 0 ? '+' : ''}${summary.totalPnL.toFixed(0)}
                  </span>
                  <p className="text-sm text-gray-600">Daily P&L</p>
                </div>
              </div>
            </div>

            {/* Daily Note Section */}
            <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
              {editingNote === summary.date ? (
                <div className="space-y-3">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add daily trading notes, observations, lessons learned..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={saveNote}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save Note
                    </button>
                    <button
                      onClick={cancelNoteEdit}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-700 mb-2">Daily Notes</h4>
                    {notes[summary.date] ? (
                      <p className="text-gray-700">{notes[summary.date]}</p>
                    ) : (
                      <p className="text-gray-400 italic">No notes recorded for this day</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleNoteEdit(summary.date)}
                    className="ml-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>
              )}
            </div>

            {/* Trades Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.trades.map(trade => (
                    <tr key={trade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(trade.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trade.ticker}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${trade.entry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${trade.exitPrice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade.quantity}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trade.outcome === 'win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {filteredTrades.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No trades found</p>
          <p className="text-sm">Try adjusting your search or date filters</p>
        </div>
      )}
    </div>
  );
};
