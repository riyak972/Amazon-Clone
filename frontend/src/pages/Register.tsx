import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '../api/client';
import { useToast } from '../components/ui/Toast';

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Passwords must be at least 8 characters'),
    passwordConfirm: z.string(),
}).refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
  path: ["passwordConfirm"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function Register() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        try {
            await apiClient.post('/auth/register', {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password
            });
            addToast({ title: 'Account created', description: 'Please check your email to verify your account.', type: 'success' });
            navigate('/login');
        } catch (err: any) {
            addToast({
                title: 'Problem creating account',
                description: err.response?.data?.error?.message || 'Something went wrong',
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
            < h1 className ="text-3xl font-normal mb-4">Create Account</h1>

                < form onSubmit = { handleSubmit(onSubmit) } className ="space-y-4">
                    < div >
                    <label className="block text-sm font-bold mb-1">First name</label>
                        < input
    {...register('firstName') }
    className = {`w-full px-3 py-1.5 border ${errors.firstName ? 'border-red-500 ring-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`
}
            />
{
    errors.firstName && <span className="text-xs text-red-600">{errors.firstName.message}</span>}
          </div >

          <div>
            <label className="block text-sm font-bold mb-1">Last name</label>
            <input 
              {...register('lastName')}
              className={`w-full px-3 py-1.5 border ${errors.lastName ? 'border-red-500 ring-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`}
            />
    {
        errors.lastName && <span className="text-xs text-red-600">{errors.lastName.message}</span>}
          </div >

          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input 
              {...register('email')}
              className={`w-full px-3 py-1.5 border ${errors.email ? 'border-red-500 ring-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`}
            />
        {
            errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
          </div >

          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input 
              type="password"
            placeholder ="At least 8 characters"
            {...register('password') }
            className = {`w-full px-3 py-1.5 border ${errors.password ? 'border-red-500 ring-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`
        }
            />
        {
            errors.password ? (
                <span className="text-xs text-red-600">{errors.password.message}</span>
            ) : (
                <span className="text-xs text-gray-500 flex items-center mt-1">
                    < svg className ="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    Passwords must be at least 8 characters.
                </span >
            )
        }
          </div >

          <div>
            <label className="block text-sm font-bold mb-1">Password again</label>
            <input 
              type="password"
        {...register('passwordConfirm') }
        className = {`w-full px-3 py-1.5 border ${errors.passwordConfirm ? 'border-red-500 ring-red-500' : 'border-gray-400 focus:border-orange-500'} rounded-sm outline-none focus:ring-1 focus:ring-orange-500`
    }
            />
    {
        errors.passwordConfirm && <span className="text-xs text-red-600">{errors.passwordConfirm.message}</span>}
          </div >

            <button
                type="submit" 
        disabled = { isLoading }
        className ="w-full bg-[#f0c14b] hover:bg-[#ddb347] border border-[#a88734] rounded-sm py-1.5 text-sm font-normal shadow-sm disabled:opacity-50 mt-2"
            >
            { isLoading? 'Creating account...': 'Verify mobile number' }
          </button >
        </form >

            <p className="text-xs mt-4 leading-relaxed">
          By creating an account, you agree to Amazon's <Link to="#" className="text-blue-600 hover:text-orange-500 hover:underline">Conditions of Use</Link> and <Link to="#" className="text-blue-600 hover:text-orange-500 hover:underline">Privacy Notice</Link>.
        </p >

            <div className="mt-6 text-sm">
          Already have an account ? <Link to="/login" className="text-blue-600 hover:text-orange-500 hover:underline inline-flex items-center">Sign in <svg className="w-3 h-3 ml-1 fill-current opacity-60" viewBox="0 0 10 7"><path d="M5.00016 6.54516L0.224182 1.25883L1.13451 0.252075L5.00016 4.53127L8.86582 0.252075L9.77615 1.25883L5.00016 6.54516Z" transform="rotate(-90 5 3.5)"/></svg></Link>
        </div >
      </div >

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
