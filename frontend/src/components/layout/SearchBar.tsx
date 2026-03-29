import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: suggestions } = useQuery({
        queryKey: ['suggestions', query],
        queryFn: async () => {
            if (query.length < 2) return [];
            const res = await apiClient.get(`/search/suggestions?q=${query}`);
            return res.data.data;
        },
        enabled: query.length >= 2,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setShowSuggestions(false);
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleSuggestionClick = (title: string) => {
        setQuery(title);
        setShowSuggestions(false);
        navigate(`/search?q=${encodeURIComponent(title)}`);
    };

    return (
        <div ref={wrapperRef} className="flex-1 flex px-4 relative">
            < form onSubmit = { handleSearch } className ="flex w-full">
                < select className ="bg-gray-100 border border-gray-300 rounded-l-md px-2 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-400 border-r-0 cursor-pointer w-auto lg:w-32 hidden md:block">
                    < option > All Categories</option >
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Home & Kitchen</option>
        </select >

        <input
            type="text"
    value = { query }
    onChange = {(e) => {
        setQuery(e.target.value);
        setShowSuggestions(true);
    }
}
onFocus = {() => setShowSuggestions(true)}
placeholder ="Search Amazon.in"
className ="flex-1 py-2 px-3 border border-gray-300 md:border-l-0 rounded-l-md md:rounded-l-none outline-none focus:ring-2 focus:ring-orange-400 z-10"
    />

    <button
        type="submit"
className ="bg-orange-400 hover:bg-orange-500 px-4 py-2 border border-orange-400 rounded-r-md transition-colors text-gray-900 cursor-pointer flex items-center justify-center"
    >
    <Search className="h-5 w-5" />
        </button >
      </form >

    {/* Autocomplete Dropdown */ }
{
    showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="absolute top-12 left-4 md:left-[9rem] right-14 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
            < ul className ="py-1">
    {
        suggestions.map((item: any) => (
            <li
                key={item.id}
                onClick={() => handleSuggestionClick(item.title)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-800 flex items-center"
        >
        <Search className="h-4 w-4 text-gray-400 mb-0.5 mr-2" />
                { item.title }
              </li >
            ))
    }
          </ul >
        </div >
      )
}
    </div >
  );
}
