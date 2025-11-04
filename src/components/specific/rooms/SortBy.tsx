'use client'
import React from 'react'

const SortBy = ({ onSortChange }) => {
  return (
    <div>
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className='border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500'
      >
        <option value=''>Sort By</option>
        <option value='priceLow'>Price: Low to High</option>
        <option value='priceHigh'>Price: High to Low</option>
      </select>
    </div>
  )
}

export default SortBy
