import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../components/ui/Toast';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email or mobile number'),
    password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuthStore();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const res = await apiClient.post('/auth/login', data);
            login(res.data.data.user, res.data.data.accessToken);
            addToast({ title: 'Welcome back!', description: 'You have successfully logged in.', type: 'success' });
            navigate('/');
        } catch (err: any) {
            addToast({
                title: 'Problem signing in',
                description: err.response?.data?.error?.message || 'Invalid email or password',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-white pt-8">
            < Link to ="/" className="mb-6">
                < span className ="text-3xl font-bold italic tracking-tighter">amazon<span className="text-orange-400">.in</span></span>
      </Link >

        <div className="w-full max-w-[350px] p-6 border border-gray-300 rounded-md shadow-sm">
            < h1 className ="text-3xl font-normal mb-4">Sign in</h1>

                < form onSubmit = { handleSubmit(onSubmit) } className ="space-y-4">
                    < div >
                    <label className="block text-sm font-bold mb-1">Email or mobile phone number</label>
                        < input
    {...register('email') }
    className = {`w-full px-3 py-1.5 border ${errors.email ? 'border-red-500 ring-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`
}
            />
{
    errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
          </div >

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold">Password</label>
              <Link to="/forgot-password" className="text-blue-600 hover:text-orange-500 hover:underline text-sm">Forgot Password</Link>
            </div >
        <input
            type="password"
    {...register('password') }
    className = {`w-full px-3 py-1.5 border ${errors.password ? 'border-red-500 ring-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`
}
            />
{
    errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
          </div >

        <button
            type="submit" 
    disabled = { isLoading }
    className ="w-full bg-[#f0c14b] hover:bg-[#ddb347] border border-[#a88734] rounded-sm py-1.5 text-sm font-normal shadow-sm disabled:opacity-50"
        >
        { isLoading? 'Signing in...': 'Sign in' }
          </button >
        </form >

        <p className="text-xs mt-4 leading-relaxed">
          By continuing, you agree to Amazon's <Link to="#" className="text-blue-600 hover:text-orange-500 hover:underline">Conditions of Use</Link> and <Link to="#" className="text-blue-600 hover:text-orange-500 hover:underline">Privacy Notice</Link>.
        </p >
      </div >

        <div className="w-full max-w-[350px] mt-6 relative flex items-center justify-center">
            < div className ="border-t border-gray-300 w-full absolute"></div>
                < span className ="bg-white px-2 text-xs text-gray-500 relative z-10">New to Amazon?</span>
      </div >

        <Link to="/register" className="w-full max-w-[350px] mt-4 bg-gray-100 hover:bg-gray-200 border border-gray-400 rounded-sm py-1.5 text-sm font-normal shadow-sm text-center">
        Create your Amazon account
      </Link >

        <div className="mt-10 border-t border-gray-100 w-full flex justify-center pt-8">
            < div className ="flex space-x-6 text-xs text-blue-600">
                < Link to ="#" className="hover:text-orange-500 hover:underline">Conditions of Use</Link>
                    < Link to ="#" className="hover:text-orange-500 hover:underline">Privacy Notice</Link>
                        < Link to ="#" className="hover:text-orange-500 hover:underline">Help</Link>
        </div >
      </div >
        <p className="text-xs text-gray-500 mt-2">&copy; 2024, Amazon Clone, Inc. or its affiliates</p>
    </div >
  );
}
