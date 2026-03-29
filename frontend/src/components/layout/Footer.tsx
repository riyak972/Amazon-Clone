import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white mt-8">
            < div className ="w-full flex justify-center py-4 bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                < span className ="text-sm font-medium">Back to top</span>
      </div >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            < div className ="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                < div >
                <h3 className="font-bold mb-4">Get to Know Us</h3>
                    < ul className ="space-y-2 text-gray-300">
                        < li > <Link to="#" className="hover:underline">About Us</Link></li>
                            < li > <Link to="#" className="hover:underline">Careers</Link></li>
                                < li > <Link to="#" className="hover:underline">Press Releases</Link></li>
                                    < li > <Link to="#" className="hover:underline">Amazon Science</Link></li>
            </ul >
          </div >
          <div>
            <h3 className="font-bold mb-4">Connect with Us</h3>
            <ul className="space-y-2 text-gray-300">
        < li > <Link to="#" className="hover:underline">Facebook</Link></li>
            < li > <Link to="#" className="hover:underline">Twitter</Link></li>
                < li > <Link to="#" className="hover:underline">Instagram</Link></li>
            </ul >
          </div >
          <div>
            <h3 className="font-bold mb-4">Make Money with Us</h3>
            <ul className="space-y-2 text-gray-300">
        < li > <Link to="#" className="hover:underline">Sell on Amazon</Link></li>
            < li > <Link to="#" className="hover:underline">Sell under Amazon Accelerator</Link></li>
                < li > <Link to="#" className="hover:underline">Protect and Build Your Brand</Link></li>
                    < li > <Link to="#" className="hover:underline">Amazon Global Selling</Link></li>
                        < li > <Link to="#" className="hover:underline">Become an Affiliate</Link></li>
            </ul >
          </div >
          <div>
            <h3 className="font-bold mb-4">Let Us Help You</h3>
            <ul className="space-y-2 text-gray-300">
        < li > <Link to="#" className="hover:underline">COVID-19 and Amazon</Link></li>
            < li > <Link to="#" className="hover:underline">Your Account</Link></li>
                < li > <Link to="#" className="hover:underline">Returns Centre</Link></li>
                    < li > <Link to="#" className="hover:underline">100% Purchase Protection</Link></li>
                        < li > <Link to="#" className="hover:underline">Help</Link></li>
            </ul >
          </div >
        </div >
      </div >
        <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
            <p> & copy; 2024, Amazon Clone(Demo Project).No rights reserved.</p >
      </div >
    </footer >
  );
}
