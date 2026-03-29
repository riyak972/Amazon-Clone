import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Skeleton } from '../components/ui/Skeleton';

export function AdminDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await apiClient.get('/admin/stats');
            return res.data.data;
        }
    });

    if (isLoading) return <div className="p-10"><Skeleton className="h-40 w-full mb-4" /><Skeleton className="h-64 w-full" /></div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-red-500">
                        <h3 className="text-gray-500 font-medium text-sm">Total Sales</h3>
                        <div className="text-3xl font-bold mt-2">₹{stats?.totalSales ? parseFloat(stats.totalSales).toLocaleString('en-IN') : '0'}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-blue-500">
                        <h3 className="text-gray-500 font-medium text-sm">Total Orders</h3>
                        <div className="text-3xl font-bold mt-2">{stats?.totalOrders || 0}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-green-500">
                        <h3 className="text-gray-500 font-medium text-sm">Total Users</h3>
                        <div className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-yellow-500">
                        <h3 className="text-gray-500 font-medium text-sm">Active Sellers</h3>
                        <div className="text-3xl font-bold mt-2">{stats?.totalSellers || 0}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4">Pending Seller Verifications</h2>
                        <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-md">No sellers pending verification.</div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                        <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-md">Feature coming soon.</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
