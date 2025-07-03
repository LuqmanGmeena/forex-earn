import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { userStats, paymentStats, allWithdrawals } = useAdmin();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pendingWithdrawals = allWithdrawals.filter(w => w.status === 'PENDING');
  const recentWithdrawals = allWithdrawals.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
          <div className="mt-2 text-sm text-green-600">
            +{userStats.newUsersToday} today
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Rewards</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatCurrency(userStats.totalRewardsEarned)}
              </p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Paid</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatCurrency(paymentStats.totalPaid)}
              </p>
            </div>
            <DollarSign className="text-purple-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{pendingWithdrawals.length}</p>
            </div>
            <Clock className="text-orange-500" size={24} />
          </div>
          <div className="mt-2 text-sm text-orange-600">
            {formatCurrency(paymentStats.pendingAmount)}
          </div>
        </div>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Average Withdrawal</span>
              <span className="font-semibold">{formatCurrency(paymentStats.averageWithdrawal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Pending Amount</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(paymentStats.pendingAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Rejected Amount</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(paymentStats.rejectedAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Earners</h3>
          <div className="space-y-3">
            {paymentStats.topEarners.slice(0, 5).map((earner, index) => (
              <div key={earner.userId} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="text-sm text-gray-900 truncate">{earner.userName}</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(earner.totalEarned)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Withdrawals */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Withdrawal Requests</h3>
        {recentWithdrawals.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No withdrawal requests yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-1">User ID</th>
                  <th className="text-left py-2 px-1">Amount</th>
                  <th className="text-left py-2 px-1 hidden sm:table-cell">Method</th>
                  <th className="text-left py-2 px-1">Status</th>
                  <th className="text-left py-2 px-1 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentWithdrawals.map(withdrawal => (
                  <tr key={withdrawal.id} className="border-b border-gray-100">
                    <td className="py-2 px-1 font-mono text-xs">{withdrawal.userId.slice(-6)}</td>
                    <td className="py-2 px-1 font-semibold">{formatCurrency(withdrawal.amount)}</td>
                    <td className="py-2 px-1 hidden sm:table-cell text-xs">{withdrawal.method.replace('_', ' ')}</td>
                    <td className="py-2 px-1">
                      <div className="flex items-center space-x-1">
                        {withdrawal.status === 'PENDING' && <Clock className="text-orange-500" size={12} />}
                        {withdrawal.status === 'COMPLETED' && <CheckCircle className="text-green-500" size={12} />}
                        {withdrawal.status === 'REJECTED' && <XCircle className="text-red-500" size={12} />}
                        {withdrawal.status === 'APPROVED' && <AlertTriangle className="text-blue-500" size={12} />}
                        <span className={`text-xs font-medium ${
                          withdrawal.status === 'COMPLETED' ? 'text-green-600' :
                          withdrawal.status === 'APPROVED' ? 'text-blue-600' :
                          withdrawal.status === 'REJECTED' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {withdrawal.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-1 text-gray-500 text-xs hidden md:table-cell">
                      {new Date(withdrawal.requestedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};