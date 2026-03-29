import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Heart } from 'lucide-react';
import { apiClient } from '../api/client';
import { useCartStore } from '../store/useCartStore';
import { StarRating } from '../components/ui/StarRating';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';

export function ProductDetail() {
    const { slug } = useParams();
    const { items, setItems } = useCartStore();
    const { addToast } = useToast();

    const [activeImage, setActiveImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const res = await apiClient.get(`/products/${slug}`);
            return res.data.data;
        }
    });

    if (isLoading) return (
        <div className="max-w-[1500px] mx-auto p-4 flex gap-8">
            < Skeleton className="w-1/3 h-[500px]" />
            < Skeleton className="w-2/3 h-[500px]" />
        </div >
    );

    if (error || !product) return <div className="p-10 text-center text-xl">Product not found</div>;

    const handleAddToCart = () => {
        // Basic append to store (in real app, this might involve async call to backend cart sync)
        // Here we just use Zustand local state and optimistic UI
        const existingIndex = items.findIndex(item => item.productId === product.id);
        const newItems = [...items];

        if (existingIndex >= 0) {
            newItems[existingIndex].quantity += quantity;
        } else {
            newItems.push({
                productId: product.id,
                quantity,
                product: {
                    id: product.id,
                    title: product.title,
                    finalPrice: product.finalPrice,
                    basePrice: product.basePrice,
                    images: product.images
                }
            });
        }
        setItems(newItems);
        addToast({ title: 'Added to Cart', description: `${product.title.substring(0, 30)}... added to your cart.`, type: 'success' });
    };

    return (
        <div className="bg-white min-h-screen pb-10">
            < div className="max-w-[1500px] mx-auto p-4 sm:p-6">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    < Link to="/" className="hover:underline">Home</Link>
                    <span>›</span >
                    <Link to={`/search?category=${product.category.slug}`} className="hover:underline">{product.category.name}</Link>
                    <span>›</span >
                    <span className="text-gray-900 truncate max-w-xs">{product.title}</span>
                </div >

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Images */}
                    <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-2/5">
                        < div className="flex md:flex-col gap-2 overflow-auto md:w-16">
                            {
                                product.images.map((img: any, i: number) => (
                                    <button
                                        key={i}
                                        onMouseEnter={() => setActiveImage(i)}
                                        onClick={() => setActiveImage(i)}
                                        className={`border-2 rounded-sm p-1 h-14 w-14 flex-shrink-0 ${activeImage === i ? 'border-orange-500 shadow-sm' : 'border-gray-200 hover:border-orange-300'}`}
                                    >
                                        <img src={img.url} className="w-full h-full object-contain mix-blend-multiply" alt={`Thumb ${i}`} />
                                    </button>
                                ))
                            }
                        </div >
                        <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 rounded-md border border-gray-200 h-[400px] md:h-[500px]">
                            < img src={product.images[activeImage]?.url} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div >
                    </div >

                    {/* Middle Column: Details */}
                    < div className="lg:w-2/5">
                        < h1 className="text-xl sm:text-2xl font-medium leading-tight mb-2">{product.title}</h1>
                        < div className="flex items-center space-x-4 mb-2 pb-2 border-b border-gray-200">
                            < div className="flex items-center">
                                < span className="text-sm text-blue-600 mr-1">{product.rating}</span>
                                < StarRating rating={product.rating} />
                            </div >
                            <span className="text-blue-600 hover:underline cursor-pointer text-sm">{product.reviewCount} ratings</span>
                        </div >

                        <div className="my-4">
                            < div className="flex items-baseline space-x-2">
                                < span className="text-red-600 text-3xl font-light">-{product.discountPercent}%</span>
                                < span className="text-3xl font-medium">
                                    < span className="text-sm relative -top-3">₹</span>
                                    {parseFloat(product.finalPrice).toLocaleString('en-IN')}
                                </span >
                            </div >
                            <div className="text-sm text-gray-500">
                                M.R.P.: <span className="line-through">₹{parseFloat(product.basePrice).toLocaleString('en-IN')}</span>
                            </div >
                            <div className="text-sm mt-1 mb-3">Inclusive of all taxes</div>
                        </div >

                        <div className="border-t border-gray-200 pt-4">
                            < h3 className="font-bold mb-2">About this item</h3>
                            < ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                                {
                                    product.description.split('\\n').filter((p: string) => p.trim() !== '').map((para: string, i: number) => (
                                        <li key={i}>{para}</li>
                                    ))
                                }
                            </ul >
                        </div >
                    </div >

                    {/* Right Column: Add to Cart / Buy Now Box */}
                    < div className="lg:w-1/5">
                        < div className="border border-gray-300 rounded-md p-4">
                            < span className="text-xl font-medium block mb-3">
                                < span className="text-sm relative -top-2">₹</span>
                                {parseFloat(product.finalPrice).toLocaleString('en-IN')}
                            </span >
                            <div className="text-sm mb-2">
                                < span className="text-blue-600 hover:underline cursor-pointer">FREE delivery</span> {new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}.
                            </div >

                            <div className="text-green-700 font-medium text-lg mb-4">
                                {product.stock > 0 ? 'In stock' : 'Out of stock'}
                            </div >

                            <div className="mb-4">
                                < label className="text-sm font-medium mr-2">Quantity:</label>
                                < select
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))
                                    }
                                    className="border border-gray-300 rounded-md px-2 py-1 bg-gray-100 shadow-sm focus:ring-1 focus:ring-orange-500 outline-none"
                                >
                                    {
                                        [...Array(Math.min(10, Math.max(0, product.stock || 0)))].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))
                                    }
                                </select >
                            </div >

                            <button
                                onClick={handleAddToCart}
                                disabled={!product.stock || product.stock === 0}
                                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] shadow-sm rounded-full py-2 text-sm focus:ring-2 focus:ring-orange-500 mb-2 disabled:opacity-50"
                            >
                                Add to Cart
                            </button >
                            <button
                                disabled={!product.stock || product.stock === 0}
                                className="w-full bg-[#ffa41c] hover:bg-[#fa8900] shadow-sm rounded-full py-2 text-sm focus:ring-2 focus:ring-orange-500 mb-4 disabled:opacity-50"
                            >
                                Buy Now
                            </button >

                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                < ShieldCheck className="h-4 w-4 mr-2" />
                                < Link to="#" className="text-blue-600 hover:underline">Secure transaction</Link>
                            </div >

                            <div className="text-xs text-gray-500 grid grid-cols-2 gap-y-1">
                                < span > Ships from</span ><span>Amazon Clone</span>
                                <span>Sold by</span><span className="text-blue-600 hover:underline cursor-pointer">{product.seller?.businessName || 'Amazon Retail'}</span>
                            </div >
                        </div >

                        <button className="w-full mt-4 border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm bg-gray-50 hover:bg-gray-100 flex items-center justify-center">
                            < Heart className="h-4 w-4 mr-2 text-gray-600" /> Add to Wish List
                        </button >
                    </div >
                </div >

            </div >
        </div >
    );
}
