import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin, Menu } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export function Header() {
    const { items } = useCartStore();
    const { user, isAuthenticated, logout } = useAuthStore();

    const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="bg-gray-900 text-white">
            {/* Top Header Layer */}
            <div className="flex items-center justify-between px-2 py-2 md:px-4 md:py-3">
                {/* Left side: Logo & Address */}
                <div className="flex items-center">
                    < Link to="/" className="px-2 py-1 border border-transparent hover:border-white rounded-sm flex items-center">
                        {/* Simple Text Logo instead of image for demo */}
                        <span className="text-xl md:text-2xl font-bold italic tracking-tighter">amazon<span className="text-orange-400">.in</span></span>
                    </Link >

                    <div className="hidden md:flex items-center px-2 py-1 ml-2 border border-transparent hover:border-white rounded-sm cursor-pointer">
                        < MapPin className="h-5 w-5 mr-1 mt-2 text-gray-300" />
                        < div className="flex flex-col">
                            < span className="text-xs text-gray-300 leading-tight">Delivering to Mumbai 400001</span>
                            < span className="text-sm font-bold leading-tight">Update location</span>
                        </div >
                    </div >
                </div >

                {/* Middle: Search Bar */}
                < div className="flex-1 hidden sm:flex">
                    < SearchBar />
                </div >

                {/* Right side: Account, Orders, Cart */}
                < div className="flex items-center space-x-2 md:space-x-4 ml-auto">
                    {/* Account Dropdown */}
                    <div className="relative group">
                        < Link to={
                            isAuthenticated ? "/account" : "/login"} className="px-2 py-1 border border-transparent hover:border-white rounded-sm flex flex-col items-start cursor-pointer transition-all">
                            <span className="text-xs text-gray-300 leading-tight">Hello, {isAuthenticated ? user?.firstName : 'sign in'}</span>
                            <span className="text-sm font-bold leading-tight flex items-center">
                                Account & Lists
                                < svg className="w-3 h-3 ml-1 fill-current opacity-60" viewBox="0 0 10 7">
                                    <path d="M5.00016 6.54516L0.224182 1.25883L1.13451 0.252075L5.00016 4.53127L8.86582 0.252075L9.77615 1.25883L5.00016 6.54516Z" />
                                </svg>
                            </span >
                        </Link >

                        {/* Simple CSS-based hover dropdown */}
                        < div className="absolute top-10 right-0 w-64 bg-white border border-gray-200 shadow-xl rounded-md p-4 hidden group-hover:block z-50 text-gray-800">
                            {
                                isAuthenticated ? (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold">{user?.firstName} {user?.lastName}</span>
                                            {
                                                user?.role === 'ADMIN' && <Badge>Admin</Badge>}
                                            {
                                                user?.role === 'SELLER' && <Badge>Seller</Badge>}
                                        </div >
                                        <hr className="my-2" />
                                        < ul className="space-y-2 text-sm">
                                            < li > <Link to="/account" className="hover:text-orange-500 hover:underline">Your Account</Link></li>
                                            < li > <Link to="/orders" className="hover:text-orange-500 hover:underline">Your Orders</Link></li>
                                            < li > <Link to="/wishlist" className="hover:text-orange-500 hover:underline">Your Wish List</Link></li>
                                            {
                                                user?.role === 'SELLER' && (
                                                    <li><Link to="/seller/dashboard" className="hover:text-orange-500 hover:underline">Seller Dashboard</Link></li >
                                                )
                                            }
                                            {
                                                user?.role === 'ADMIN' && (
                                                    <li><Link to="/admin/dashboard" className="hover:text-orange-500 hover:underline">Admin Dashboard</Link></li >
                                                )
                                            }
                                            <li><button onClick={logout} className="hover:text-orange-500 hover:underline mt-2">Sign out</button></li >
                                        </ul >
                                    </div >
                                ) : (
                                    <div className="text-center flex flex-col items-center">
                                        < Link to="/login" className="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-12 rounded-lg font-medium text-sm w-full shadow-sm mb-2">Sign in</Link>
                                        < div className="text-xs">New customer? <Link to="/register" className="text-blue-600 hover:text-orange-500 hover:underline">Start here.</Link></div>
                                    </div >
                                )
                            }
                        </div >
                    </div >

                    <Link to="/orders" className="hidden md:flex px-2 py-1 border border-transparent hover:border-white rounded-sm flex-col cursor-pointer">
                        < span className="text-xs text-gray-300 leading-tight">Returns</span>
                        < span className="text-sm font-bold leading-tight">& Orders</span>
                    </Link >

                    <Link to="/cart" className="flex items-center px-2 py-1 border border-transparent hover:border-white rounded-sm relative cursor-pointer">
                        < div className="relative">
                            < ShoppingCart className="h-8 w-8 text-white" />
                            < span className="absolute -top-1 right-0 sm:right-0 bg-yellow-500 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1">
                                {cartItemCount}
                            </span >
                        </div >
                        <span className="text-sm font-bold leading-tight mt-3 ml-1 hidden sm:inline">Cart</span>
                    </Link >
                </div >
            </div >

            {/* Mobile Search Bar */}
            < div className="sm:hidden px-3 pb-3">
                < SearchBar />
            </div >

            {/* Bottom Nav Layer */}
            < div className="bg-gray-800 text-white flex items-center px-4 py-1.5 space-x-6 overflow-x-auto text-sm">
                < button className="flex items-center font-bold hover:border-white border border-transparent p-1 rounded-sm flex-shrink-0">
                    < Menu className="h-5 w-5 mr-1" /> All
                </button >
                <Link to="/search?category=electronics" className="hover:border-white border border-transparent p-1 rounded-sm flex-shrink-0">Electronics</Link>
                <Link to="/search?category=fashion" className="hover:border-white border border-transparent p-1 rounded-sm flex-shrink-0">Fashion</Link>
                <Link to="/search?category=home" className="hover:border-white border border-transparent p-1 rounded-sm flex-shrink-0">Home & Kitchen</Link>
                <Link to="/search?category=books" className="hover:border-white border border-transparent p-1 rounded-sm flex-shrink-0">Books</Link>
                <Link to="/search?category=beauty" className="hover:border-white border border-transparent p-1 rounded-sm flex-shrink-0">Beauty</Link>
                <Link to="/search?category=sports" className="hover:border-white border border-transparent p-1 rounded-sm flex-shrink-0">Sports</Link>
            </div >
        </header >
    );
}

// Inline Badge component for quick use in dropdown
function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-sm font-medium">{children}</span>
    )
}
