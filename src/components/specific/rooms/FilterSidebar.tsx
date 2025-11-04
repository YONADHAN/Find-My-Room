'use client'
import React, { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

const FilterSidebar = ({ isOpen, onClose, isMobile, onFilterChange }) => {
  const [selectedAllowedFor, setSelectedAllowedFor] = useState([])
  const [selectedPropertyType, setSelectedPropertyType] = useState([])
  const [selectedFurnishing, setSelectedFurnishing] = useState([])
  const [selectedSuitableFor, setSelectedSuitableFor] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [selectedParking, setSelectedParking] = useState([])
  const [rentRange, setRentRange] = useState({ min: '', max: '' })
  const [petAllowed, setPetAllowed] = useState(false)
  const [readyForRent, setReadyForRent] = useState(true)

  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState({
    rent: true,
    allowedFor: true,
    propertyType: true,
    furnishing: true,
    suitableFor: true,
    facilities: false,
    parking: false,
    other: false,
  })

  const allowedForOptions = ['Bachelors', 'Family', 'Mixed']
  const propertyTypes = ['Room', 'Flat', 'PG']
  const furnishingOptions = ['Furnished', 'Semi-furnished', 'Unfurnished']
  const suitableForOptions = ['Students', 'Working Professionals']
  const facilitiesOptions = [
    'AC',
    'Fridge',
    'Washing Machine',
    'WiFi',
    'TV',
    'Geyser',
    'Bed',
    'Wardrobe',
  ]
  const parkingOptions = ['Car', 'Bike', 'Both']

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleApply = () => {
    const filterObj = {
      allowedFor:
        selectedAllowedFor.length > 0 ? selectedAllowedFor : undefined,
      propertyType:
        selectedPropertyType.length > 0 ? selectedPropertyType : undefined,
      furnishingStatus:
        selectedFurnishing.length > 0 ? selectedFurnishing : undefined,
      suitableFor:
        selectedSuitableFor.length > 0 ? selectedSuitableFor : undefined,
      facilities:
        selectedFacilities.length > 0 ? selectedFacilities : undefined,
      parking: selectedParking.length > 0 ? selectedParking : undefined,
      rentRange: rentRange.min || rentRange.max ? rentRange : undefined,
      petAllowed: petAllowed || undefined,
      readyForRent: readyForRent,
    }

    // Remove undefined values
    Object.keys(filterObj).forEach(
      (key) => filterObj[key] === undefined && delete filterObj[key]
    )

    //setFilters(filterObj)
    onFilterChange(filterObj)
    if (isMobile) onClose()
  }

  const handleReset = () => {
    setSelectedAllowedFor([])
    setSelectedPropertyType([])
    setSelectedFurnishing([])
    setSelectedSuitableFor([])
    setSelectedFacilities([])
    setSelectedParking([])
    setRentRange({ min: '', max: '' })
    setPetAllowed(false)
    setReadyForRent(true)
    onFilterChange({})
  }

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className='mb-4 border-b border-gray-200 pb-4'>
      <button
        onClick={onToggle}
        className='flex items-center justify-between w-full text-left mb-3'
      >
        <label className='text-sm font-semibold text-gray-700'>{title}</label>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isExpanded && children}
    </div>
  )

  if (!isOpen && isMobile) return null

  return (
    <div
      className={`bg-white ${
        isMobile
          ? 'fixed inset-0 z-50 overflow-y-auto'
          : 'sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto'
      } ${isMobile ? 'p-6' : 'p-4'} rounded-lg shadow-md`}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-6 sticky top-0 bg-white pb-3 border-b border-gray-200'>
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
            Reset All
          </button>
        )}
      </div>

      {/* Rent Range */}
      <FilterSection
        title='Rent Range'
        isExpanded={expandedSections.rent}
        onToggle={() => toggleSection('rent')}
      >
        <div className='space-y-3'>
          <div className='flex gap-2 items-center'>
            <input
              type='number'
              placeholder='Min (₹)'
              value={rentRange.min}
              onChange={(e) =>
                setRentRange({ ...rentRange, min: e.target.value })
              }
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <span className='text-gray-500'>-</span>
            <input
              type='number'
              placeholder='Max (₹)'
              value={rentRange.max}
              onChange={(e) =>
                setRentRange({ ...rentRange, max: e.target.value })
              }
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <div className='flex flex-wrap gap-2'>
            {['10000-15000', '15000-20000', '20000-25000', '25000-30000'].map(
              (range) => {
                const [min, max] = range.split('-')
                return (
                  <button
                    key={range}
                    onClick={() => setRentRange({ min, max })}
                    className='px-3 py-1 text-xs bg-gray-100 hover:bg-blue-100 rounded-full'
                  >
                    ₹{parseInt(min).toLocaleString()} - ₹
                    {parseInt(max).toLocaleString()}
                  </button>
                )
              }
            )}
          </div>
        </div>
      </FilterSection>

      {/* Allowed For */}
      <FilterSection
        title='Allowed For'
        isExpanded={expandedSections.allowedFor}
        onToggle={() => toggleSection('allowedFor')}
      >
        <div className='flex flex-wrap gap-2'>
          {allowedForOptions.map((option) => (
            <button
              key={option}
              onClick={() =>
                toggleSelection(
                  option,
                  selectedAllowedFor,
                  setSelectedAllowedFor
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedAllowedFor.includes(option)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection
        title='Property Type'
        isExpanded={expandedSections.propertyType}
        onToggle={() => toggleSection('propertyType')}
      >
        <div className='flex flex-wrap gap-2'>
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() =>
                toggleSelection(
                  type,
                  selectedPropertyType,
                  setSelectedPropertyType
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedPropertyType.includes(type)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Furnishing Status */}
      <FilterSection
        title='Furnishing'
        isExpanded={expandedSections.furnishing}
        onToggle={() => toggleSection('furnishing')}
      >
        <div className='flex flex-wrap gap-2'>
          {furnishingOptions.map((option) => (
            <button
              key={option}
              onClick={() =>
                toggleSelection(
                  option,
                  selectedFurnishing,
                  setSelectedFurnishing
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedFurnishing.includes(option)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Suitable For */}
      <FilterSection
        title='Suitable For'
        isExpanded={expandedSections.suitableFor}
        onToggle={() => toggleSection('suitableFor')}
      >
        <div className='flex flex-wrap gap-2'>
          {suitableForOptions.map((option) => (
            <button
              key={option}
              onClick={() =>
                toggleSelection(
                  option,
                  selectedSuitableFor,
                  setSelectedSuitableFor
                )
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedSuitableFor.includes(option)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Facilities */}
      <FilterSection
        title='Facilities'
        isExpanded={expandedSections.facilities}
        onToggle={() => toggleSection('facilities')}
      >
        <div className='flex flex-wrap gap-2'>
          {facilitiesOptions.map((facility) => (
            <button
              key={facility}
              onClick={() =>
                toggleSelection(
                  facility,
                  selectedFacilities,
                  setSelectedFacilities
                )
              }
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                selectedFacilities.includes(facility)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {facility}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Parking */}
      <FilterSection
        title='Parking'
        isExpanded={expandedSections.parking}
        onToggle={() => toggleSection('parking')}
      >
        <div className='flex flex-wrap gap-2'>
          {parkingOptions.map((option) => (
            <button
              key={option}
              onClick={() =>
                toggleSelection(option, selectedParking, setSelectedParking)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedParking.includes(option)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Other Options */}
      <FilterSection
        title='Other Options'
        isExpanded={expandedSections.other}
        onToggle={() => toggleSection('other')}
      >
        <div className='space-y-3'>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={petAllowed}
              onChange={(e) => setPetAllowed(e.target.checked)}
              className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
            />
            <span className='text-sm text-gray-700'>Pet Allowed</span>
          </label>
          <label className='flex items-center gap-2 cursor-pointer'>
            <input
              type='checkbox'
              checked={readyForRent}
              onChange={(e) => setReadyForRent(e.target.checked)}
              className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
            />
            <span className='text-sm text-gray-700'>Ready for Rent</span>
          </label>
        </div>
      </FilterSection>

      {/* Apply Button */}
      <div className='sticky bottom-0 bg-white pt-4'>
        <button
          onClick={handleApply}
          className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg'
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default FilterSidebar
