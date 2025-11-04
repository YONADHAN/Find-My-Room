'use client'
import React, { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

const FilterSidebar = ({ isOpen, onClose, isMobile, setFilters }) => {
  const [selectedTenants, setSelectedTenants] = useState([])
  const [selectedProperty, setSelectedProperty] = useState([])
  const [selectedLooking, setSelectedLooking] = useState([])
  const [selectedRent, setSelectedRent] = useState('')

  const tenantOptions = ['Bachelors', 'Family', 'Mixed', 'Unmarried Couples']
  const propertyTypes = ['Apartment', 'Flat', 'House', 'PG']
  const lookingFor = ['Students', 'Working Professionals', 'Family']

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleApply = () => {
    setFilters({
      tenants: selectedTenants,
      propertyType: selectedProperty,
      lookingFor: selectedLooking,
      rent: selectedRent,
    })
    if (isMobile) onClose()
  }

  const handleReset = () => {
    setSelectedTenants([])
    setSelectedProperty([])
    setSelectedLooking([])
    setSelectedRent('')
    setFilters({})
  }

  if (!isOpen && isMobile) return null

  return (
    <div
      className={`bg-white ${
        isMobile ? 'fixed inset-0 z-50 overflow-y-auto' : 'sticky top-4'
      } ${isMobile ? 'p-6' : 'p-4'} rounded-lg shadow-md`}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-lg font-bold text-blue-600 flex items-center gap-2'>
          <SlidersHorizontal size={18} />
          Filter Properties
        </h2>
        {isMobile ? (
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full'
          >
            <X size={24} />
          </button>
        ) : (
          <button
            onClick={handleReset}
            className='text-blue-600 text-sm hover:underline'
          >
            Reset
          </button>
        )}
      </div>

      {/* Rent Range */}
      <div className='mb-6'>
        <label className='block text-sm font-semibold text-gray-700 mb-2'>
          Rent Range
        </label>
        <select
          value={selectedRent}
          onChange={(e) => setSelectedRent(e.target.value)}
          className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        >
          <option value=''>Select rent range</option>
          <option value='10000-15000'>₹10,000 - ₹15,000</option>
          <option value='15000-20000'>₹15,000 - ₹20,000</option>
          <option value='20000-25000'>₹20,000 - ₹25,000</option>
          <option value='25000+'>₹25,000+</option>
        </select>
      </div>

      {/* Preferred Tenants */}
      <div className='mb-6'>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>
          Preferred Tenants
        </label>
        <div className='flex flex-wrap gap-2'>
          {tenantOptions.map((option) => (
            <button
              key={option}
              onClick={() =>
                toggleSelection(option, selectedTenants, setSelectedTenants)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedTenants.includes(option)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className='mb-6'>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>
          Property Type
        </label>
        <div className='flex flex-wrap gap-2'>
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() =>
                toggleSelection(type, selectedProperty, setSelectedProperty)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedProperty.includes(type)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Looking For */}
      <div className='mb-6'>
        <label className='block text-sm font-semibold text-gray-700 mb-3'>
          Looking for
        </label>
        <div className='flex flex-wrap gap-2'>
          {lookingFor.map((option) => (
            <button
              key={option}
              onClick={() =>
                toggleSelection(option, selectedLooking, setSelectedLooking)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedLooking.includes(option)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition'
      >
        Apply Filters
      </button>
    </div>
  )
}

export default FilterSidebar
