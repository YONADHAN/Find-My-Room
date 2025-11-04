'use client'
import React from 'react'

const SortBy = ({ onSortChange }) => {
  return (
    <div>
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className='border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      >
        <option value=''>Sort By</option>
        <option value='priceLow'>Rent: Low to High</option>
        <option value='priceHigh'>Rent: High to Low</option>
        <option value='newest'>Newest First</option>
        <option value='oldest'>Oldest First</option>
      </select>
    </div>
  )
}

export default SortBy
