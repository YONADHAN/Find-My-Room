'use client'
import React, { useState } from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    onSearch(query)
  }

  return (
    <div className='flex items-center gap-2 w-full sm:w-auto'>
      <input
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search rooms...'
        className='border border-gray-300 rounded-lg p-2 w-full sm:w-64 focus:ring-2 focus:ring-blue-500'
      />
      <button
        onClick={handleSearch}
        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1'
      >
        <Search size={18} />
        Search
      </button>
    </div>
  )
}

export default SearchBar
