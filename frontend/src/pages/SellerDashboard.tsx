import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Skeleton } from '../components/ui/Skeleton';

export function SellerDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['seller-stats'],
        queryFn: async () => {
            const res = await apiClient.get('/seller/stats');
            return res.data.data;
        }
    });

    if (isLoading) return <div className="p-10"><Skeleton className="h-40 w-full mb-4" /><Skeleton className="h-64 w-full" /></div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Seller Central</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 font-medium text-sm">Total Revenue</h3>
                        <div className="text-3xl font-bold mt-2">₹{stats?.totalRevenue ? parseFloat(stats.totalRevenue).toLocaleString('en-IN') : '0'}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 font-medium text-sm">Total Orders</h3>
                        <div className="text-3xl font-bold mt-2">{stats?.totalOrders || 0}</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-gray-500 font-medium text-sm">Active Products</h3>
                        <div className="text-3xl font-bold mt-2">{stats?.totalProducts || 0}</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Manage Products</h2>
                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#a88734] shadow-sm rounded-md py-1.5 px-4 text-sm focus:ring-2 focus:ring-orange-500">
                            Add New Product
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="p-3 font-medium text-gray-700">Product</th>
                                    <th className="p-3 font-medium text-gray-700">SKU</th>
                                    <th className="p-3 font-medium text-gray-700">Price</th>
                                    <th className="p-3 font-medium text-gray-700">Stock</th>
                                    <th className="p-3 font-medium text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No products found. Add products to start selling!</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
