'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Home,
  BedDouble,
  Users,
  Car,
  Bus,
  MapPin,
  PawPrint,
  ChevronRight,
  Star,
} from 'lucide-react'

interface Room {
  _id: string
  size: string
  propertyType: string
  furnishingStatus: string
  rent: number
  securityDeposit: number
  floorNumber?: string
  facilities?: string[]
  parking?: string[]
  allowedFor?: string[]
  suitableFor?: string[]
  petAllowed?: boolean
  tags?: string[]
  images?: string[]
  location?: { name?: string }
}

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter()
  const [currentImage, setCurrentImage] = useState(0)

  return (
    <div className='bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100'>
      {/* 🖼 Image Section */}
      <div className='relative h-56 bg-gray-100'>
        {/* Tag */}
        {room.tags && room.tags.length > 0 && (
          <span className='absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full'>
            {room.tags[0]}
          </span>
        )}

        {/* Pet Allowed */}
        {room.petAllowed && (
          <span className='absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1'>
            <PawPrint size={12} /> Pets
          </span>
        )}

        {/* Image Display */}
        {room.images && room.images.length > 0 ? (
          <Image
            src={`/uploads/${room.images[currentImage]}`}
            alt={room.size}
            fill
            className='object-cover'
            unoptimized
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center'>
            <Home size={48} className='text-gray-400' />
          </div>
        )}

        {/* Image Dots */}
        {room.images && room.images.length > 1 && (
          <div className='absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5'>
            {room.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={`w-2.5 h-2.5 rounded-full ${
                  currentImage === i ? 'bg-white' : 'bg-white/50'
                }`}
              ></button>
            ))}
          </div>
        )}
      </div>

      {/* 🧾 Content */}
      <div className='p-5'>
        {/* Rent and Deposit */}
        <div className='flex items-start justify-between mb-3'>
          <div>
            <h3 className='text-lg font-semibold text-gray-900'>
              {room.propertyType} • {room.size}
            </h3>
            <p className='text-sm text-gray-500 capitalize'>
              {room.furnishingStatus}
            </p>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-blue-600'>
              ₹{room.rent.toLocaleString()}
            </div>
            <p className='text-xs text-gray-500'>/ month</p>
          </div>
        </div>

        {/* Details */}
        <div className='grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4'>
          <div className='flex items-center gap-2'>
            <BedDouble size={16} className='text-blue-500' />
            {room.floorNumber || 'N/A'}
          </div>
          <div className='flex items-center gap-2'>
            <Users size={16} className='text-blue-500' />
            {room.allowedFor?.join(', ') || 'Anyone'}
          </div>
          <div className='flex items-center gap-2'>
            <Car size={16} className='text-blue-500' />
            {room.parking?.join(', ') || 'No parking'}
          </div>
          <div className='flex items-center gap-2'>
            <Bus size={16} className='text-blue-500' />
            {room.nearestBusStop || 'No info'}
          </div>
        </div>

        {/* Facilities */}
        {room.facilities && room.facilities.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {room.facilities.slice(0, 4).map((facility) => (
              <span
                key={facility}
                className='bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full'
              >
                {facility}
              </span>
            ))}
            {room.facilities.length > 4 && (
              <span className='text-xs text-gray-500'>
                +{room.facilities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Deposit and Info */}
        <div className='flex items-center justify-between text-sm text-gray-600 mb-4'>
          <span>
            Deposit:{' '}
            <span className='font-medium'>
              ₹{room.securityDeposit.toLocaleString()}
            </span>
          </span>
          {room.readyForRent && (
            <span className='text-green-600 font-semibold'>Ready to Move</span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => router.push(`/visitor/room/${room._id}`)}
          className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2'
        >
          View Room
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
