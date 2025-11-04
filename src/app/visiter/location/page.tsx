'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { locationService } from '@/lib/services/location/locationService'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, MapPin, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Location {
  _id: string
  name: string
  city: string
  description?: string
  image?: string
}

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getAll()
        setLocations(data)
      } catch (error: any) {
        toast.error('❌ Failed to load locations')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  if (loading)
    return (
      <div className='flex flex-col justify-center items-center h-[70vh] gap-4'>
        <Loader2 className='animate-spin w-12 h-12 text-blue-600' />
        <p className='text-gray-500 font-medium'>Loading amazing places...</p>
      </div>
    )

  if (locations.length === 0)
    return (
      <div className='flex flex-col items-center justify-center h-[70vh] gap-4'>
        <div className='w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center'>
          <MapPin className='w-10 h-10 text-blue-600' />
        </div>
        <h3 className='text-2xl font-bold text-gray-800'>No Locations Yet</h3>
        <p className='text-gray-500 text-center max-w-md'>
          We're working on adding amazing locations for you. Check back soon!
        </p>
      </div>
    )

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'>
      {/* Hero Section */}
      <div className='relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20 px-6'>
        <div className='absolute inset-0 bg-black/10' />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='relative max-w-7xl mx-auto text-center'
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className='inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4'
          >
            <Sparkles className='w-4 h-4 text-yellow-300' />
            <span className='text-white text-sm font-medium'>
              {locations.length} Premium Locations
            </span>
          </motion.div>

          <h1 className='text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg'>
            Discover Your Perfect Stay
          </h1>
          <p className='text-xl text-white/90 max-w-2xl mx-auto'>
            Explore handpicked locations across the city, tailored for comfort
            and convenience
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className='absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl' />
        <div className='absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl' />
      </div>

      {/* Locations Grid */}
      <div className='max-w-7xl mx-auto px-6 py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {locations.map((loc, index) => (
            <motion.div
              key={loc._id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className='group cursor-pointer'
              onClick={() => router.push(`/visitors/location/${loc._id}`)}
            >
              <Card className='overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl bg-white h-full'>
                {/* Image Container */}
                <div className='relative w-full h-64 overflow-hidden'>
                  <Image
                    src={'/test/img.jpg'}
                    alt={loc.name}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                  />

                  {/* Gradient Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

                  {/* Floating Badge */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className='absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg'
                  >
                    <div className='flex items-center gap-1.5'>
                      <MapPin size={14} className='text-blue-600' />
                      <span className='text-xs font-semibold text-gray-800'>
                        {loc.city}
                      </span>
                    </div>
                  </motion.div>

                  {/* Hover Arrow */}
                  <motion.div className='absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <ArrowRight className='w-5 h-5 text-blue-600' />
                  </motion.div>
                </div>

                {/* Content */}
                <CardContent className='p-6'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300'>
                    {loc.name}
                  </h2>

                  <p className='text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed'>
                    {loc.description ||
                      'Experience luxury and comfort in this premium location with world-class amenities.'}
                  </p>

                  {/* Action Button */}
                  <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                    <span className='text-sm font-medium text-gray-500'>
                      Available Rooms
                    </span>
                    <div className='flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-300'>
                      <span className='text-sm'>Explore</span>
                      <ArrowRight className='w-4 h-4' />
                    </div>
                  </div>
                </CardContent>

                {/* Bottom Accent */}
                <div className='h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className='max-w-4xl mx-auto px-6 pb-20 text-center'
      >
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden'>
          <div className='absolute inset-0 bg-black/10' />
          <div className='relative'>
            <h3 className='text-3xl font-bold text-white mb-4'>
              Can't Find What You're Looking For?
            </h3>
            <p className='text-white/90 mb-6 max-w-2xl mx-auto'>
              Get in touch with our team and we'll help you find the perfect
              location for your needs
            </p>
            <button className='bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'>
              Contact Us
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LocationsPage
