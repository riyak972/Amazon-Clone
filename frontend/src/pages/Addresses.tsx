import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { useToast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';

const addressSchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    phoneNumber: z.string().min(10, 'Valid 10-digit number required'),
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(5, 'Valid postal code required'),
    country: z.string().default('India'),
});

type AddressForm = z.infer<typeof addressSchema>;

export function Addresses() {
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToast } = useToast();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressForm>({
        resolver: zodResolver(addressSchema) as any,
        defaultValues: { country: 'India' }
    });

    const fetchAddresses = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/users/profile');
            setAddresses(res.data.data.addresses);
        } catch (err) {
            addToast({ title: 'Error', description: 'Failed to fetch addresses', type: 'error' });
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            await apiClient.post('/users/addresses', data);
            addToast({ title: 'Success', description: 'Address added successfully', type: 'success' });
            setIsModalOpen(false);
            reset();
            fetchAddresses();
        } catch (err: any) {
            addToast({ title: 'Error', description: err.response?.data?.error?.message || 'Failed to add address', type: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            await apiClient.delete(`/users/addresses/${id}`);
            addToast({ title: 'Deleted', description: 'Address removed', type: 'success' });
            fetchAddresses();
        } catch (err) {
            addToast({ title: 'Error', description: 'Failed to delete address', type: 'error' });
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-5xl mx-auto p-4 sm:p-6">

                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                    <Link to="/account" className="hover:underline hover:text-orange-500">Your Account</Link>
                    <span>›</span>
                    <span className="text-orange-600">Your Addresses</span>
                </div>

                <h1 className="text-3xl font-normal mb-6">Your Addresses</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add Address Card */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-[280px] cursor-pointer hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <Plus className="h-12 w-12 text-gray-300 mb-2" />
                        <span className="text-lg font-bold">Add Address</span>
                    </div>

                    {isLoading ? (
                        <>
                            <Skeleton className="h-[280px] w-full rounded-lg" />
                            <Skeleton className="h-[280px] w-full rounded-lg" />
                        </>
                    ) : (
                        addresses.map((addr, index) => (
                            <div key={addr.id} className="border border-gray-300 rounded-lg flex flex-col h-[280px] relative">
                                {index === 0 && (
                                    <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 rounded-t-lg flex items-center text-sm font-medium text-gray-600">
                                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> Default
                                    </div>
                                )}

                                <div className={`p-5 flex-1 ${index === 0 ? 'pt-4' : ''}`}>
                                    <p className="font-bold mb-1">{addr.fullName}</p>
                                    <p className="text-sm leading-relaxed text-gray-700">
                                        {addr.street}<br />
                                        {addr.city}, {addr.state} {addr.postalCode}<br />
                                        {addr.country}<br />
                                    </p>
                                    <p className="text-sm mt-3 text-gray-700">Phone number: {addr.phoneNumber}</p>
                                </div>

                                <div className="border-t border-gray-200 px-5 py-3 flex gap-4 text-sm font-medium bg-gray-50 rounded-b-lg">
                                    <button className="text-blue-600 hover:underline">Edit</button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={() => handleDelete(addr.id)} className="text-blue-600 hover:underline">Remove</button>
                                    {index !== 0 && (
                                        <>
                                            <span className="text-gray-300">|</span>
                                            <button className="text-blue-600 hover:underline">Set as Default</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a new address">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pb-4 cursor-auto">
                    <h2 className="text-xl font-bold mb-4 bg-gray-100 p-2 rounded-md">Add a new address</h2>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Country/Region</label>
                            <select {...register('country')} className="w-full px-3 py-2 border border-gray-400 rounded-sm shadow-sm bg-gray-100 focus:ring-1 focus:ring-orange-500 outline-none">
                                <option value="India">India</option>
                                <option value="USA">United States</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Full name (First and Last name)</label>
                            <input {...register('fullName')} className={`w-full px-3 py-1.5 border ${errors.fullName ? 'border-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`} />
                            {errors.fullName && <span className="text-xs text-red-600">{errors.fullName.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Mobile number</label>
                            <input {...register('phoneNumber')} className={`w-full px-3 py-1.5 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Area, Street, Sector, Village</label>
                            <input {...register('street')} className={`w-full px-3 py-1.5 border ${errors.street ? 'border-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">City</label>
                                <input {...register('city')} className={`w-full px-3 py-1.5 border ${errors.city ? 'border-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">State</label>
                                <input {...register('state')} className={`w-full px-3 py-1.5 border ${errors.state ? 'border-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Pincode</label>
                            <input {...register('postalCode')} className={`w-full px-3 py-1.5 border ${errors.postalCode ? 'border-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`} />
                        </div>

                        <button type="submit" className="mt-4 bg-[#ffd814] hover:bg-[#f7ca00] shadow-sm rounded-md py-2 w-full text-sm font-medium focus:ring-2 focus:ring-orange-500">
                            Add address
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
