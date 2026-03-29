import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Skeleton } from '../components/ui/Skeleton';
import { StarRating } from '../components/ui/StarRating';
import { Pagination } from '../components/ui/Pagination';

export function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || '';

    const { data, isLoading } = useQuery({
        queryKey: ['search', query, category, page, sort],
        queryFn: async () => {
            const res = await apiClient.get('/search', { params: { q: query, category, page, sort, limit: 12 } });
            return res.data;
        }
    });

    const handlePageChange = (newPage: number) => {
        setSearchParams(prev => { prev.set('page', newPage.toString()); return prev; });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getFilterUrl = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        for (const [key, value] of Object.entries(updates)) {
            if (value) params.set(key, value);
            else params.delete(key);
        }
        return `/search?${params.toString()}`;
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParams(prev => { prev.set('sort', e.target.value); prev.set('page', '1'); return prev; });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top Results Bar */}
            <div className="border-b border-gray-200 py-2 px-4 shadow-sm flex items-center justify-between">
                < span className="text-sm font-bold">
                    {isLoading ? '...' : data?.pagination?.total || 0} results for <span className="text-orange-600">"{query || category || 'All products'}"</span>
                </span >
                <div className="flex items-center text-sm">
                    < span className="mr-2 text-gray-600">Sort by:</span>
                    < select
                        className="border border-gray-300 rounded-md px-2 py-1 bg-gray-50 focus:ring-1 focus:ring-orange-500 outline-none"
                        value={sort}
                        onChange={handleSortChange}
                    >
                        <option value="">Featured</option>
                        < option value="price_asc">Price: Low to High</option>
                        < option value="price_desc">Price: High to Low</option>
                        < option value="rating">Avg. Customer Review</option>
                    </select >
                </div >
            </div >

            <div className="flex flex-col md:flex-row max-w-[1500px] mx-auto">
                {/* Sidebar Filters (Simplified) */}
                <div className="w-full md:w-64 p-4 border-r border-gray-200 hidden md:block">
                    < h3 className="font-bold mb-2 text-sm">Department</h3>
                    <ul className="text-sm space-y-1 text-gray-700 mb-6">
                        <li><Link to={getFilterUrl({ category: '' })} className={!category ? 'font-bold text-black' : 'hover:text-orange-600'}>All Departments</Link></li>
                        <li><Link to={getFilterUrl({ category: 'electronics' })} className={category === 'electronics' ? 'font-bold text-black' : 'hover:text-orange-600'}>Electronics</Link></li>
                        <li><Link to={getFilterUrl({ category: 'fashion' })} className={category === 'fashion' ? 'font-bold text-black' : 'hover:text-orange-600'}>Fashion</Link></li>
                        <li><Link to={getFilterUrl({ category: 'home' })} className={category === 'home' ? 'font-bold text-black' : 'hover:text-orange-600'}>Home & Kitchen</Link></li>
                        <li><Link to={getFilterUrl({ category: 'books' })} className={category === 'books' ? 'font-bold text-black' : 'hover:text-orange-600'}>Books</Link></li>
                        <li><Link to={getFilterUrl({ category: 'beauty' })} className={category === 'beauty' ? 'font-bold text-black' : 'hover:text-orange-600'}>Beauty & Personal Care</Link></li>
                    </ul>

                    <h3 className="font-bold mb-2 text-sm">Customer Review</h3>
                    <ul className="space-y-2">
                        {[4, 3, 2, 1].map(r => (
                            <li key={r}>
                                <Link to={getFilterUrl({ rating: r.toString() })} className="flex items-center hover:text-orange-600">
                                    <StarRating rating={r} /> <span className="text-sm ml-1">& Up</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div >

                {/* Main Product Grid */}
                < div className="flex-1 p-4">
                    {
                        isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {
                                    Array(8).fill(0).map((_, i) => (
                                        <div key={i} className="border border-gray-200 rounded-sm p-4">
                                            < Skeleton className="h-48 w-full mb-4" />
                                            < Skeleton className="h-4 w-full mb-2" />
                                            < Skeleton className="h-4 w-2/3 mb-2" />
                                            < Skeleton className="h-6 w-1/3" />
                                        </div >
                                    ))
                                }
                            </div >
                        ) : data?.data?.length === 0 ? (
                            <div className="text-center py-20">
                                < h2 className="text-2xl font-bold mb-2">No results for {query}</h2>
                                < p className="text-gray-600">Try checking your spelling or use more general terms</p>
                            </div >
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {data?.data?.map((product: any) => (
                                        <div key={product.id} className="border border-gray-200 rounded-sm p-4 flex flex-col hover:shadow-sm transition-shadow bg-white">
                                            <Link to={`/product/${product.slug}`} className="h-48 flex items-center justify-center mb-4 bg-gray-50">
                                                <img src={product.images[0]?.url || 'https://via.placeholder.com/200'} alt={product.title} className="max-h-full mix-blend-multiply" />
                                            </Link >
                                            <Link to={`/product/${product.slug}`} className="hover:text-orange-600">
                                                < h2 className="text-base font-medium line-clamp-2 leading-tight">{product.title}</h2>
                                            </Link >
                                            <div className="flex items-center mt-1 mb-1">
                                                < StarRating rating={product.rating} className="mr-1" />
                                                < span className="text-blue-600 text-sm hover:underline cursor-pointer">{product.reviewCount}</span>
                                            </div >

                                            <div className="mt-auto pt-2">
                                                < div className="flex items-baseline space-x-2">
                                                    < span className="text-xl font-medium">₹{parseFloat(product.finalPrice).toLocaleString('en-IN')}</span>
                                                    {
                                                        product.discountPercent > 0 && (
                                                            <>
                                                                <span className="text-xs text-gray-500 line-through">₹{parseFloat(product.basePrice).toLocaleString('en-IN')}</span >
                                                                <span className="text-xs text-gray-500">({product.discountPercent}% off)</span>
                                                            </>
                                                        )
                                                    }
                                                </div >
                                                <p className="text-xs text-gray-600 mt-1">FREE Delivery over ₹499. Fulfilled by Amazon.</p>
                                            </div >
                                        </div >
                                    ))
                                    }
                                </div >

                                {data?.pagination && data.pagination.pages > 1 && (
                                    <Pagination
                                        currentPage={data.pagination.page}
                                        totalPages={data.pagination.pages}
                                        onPageChange={handlePageChange}
                                    />
                                )
                                }
                            </>
                        )}
                </div >
            </div >
        </div >
    );
}
