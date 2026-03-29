import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Package, Shield, MapPin, CreditCard, Heart, Headset } from 'lucide-react';

export function Account() {
    const { logout } = useAuthStore();

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">
                <h1 className="text-3xl font-normal mb-6">Your Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <Link to="/orders" className="border border-gray-300 rounded-lg p-4 flex gap-4 hover:bg-gray-50 flex items-start">
                        <div className="w-[60px] flex justify-center mt-2"><Package className="w-10 h-10 text-blue-300" strokeWidth={1.5} /></div>
                        <div>
                            <h2 className="text-xl font-normal">Your Orders</h2>
                            <p className="text-sm text-gray-500 mt-1">Track, return, or buy things again</p>
                        </div>
                    </Link>

                    <Link to="/profile" className="border border-gray-300 rounded-lg p-4 flex gap-4 hover:bg-gray-50 flex items-start">
                        <div className="w-[60px] flex justify-center mt-2"><Shield className="w-10 h-10 text-blue-300" strokeWidth={1.5} /></div>
                        <div>
                            <h2 className="text-xl font-normal">Login & security</h2>
                            <p className="text-sm text-gray-500 mt-1">Edit login, name, and mobile number</p>
                        </div>
                    </Link>

                    <Link to="/addresses" className="border border-gray-300 rounded-lg p-4 flex gap-4 hover:bg-gray-50 flex items-start">
                        <div className="w-[60px] flex justify-center mt-2"><MapPin className="w-10 h-10 text-blue-300" strokeWidth={1.5} /></div>
                        <div>
                            <h2 className="text-xl font-normal">Your Addresses</h2>
                            <p className="text-sm text-gray-500 mt-1">Edit addresses for orders and gifts</p>
                        </div>
                    </Link>

                    <div className="border border-gray-300 rounded-lg p-4 flex gap-4 hover:bg-gray-50 flex items-start cursor-pointer">
                        <div className="w-[60px] flex justify-center mt-2"><CreditCard className="w-10 h-10 text-blue-300" strokeWidth={1.5} /></div>
                        <div>
                            <h2 className="text-xl font-normal">Payment options</h2>
                            <p className="text-sm text-gray-500 mt-1">Edit or add payment methods</p>
                        </div>
                    </div>

                    <Link to="/wishlist" className="border border-gray-300 rounded-lg p-4 flex gap-4 hover:bg-gray-50 flex items-start">
                        <div className="w-[60px] flex justify-center mt-2"><Heart className="w-10 h-10 text-blue-300" strokeWidth={1.5} /></div>
                        <div>
                            <h2 className="text-xl font-normal">Your Lists</h2>
                            <p className="text-sm text-gray-500 mt-1">View and share your Wish Lists</p>
                        </div>
                    </Link>

                    <div className="border border-gray-300 rounded-lg p-4 flex gap-4 hover:bg-gray-50 flex items-start cursor-pointer">
                        <div className="w-[60px] flex justify-center mt-2"><Headset className="w-10 h-10 text-blue-300" strokeWidth={1.5} /></div>
                        <div>
                            <h2 className="text-xl font-normal">Contact Us</h2>
                            <p className="text-sm text-gray-500 mt-1">Contact our customer service</p>
                        </div>
                    </div>

                </div>

                <div className="mt-10 border-t border-gray-200 pt-6">
                    <button onClick={logout} className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm px-4 py-2 text-sm shadow-sm font-medium">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
