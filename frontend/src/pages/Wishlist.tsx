import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Skeleton } from '../components/ui/Skeleton';
import { StarRating } from '../components/ui/StarRating';

export function Wishlist() {
    const { data: wishlistItems, isLoading } = useQuery({
        queryKey: ['wishlist'],
        queryFn: async () => {
            const res = await apiClient.get('/users/wishlist');
            return res.data.data;
        }
    });

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
                <h1 className="text-3xl font-normal mb-6">Your Lists</h1>

                <div className="flex border-b border-gray-200 mb-6 text-sm font-medium">
                    <button className="pb-2 text-orange-600 border-b-2 border-orange-500">Wish List</button>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                ) : wishlistItems && wishlistItems.length > 0 ? (
                    <div className="space-y-4">
                        {wishlistItems.map((product: any) => (
                            <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex gap-6 hover:shadow-sm">
                                <Link to={`/product/${product.slug}`} className="w-32 h-32 flex-shrink-0 bg-gray-50 flex items-center justify-center p-2 rounded-sm mix-blend-multiply">
                                    <img src={product.images[0]?.url || 'https://via.placeholder.com/150'} alt={product.title} className="max-h-full" />
                                </Link>
                                <div className="flex-1">
                                    <Link to={`/product/${product.slug}`} className="text-lg font-medium text-blue-600 hover:text-orange-600 line-clamp-2">
                                        {product.title}
                                    </Link>
                                    <div className="flex items-center mt-1 mb-2">
                                        <StarRating rating={product.rating} />
                                        <span className="text-blue-600 text-sm ml-2">{product.reviewCount}</span>
                                    </div>
                                    <div className="text-xl font-bold">₹{parseFloat(product.finalPrice).toLocaleString('en-IN')}</div>
                                    <div className="mt-4 flex gap-2">
                                        <button className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#a88734] shadow-sm rounded-full py-1.5 px-4 text-sm focus:ring-2 focus:ring-orange-500">
                                            Add to Cart
                                        </button>
                                        <button className="text-blue-600 text-sm hover:underline ml-4">
                                            Remove from list
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="w-full flex justify-center mb-4"><svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg></div>
                        <h2 className="text-xl font-medium mb-2">Your wish list is empty.</h2>
                        <Link to="/" className="text-blue-600 hover:underline">Start shopping</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
