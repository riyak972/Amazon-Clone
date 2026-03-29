import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Skeleton } from '../components/ui/Skeleton';


export function Home() {
    const { data: featuredData, isLoading: isLoadingFeatured } = useQuery({
        queryKey: ['products', 'featured'],
        queryFn: async () => {
            const res = await apiClient.get('/products?limit=10&isFeatured=true'); // Or just fetch top 10 products
            return res.data.data;
        }
    });

    const { } = useQuery({
        queryKey: ['products', 'electronics'],
        queryFn: async () => {
            const res = await apiClient.get('/search?category=electronics&limit=4');
            return res.data.data;
        }
    });

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            {/* Hero Banner Area */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-r from-gray-800 to-gray-600 overflow-hidden">
                < img
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000&h=600"
                    alt="Hero Banner"
                    className="object-cover w-full h-full mix-blend-overlay opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-transparent bottom-0 h-1/2 mt-auto"></div>
            </div >

            <div className="max-w-[1500px] mx-auto px-4 sm:px-6 -mt-32 md:-mt-64 relative z-10">

                {/* Category Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    < div className="bg-white p-4 z-10 shadow-sm">
                        < h2 className="text-xl font-bold mb-4">Revamp your home in style</h2>
                        < div className="grid grid-cols-2 gap-2 mb-4">
                            <img src="https://picsum.photos/seed/home1/200/200" className="object-cover h-24 w-full" alt="category" />
                            <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop" className="object-cover h-24 w-full" alt="category" />
                            <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=200&h=200&fit=crop" className="object-cover h-24 w-full" alt="category" />
                            <img src="https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200&h=200&fit=crop" className="object-cover h-24 w-full" alt="category" />
                        </div >
                        <Link to="/search?category=home" className="text-blue-600 hover:text-orange-500 hover:underline text-sm">Explore all</Link>
                    </div >

                    <div className="bg-white p-4 z-10 shadow-sm">
                        < h2 className="text-xl font-bold mb-4">Up to 60% off | Styles for Everyone</h2>
                        < div className="grid grid-cols-2 gap-2 mb-4">
                            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop" className="object-cover h-24 w-full" alt="category" />
                            <img src="https://picsum.photos/seed/fashion2/200/200" className="object-cover h-24 w-full" alt="category" />
                            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop" className="object-cover h-24 w-full" alt="category" />
                            <img src="https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=200&h=200&fit=crop" className="object-cover h-24 w-full" alt="category" />
                        </div >
                        <Link to="/search?category=fashion" className="text-blue-600 hover:text-orange-500 hover:underline text-sm">See all offers</Link>
                    </div >

                    <div className="bg-white p-4 z-10 shadow-sm flex flex-col">
                        < h2 className="text-xl font-bold mb-4">Sign in for your best experience</h2>
                        < Link to="/login" className="bg-yellow-400 hover:bg-yellow-500 text-center py-2 rounded-md shadow-sm mb-4 font-medium text-sm w-full">Sign in securely</Link>
                        < div className="mt-auto">
                            <img src="https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=400&h=150&fit=crop" className="object-cover w-full h-32" alt="ad" />
                        </div >
                    </div >

                    <div className="bg-white p-4 z-10 shadow-sm">
                        < h2 className="text-xl font-bold mb-4">Electronics & Devices</h2>
                        < div className="h-48 mb-4">
                            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop" className="object-cover h-full w-full" alt="electronics" />
                        </div >
                        <Link to="/search?category=electronics" className="text-blue-600 hover:text-orange-500 hover:underline text-sm">Shop now</Link>
                    </div >

                </div >

                {/* Featured Products Horizontal List */}
                < div className="bg-white p-4 mb-8 shadow-sm">
                    < h2 className="text-xl font-bold mb-4">Featured Deals of the Day</h2>

                    < div className="flex overflow-x-auto space-x-4 pb-4 snap-x">
                        {
                            isLoadingFeatured ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="min-w-[200px] w-[200px] snap-start"><Skeleton className="h-48 w-full mb-2" /><Skeleton className="h-4 w-3/4" /></div>
                                ))
                            ) : featuredData?.length > 0 ? (
                                featuredData.map((product: any) => (
                                    <Link to={`/product/${product.slug}`} key={product.id} className="min-w-[200px] w-[200px] snap-start group cursor-pointer">
                                        < div className="bg-gray-50 h-48 flex items-center justify-center p-4 mb-2">
                                            < img src={product.images[0]?.url || 'https://via.placeholder.com/200'} alt={product.title} className="max-h-full mix-blend-multiply transition-transform group-hover:scale-105" />
                                        </div >
                                        <div className="flex items-center space-x-2">
                                            < span className="bg-red-600 text-white text-xs px-2 py-1 font-bold rounded-sm">Up to {product.discountPercent}% off</span>
                                            < span className="text-red-600 text-xs font-bold">Deal</span>
                                        </div >
                                        <p className="text-sm mt-1 truncate group-hover:text-orange-600">{product.title}</p>
                                    </Link >
                                ))
                            ) : (
                                <div className="w-full py-10 text-center text-gray-500">No featured products found. Please run the seed script!</div>
                            )
                        }
                    </div >
                </div >

            </div >
        </div >
    );
}
