import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Filter,
  Search
} from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const { allWithdrawals, updateWithdrawalStatus, exportPaymentData } = useAdmin();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const filteredWithdrawals = allWithdrawals.filter(withdrawal => {
    const matchesFilter = filter === 'ALL' || withdrawal.status === filter;
    const matchesSearch = withdrawal.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = (withdrawalId: string, newStatus: string) => {
    updateWithdrawalStatus(withdrawalId, newStatus, notes);
    setSelectedWithdrawal(null);
    setNotes('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="text-orange-500" size={16} />;
      case 'APPROVED': return <AlertTriangle className="text-blue-500" size={16} />;
      case 'COMPLETED': return <CheckCircle className="text-green-500" size={16} />;
      case 'REJECTED': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-600 bg-orange-100';
      case 'APPROVED': return 'text-blue-600 bg-blue-100';
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
        <button
          onClick={exportPaymentData}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={16} />
          <span>Export Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 flex-1">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by User ID or Withdrawal ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Withdrawal ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">User ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Method</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map(withdrawal => (
                <tr key={withdrawal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{withdrawal.id.slice(-8)}</td>
                  <td className="py-3 px-4 font-mono text-sm">{withdrawal.userId.slice(-8)}</td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(withdrawal.amount)}</td>
                  <td className="py-3 px-4">{withdrawal.method.replace('_', ' ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(withdrawal.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(withdrawal.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {withdrawal.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(withdrawal.id, 'APPROVED')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(withdrawal.id, 'REJECTED')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status === 'APPROVED' && (
                      <button
                        onClick={() => handleStatusUpdate(withdrawal.id, 'COMPLETED')}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredWithdrawals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No withdrawal requests found
          </div>
        )}
      </div>

      {/* Withdrawal Details Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Update Withdrawal Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add notes about this status change..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedWithdrawal(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedWithdrawal, 'APPROVED')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedWithdrawal, 'REJECTED')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};