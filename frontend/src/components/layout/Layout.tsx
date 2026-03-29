import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            < Header />
            <main className="flex-grow w-full max-w-[1500px] mx-auto">
                < Outlet />
      </main >
        <Footer />
    </div >
  );
}
