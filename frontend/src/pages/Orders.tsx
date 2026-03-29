import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Skeleton } from '../components/ui/Skeleton';


export function Orders() {
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await apiClient.get('/orders');
            return res.data.data;
        }
    });

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Link to="/account" className="hover:underline hover:text-orange-500">Your Account</Link>
                    <span>›</span>
                    <span className="text-orange-600">Your Orders</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-normal">Your Orders</h1>
                    <div className="flex items-center gap-2">
                        <input type="text" placeholder="Search all orders" className="border border-gray-400 rounded-sm py-1.5 px-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none w-64" />
                        <button className="bg-gray-800 text-white rounded-sm px-4 py-1.5 text-sm font-medium hover:bg-gray-700 shadow-sm">Search Orders</button>
                    </div>
                </div>

                <div className="flex space-x-6 border-b border-gray-200 mb-6 text-sm font-medium">
                    <button className="pb-2 border-b-2 border-orange-500 text-orange-600">Orders</button>
                    <button className="pb-2 text-blue-600 hover:underline hover:text-orange-600">Buy Again</button>
                    <button className="pb-2 text-blue-600 hover:underline hover:text-orange-600">Not Yet Shipped</button>
                    <button className="pb-2 text-blue-600 hover:underline hover:text-orange-600">Cancelled Orders</button>
                </div>

                {isLoading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                ) : orders && orders.length > 0 ? (
                    <div className="space-y-6">
                        <div className="text-sm font-bold mb-2">
                            <span className="text-gray-600 font-normal mr-2">{orders.length} orders placed in</span>
                            <select className="border border-gray-300 rounded-md py-1 px-2 bg-gray-100 shadow-sm focus:ring-1 focus:ring-orange-500">
                                <option>past 3 months</option>
                                <option>2024</option>
                            </select>
                        </div>

                        {orders.map((order: any) => (
                            <div key={order.id} className="border border-gray-300 rounded-lg overflow-hidden flex flex-col">
                                {/* Order Header */}
                                <div className="bg-gray-100 p-4 border-b border-gray-300 flex flex-wrap justify-between items-start text-sm">
                                    <div className="flex gap-8 sm:gap-12">
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 uppercase text-xs mb-1">Order Placed</span>
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 uppercase text-xs mb-1">Total</span>
                                            <span>₹{parseFloat(order.totalAmount).toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-500 uppercase text-xs mb-1">Ship To</span>
                                            <span className="text-blue-600 hover:underline cursor-pointer">{order.shippingAddress?.fullName || 'User'}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end mt-2 sm:mt-0">
                                        <span className="text-gray-500 uppercase text-xs mb-1">Order # {order.id.substring(0, 18).toUpperCase()}</span>
                                        <div className="flex gap-2">
                                            <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">View order details</Link>
                                            <span className="text-gray-300">|</span>
                                            <a href="#" className="text-blue-600 hover:underline">Invoice</a>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Status & Items */}
                                <div className="p-4 sm:p-6 bg-white flex flex-col lg:flex-row gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-1">
                                            {order.status === 'DELIVERED' ? 'Delivered' : order.status === 'PROCESSING' ? 'Arriving soon' : order.status}
                                        </h3>
                                        {order.status === 'DELIVERED' && <p className="text-sm text-gray-600 mb-4">Package was handed directly to resident.</p>}

                                        <div className="space-y-4">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <Link to={`/product/${item.product.slug}`} className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 flex items-center justify-center p-2 rounded-sm border border-gray-200">
                                                        <img src={item.product.images[0]?.url || 'https://via.placeholder.com/100'} className="max-w-full max-h-full mix-blend-multiply" alt="product" />
                                                    </Link>
                                                    <div className="flex flex-col">
                                                        <Link to={`/product/${item.product.slug}`} className="text-blue-600 hover:underline hover:text-orange-600 font-medium text-sm line-clamp-2">
                                                            {item.product.title}
                                                        </Link>
                                                        <span className="text-xs text-gray-500 mt-1">Return window closed</span>
                                                        <div className="mt-2 flex gap-2">
                                                            <button className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#a88734] shadow-sm rounded-md py-1 px-3 text-xs focus:ring-2 focus:ring-orange-500">
                                                                Buy it again
                                                            </button>
                                                            <Link to={`/product/${item.product.slug}#reviews`} className="bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-md py-1 px-3 text-xs focus:ring-2 focus:ring-orange-500">
                                                                View your item
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Actions Sidebar */}
                                    <div className="lg:w-64 flex flex-col gap-2">
                                        <button className="w-full text-center bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-md py-1.5 px-3 text-sm focus:ring-2 focus:ring-orange-500">
                                            Track package
                                        </button>
                                        <button className="w-full text-center bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-md py-1.5 px-3 text-sm focus:ring-2 focus:ring-orange-500">
                                            Return or replace items
                                        </button>
                                        <button className="w-full text-center bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-md py-1.5 px-3 text-sm focus:ring-2 focus:ring-orange-500">
                                            Leave seller feedback
                                        </button>
                                        <button className="w-full text-center bg-white hover:bg-gray-50 border border-gray-300 shadow-sm rounded-md py-1.5 px-3 text-sm focus:ring-2 focus:ring-orange-500">
                                            Write a product review
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center border border-gray-200 rounded-md">
                        <h2 className="text-lg font-medium">You have not placed any orders.</h2>
                        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">Start shopping</Link>
                    </div>
                )}

            </div>
        </div>
    );
}
