'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import FilterSidebar from '@/components/specific/rooms/FilterSidebar'
import SearchBar from '@/components/specific/rooms/SearchBar'
import SortBy from '@/components/specific/rooms/SortBy'
import RoomCard from '@/components/specific/rooms/RoomCard'

import Pagination from '@/components/reusable/pagination/pagination'
import { roomService } from '@/lib/services/room/roomService'
export default function RoomsPage() {
  const { id } = useParams()
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomService.getFilteredRooms({
          locationId: id as string,
          filters,
          searchQuery,
          sortOption,
          page,
          limit: 10,
        })
        setFilteredRooms(res.data)
        setTotalPages(res.pagination.totalPages)
      } catch (err) {
        console.error('Error fetching paginated rooms:', err)
      }
    }

    if (id) fetchRooms()
  }, [id, filters, searchQuery, sortOption, page])

  // ✅ Apply filters, search, and sorting
  useEffect(() => {
    let updated = [...rooms]

    // Search
    if (searchQuery) {
      updated = updated.filter((room) =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filters (example: furnished or price)
    if (filters.furnished) {
      updated = updated.filter((room) => room.furnished === filters.furnished)
    }

    // Sort
    if (sortOption === 'priceLow') updated.sort((a, b) => a.price - b.price)
    if (sortOption === 'priceHigh') updated.sort((a, b) => b.price - a.price)
    if (sortOption === 'ratingHigh') updated.sort((a, b) => b.rating - a.rating)

    setFilteredRooms(updated)
  }, [filters, searchQuery, sortOption, rooms])

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6'>
        {/* Filter Sidebar */}
        <aside className='w-full lg:w-80 flex-shrink-0'>
          <FilterSidebar onFilterChange={setFilters} />
        </aside>

        {/* Main Section */}
        <main className='flex-1'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
            <SearchBar onSearch={setSearchQuery} />
            <SortBy onSortChange={setSortOption} />
          </div>

          {/* Rooms Grid */}
          {filteredRooms.length === 0 ? (
            <p className='text-center text-gray-600 py-10'>No rooms found.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {filteredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
