'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import FilterSidebar from '@/components/specific/rooms/FilterSidebar'
import SearchBar from '@/components/specific/rooms/SearchBar'
import SortBy from '@/components/specific/rooms/SortBy'
import RoomCard from '@/components/specific/rooms/RoomCard'
import Pagination from '@/components/reusable/pagination/pagination'
import { roomService } from '@/lib/services/room/roomService'
import { SlidersHorizontal } from 'lucide-react'

export default function RoomsPage() {
  const { id } = useParams()
  const [filteredRooms, setFilteredRooms] = useState([])
  const [filters, setFilters] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Fetch rooms from API (handles all filtering, searching, sorting)
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true)
      try {
        console.log({
          locationId: id as string,
          filters,
          searchQuery,
          sortOption,
          page,
          limit: 10,
        })
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
        setFilteredRooms([])
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchRooms()
  }, [id, filters, searchQuery, sortOption, page])

  // Reset to page 1 when filters/search/sort change
  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    }
  }, [filters, searchQuery, sortOption])

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-6'>
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className='lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition'
          aria-label='Open filters'
        >
          <SlidersHorizontal size={24} />
        </button>

        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Filter Sidebar */}
          <aside className='w-full lg:w-80 flex-shrink-0'>
            <div className='hidden lg:block'>
              <FilterSidebar
                isOpen={true}
                onClose={() => {}}
                isMobile={false}
                onFilterChange={setFilters}
              />
            </div>
            {/* Mobile Sidebar */}
            {isSidebarOpen && (
              <FilterSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={true}
                onFilterChange={setFilters}
              />
            )}
          </aside>

          {/* Main Section */}
          <main className='flex-1'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
              <SearchBar onSearch={setSearchQuery} />
              <SortBy onSortChange={setSortOption} />
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className='text-center py-10'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                <p className='text-gray-600 mt-4'>Loading rooms...</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                {filteredRooms.length > 0 && (
                  <p className='text-sm text-gray-600 mb-4'>
                    Showing {filteredRooms.length} of {totalPages * 10} room(s)
                  </p>
                )}

                {/* Rooms Grid */}
                {filteredRooms.length === 0 ? (
                  <div className='text-center py-10'>
                    <p className='text-gray-600 text-lg'>No rooms found.</p>
                    <p className='text-gray-500 text-sm mt-2'>
                      Try adjusting your filters or search query
                    </p>
                  </div>
                ) : (
                  <>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                      {filteredRooms.map((room) => (
                        <RoomCard key={room._id} room={room} />
                      ))}
                    </div>

                    {/* Pagination - OUTSIDE the grid */}
                    {totalPages > 1 && (
                      <div className='flex justify-center mt-8'>
                        <Pagination
                          currentPage={page}
                          totalPages={totalPages}
                          onPageChange={(newPage) => setPage(newPage)}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
