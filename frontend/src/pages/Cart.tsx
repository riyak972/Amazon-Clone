import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export function Cart() {
    const { items, updateQuantity, setItems } = useCartStore();
    const navigate = useNavigate();

    const subtotal = items.reduce((acc, item) => acc + (item.product.finalPrice * item.quantity), 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    const handleRemove = (productId: string) => {
        setItems(items.filter(item => item.productId !== productId));
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            <div className="max-w-[1500px] mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">

                {/* Main Cart Area */}
                <div className="lg:w-3/4">
                    <div className="bg-white p-6 shadow-sm">
                        <h1 className="text-3xl font-normal border-b border-gray-200 pb-2 mb-4">Shopping Cart</h1>

                        {items.length === 0 ? (
                            <div className="py-10">
                                <h2 className="text-2xl font-bold mb-4">Your Amazon Cart is empty.</h2>
                                <p className="text-sm">Check your Saved for later items below or <Link to="/" className="text-blue-600 hover:text-orange-500 hover:underline">continue shopping</Link>.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {items.map(item => (
                                    <div key={item.productId} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-100 last:border-0">
                                        <div className="w-full sm:w-1/4 max-w-[150px]">
                                            <Link to={`/product/${item.productId}`}>
                                                <img src={item.product.images?.[0]?.url || 'https://via.placeholder.com/150'} alt={item.product.title} className="w-full object-contain mix-blend-multiply" />
                                            </Link>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <Link to={`/product/${item.productId}`} className="text-lg font-medium hover:text-orange-600 line-clamp-2">
                                                    {item.product.title}
                                                </Link>
                                                <span className="text-lg font-bold ml-4">₹{parseFloat(item.product.finalPrice as any).toLocaleString('en-IN')}</span>
                                            </div>

                                            <div className="text-green-700 text-sm my-1">In stock</div>
                                            <div className="text-xs text-gray-500 mb-2">Eligible for FREE Shipping</div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                                <div className="flex items-center bg-gray-100 rounded-md shadow-sm border border-gray-300">
                                                    <select
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                                                        className="bg-transparent py-1 px-2 outline-none cursor-pointer"
                                                    >
                                                        {[...Array(10)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <span className="text-gray-300">|</span>
                                                <button onClick={() => handleRemove(item.productId)} className="text-blue-600 hover:underline">Delete</button>
                                                <span className="text-gray-300">|</span>
                                                <button className="text-blue-600 hover:underline">Save for later</button>
                                                <span className="text-gray-300">|</span>
                                                <button className="text-blue-600 hover:underline">See more like this</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {items.length > 0 && (
                            <div className="text-right text-lg mt-4 pt-2">
                                Subtotal ({totalItems} items): <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                    </div>


                </div>

                {/* Right Sidebar: Checkout Box */}
                {items.length > 0 && (
                    <div className="lg:w-1/4">
                        <div className="bg-white p-6 shadow-sm mb-6">
                            <div className="flex items-start gap-2 mb-4 text-sm text-green-700">
                                <input type="checkbox" className="mt-1 rounded-sm border-gray-300 text-green-600 focus:ring-green-500" checked readOnly />
                                <span>Your order is eligible for FREE Delivery. <span className="text-gray-500">Select this option at checkout. Details</span></span>
                            </div>

                            <div className="text-lg leading-snug mb-4">
                                Subtotal ({totalItems} items): <br />
                                <span className="font-bold text-xl">₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex items-center mb-4 text-sm">
                                <input type="checkbox" id="gift" className="mr-2" />
                                <label htmlFor="gift">This order contains a gift</label>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] shadow-sm rounded-full py-2 text-sm focus:ring-2 focus:ring-orange-500"
                            >
                                Proceed to Buy
                            </button>
                        </div>

                        <div className="bg-white p-4 shadow-sm border border-gray-200 rounded-sm text-xs">
                            <h3 className="font-bold mb-2">Amazon Free Delivery Details</h3>
                            <p>Amazon offers free shipping on countless items, no minimum purchase required for Prime members.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
