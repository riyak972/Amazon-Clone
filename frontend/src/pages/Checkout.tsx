import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiClient } from '../api/client';
import { useCartStore } from '../store/useCartStore';

import { useToast } from '../components/ui/Toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

function CheckoutForm({ totalAmount, onSuccess }: { clientSecret: string, totalAmount: number, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin + '/orders' },
            redirect: 'if_required'
        });

        if (error) {
            addToast({ title: 'Payment failed', description: error.message || 'An error occurred', type: 'error' });
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess();
        }
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement />
            <button
                disabled={isProcessing || !stripe || !elements}
                className="w-full mt-6 bg-[#ffd814] hover:bg-[#f7ca00] shadow-sm rounded-md py-2 text-sm font-medium focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            >
                {isProcessing ? 'Processing... Please wait' : `Place your order in INR ${totalAmount.toLocaleString('en-IN')}`}
            </button>
        </form>
    );
}

export function Checkout() {
    const navigate = useNavigate();
    const { items, setItems } = useCartStore();

    const { addToast } = useToast();

    const [step, setStep] = useState(1);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [clientSecret, setClientSecret] = useState('');
    const [orderId, setOrderId] = useState('');

    const subtotal = items.reduce((acc, item) => acc + (item.product.finalPrice * item.quantity), 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
            return;
        }

        // Fetch user addresses
        apiClient.get('/users/profile')
            .then(res => {
                const addr = res.data.data.addresses;
                setAddresses(addr);
                if (addr.length > 0) setSelectedAddressId(addr[0].id);
            })
            .catch(() => {
                addToast({ title: 'Error', description: 'Failed to load addresses. Are you logged in?', type: 'error' });
            });
    }, [items, navigate, addToast]);

    const handleCreateOrder = async () => {
        if (!selectedAddressId) {
            addToast({ title: 'Select Address', description: 'Please select a delivery address', type: 'error' });
            return;
        }

        try {
            const orderPayload = {
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
                shippingAddressId: selectedAddressId
            };

            const res = await apiClient.post('/orders', orderPayload);
            const newOrder = res.data.data;
            setOrderId(newOrder.id);

            // Init payment
            const payRes = await apiClient.post(`/orders/${newOrder.id}/pay`);
            setClientSecret(payRes.data.data.clientSecret);
            setStep(2); // Proceed to payment

        } catch (err: any) {
            addToast({ title: 'Order Failed', description: err.response?.data?.error?.message || 'Could not create order', type: 'error' });
        }
    };

    const handlePaymentSuccess = () => {
        addToast({ title: 'Order Placed!', description: 'Your payment was successful and your order is confirmed.', type: 'success' });
        setItems([]); // Clear cart
        navigate(`/orders/${orderId}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen pb-10">
            {/* Minimal Checkout Header */}
            <header className="bg-white border-b border-gray-300 py-4 px-4 sm:px-10 flex items-center justify-between">
                <Link to="/">
                    <span className="text-3xl font-bold italic tracking-tighter">amazon<span className="text-orange-400">.in</span></span>
                </Link>
                <h1 className="text-2xl font-medium hidden sm:block">Checkout ( {items.length} items )</h1>
                <div className="text-gray-500">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                </div>
            </header>

            <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">

                {/* Main Process Area */}
                <div className="flex-1">
                    {/* Step 1: Address & Order Review */}
                    <div className={`bg-white p-6 shadow-sm border border-gray-200 rounded-sm mb-4 ${step !== 1 ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between">
                            <h2 className="text-lg font-bold flex items-center">
                                <span className="mr-4 text-orange-600">1</span>
                                Delivery address
                            </h2>
                            {step === 2 && <button onClick={() => setStep(1)} className="text-blue-600 hover:underline text-sm">Change</button>}
                        </div>

                        {step === 1 && (
                            <div className="ml-8 mt-4">
                                {addresses.length === 0 ? (
                                    <div className="text-sm text-gray-600 mb-4">You have no saved addresses. Go to your <Link to="/account" className="text-blue-600 hover:underline">Account</Link> to add one.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {addresses.map(addr => (
                                            <label key={addr.id} className={`flex items-start p-3 border rounded-md cursor-pointer ${selectedAddressId === addr.id ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={addr.id}
                                                    checked={selectedAddressId === addr.id}
                                                    onChange={() => setSelectedAddressId(addr.id)}
                                                    className="mt-1 mr-3 text-orange-500 focus:ring-orange-500"
                                                />
                                                <div className="text-sm leading-tight text-gray-800">
                                                    <span className="font-bold block mb-1">{addr.fullName}</span>
                                                    <span>{addr.street}</span><br />
                                                    <span>{addr.city}, {addr.state} {addr.postalCode}</span><br />
                                                    <span>{addr.country}</span><br />
                                                    <span className="text-gray-500">Phone number: {addr.phoneNumber}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-6 bg-gray-50 p-4 border border-gray-200 rounded-sm">
                                    <button
                                        onClick={handleCreateOrder}
                                        disabled={!selectedAddressId}
                                        className="bg-[#ffd814] hover:bg-[#f7ca00] shadow-sm rounded-md py-1.5 px-4 text-sm font-medium focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                                    >
                                        Use this address
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Payment */}
                    <div className={`bg-white p-6 shadow-sm border border-gray-200 rounded-sm ${step !== 2 ? 'opacity-60 pointer-events-none' : ''}`}>
                        <h2 className="text-lg font-bold flex items-center mb-4">
                            <span className="mr-4 text-orange-600">2</span>
                            Payment method
                        </h2>

                        {step === 2 && clientSecret && (
                            <div className="ml-8 border border-gray-200 rounded-md p-6 bg-gray-50">
                                <Elements stripe={stripePromise} options={{ clientSecret }}>
                                    <CheckoutForm clientSecret={clientSecret} totalAmount={total} onSuccess={handlePaymentSuccess} />
                                </Elements>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:w-1/3">
                    <div className="bg-white p-4 sm:p-6 shadow-sm border border-gray-200 rounded-sm">
                        <button
                            disabled={step === 2}
                            onClick={handleCreateOrder}
                            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] shadow-sm rounded-md py-2 text-sm font-medium focus:ring-2 focus:ring-orange-500 disabled:opacity-50 mb-4"
                        >
                            {step === 1 ? 'Use this address' : 'Place your order'}
                        </button>
                        <div className="text-xs text-center text-gray-500 mb-4 pb-4 border-b border-gray-200">
                            By placing your order, you agree to Amazon's <Link to="#" className="text-blue-600 hover:underline">privacy notice</Link> and <Link to="#" className="text-blue-600 hover:underline">conditions of use</Link>.
                        </div>

                        <h3 className="font-bold mb-2">Order Summary</h3>
                        <div className="text-sm space-y-1 mb-2 pb-2 border-b border-gray-200 text-gray-700">
                            <div className="flex justify-between">
                                <span>Items:</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery:</span>
                                <span>₹{shipping.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                        <div className="flex justify-between font-bold text-lg text-red-700 mb-4">
                            <span>Order Total:</span>
                            <span>₹{total.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="bg-gray-100 p-3 rounded-sm text-xs">
                            <span className="text-blue-600 hover:underline cursor-pointer">How are delivery costs calculated?</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
