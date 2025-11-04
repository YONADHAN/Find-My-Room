'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import {
  MapPin,
  Bed,
  Youtube,
  Home,
  CheckCircle,
  Shield,
  Car,
  Train,
  PawPrint,
  Ruler,
  ExternalLink,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Star,
  Wifi,
  Wind,
  Tv,
  Lock,
  Building2,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Utensils,
  Droplets,
} from 'lucide-react'

interface Room {
  _id: string
  size: string
  propertyType: string
  furnishingStatus: string
  rent: number
  securityDeposit: number
  floorNumber?: string
  facilities: string[]
  parking: string[]
  distanceToBusStop?: string
  distanceToMetro?: string
  nearestBusStop?: string
  nearestMetro?: string
  allowedFor: string[]
  readyForRent: boolean
  suitableFor: string[]
  mapLink?: string
  petAllowed: boolean
  tags: string[]
  images: string[]
  videos: string[]
  location: { name: string; city: string }
}

const facilityIcons: { [key: string]: React.ReactNode } = {
  WiFi: <Wifi className='w-5 h-5 text-blue-500' />,
  AC: <Wind className='w-5 h-5 text-blue-500' />,
  TV: <Tv className='w-5 h-5 text-blue-500' />,
  Kitchen: <Utensils className='w-5 h-5 text-blue-500' />,
  Bathroom: <Droplets className='w-5 h-5 text-blue-500' />,
  Security: <Lock className='w-5 h-5 text-blue-500' />,
}

export default function RoomDetailsPage() {
  const { id } = useParams()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`)
        const data = await res.json()
        if (data.success) setRoom(data.data)
      } catch (err) {
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRoom()
  }, [id])

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null

    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`
      }
    }

    return null
  }

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Loading room details...</p>
        </div>
      </div>
    )

  if (!room)
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        <div className='text-center'>
          <X className='mx-auto w-20 h-20 text-red-500 mb-4' />
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Room Not Found
          </h1>
          <p className='text-gray-600'>
            This listing may be unavailable or has been removed.
          </p>
        </div>
      </div>
    )

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <div className='max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8'>
        {/* Hero Section with Videos */}
        {room.videos && room.videos.length > 0 && (
          <section className='bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center'>
                <Youtube className='w-6 h-6 text-white' />
              </div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Video Tours
              </h2>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
              {room.videos}
              {room.videos.map((url, index) => {
                const embedUrl = getYouTubeEmbedUrl(url)
                return embedUrl ? (
                  <div
                    key={index}
                    className='relative aspect-video rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all group'
                  >
                    <iframe
                      src={embedUrl}
                      title={`Room Video Tour ${index + 1}`}
                      className='w-full h-full'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                      allowFullScreen
                      loading='lazy'
                    ></iframe>
                    <div className='absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
                      <Play className='w-3 h-3' />
                      Video {index + 1}
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {room.images.length > 0 && (
          <section className='bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center'>
                <Star className='w-6 h-6 text-white' />
              </div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Photo Gallery
              </h2>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {room.images.slice(0, 8).map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentImage(i)
                    setShowGallery(true)
                  }}
                  className='relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-gray-200 hover:border-blue-400 group'
                >
                  <Image
                    src={img.startsWith('http') ? img : `/uploads/${img}`}
                    alt={`Gallery ${i + 1}`}
                    fill
                    className='object-cover group-hover:opacity-90 transition'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3'>
                    <span className='text-white font-semibold text-sm'>
                      View Image
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {room.images.length > 8 && (
              <button
                onClick={() => {
                  setCurrentImage(0)
                  setShowGallery(true)
                }}
                className='mt-6 mx-auto block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105'
              >
                View All {room.images.length} Photos
              </button>
            )}
          </section>
        )}

        {/* Room Basic Info */}
        <section className='bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-blue-200'>
          <div className='flex flex-wrap gap-3 mb-6'>
            <span className='px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-lg'>
              {room.propertyType}
            </span>
            {room.readyForRent && (
              <span className='px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg'>
                <CheckCircle className='w-4 h-4' /> Ready to Move
              </span>
            )}
            {room.petAllowed && (
              <span className='px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-lg'>
                <PawPrint className='w-4 h-4' /> Pet Friendly
              </span>
            )}
            <span className='px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg'>
              {room.furnishingStatus}
            </span>
          </div>

          <h1 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
            {room.size} {room.propertyType}
          </h1>

          <div className='flex items-start gap-3 text-gray-700 mb-6'>
            <MapPin className='text-blue-500 w-6 h-6 flex-shrink-0 mt-1' />
            <div>
              <p className='text-xl font-semibold'>{room.location.name}</p>
              <p className='text-gray-600'>{room.location.city}</p>
            </div>
          </div>

          {room.mapLink && (
            <a
              href={room.mapLink}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all shadow-md hover:shadow-lg transform hover:scale-105'
            >
              <ExternalLink className='w-5 h-5' /> Open in Google Maps
            </a>
          )}
        </section>

        {/* Pricing */}
        <section className='bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl shadow-2xl p-6 md:p-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
            <div>
              <p className='text-lg opacity-90 mb-1'>Monthly Rent</p>
              <h2 className='text-5xl font-bold mb-2'>
                ₹{room.rent.toLocaleString()}
              </h2>
              <p className='text-lg opacity-90'>
                Security Deposit: ₹{room.securityDeposit.toLocaleString()}
              </p>
            </div>
            <div className='flex gap-3 flex-wrap'>
              <button
                onClick={() => setSaved(!saved)}
                className='px-6 py-3 bg-white text-blue-600 font-bold rounded-full flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105'
              >
                <Heart className={saved ? 'fill-red-500 text-red-500' : ''} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <button className='px-6 py-3 bg-white text-blue-600 font-bold rounded-full flex items-center gap-2 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105'>
                <Share2 /> Share
              </button>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className='bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center'>
              <Shield className='w-6 h-6 text-white' />
            </div>
            <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Facilities & Amenities
            </h2>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {room.facilities.map((f, i) => (
              <div
                key={i}
                className='bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all border border-blue-200 hover:border-blue-400 transform hover:scale-105'
              >
                <div className='w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm'>
                  {facilityIcons[f] || (
                    <CheckCircle className='w-6 h-6 text-blue-500' />
                  )}
                </div>
                <p className='font-bold text-gray-700 text-center text-sm'>
                  {f}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Transport & Parking */}
        <section className='grid lg:grid-cols-2 gap-6'>
          <div className='bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center'>
                <Train className='w-6 h-6 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>
                Nearby Transport
              </h3>
            </div>

            <div className='space-y-4'>
              {room.nearestMetro && (
                <div className='flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200'>
                  <span className='text-2xl'>🚆</span>
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {room.nearestMetro}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {room.distanceToMetro}
                    </p>
                  </div>
                </div>
              )}
              {room.nearestBusStop && (
                <div className='flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200'>
                  <span className='text-2xl'>🚌</span>
                  <div>
                    <p className='font-semibold text-gray-800'>
                      {room.nearestBusStop}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {room.distanceToBusStop}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-blue-100'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center'>
                <Car className='w-6 h-6 text-white' />
              </div>
              <h3 className='text-2xl font-bold text-gray-800'>
                Parking Available
              </h3>
            </div>

            <div className='flex flex-wrap gap-3'>
              {room.parking.map((p, i) => (
                <span
                  key={i}
                  className='px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-bold shadow-md'
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className='bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 text-center'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Ready to Visit?
          </h2>
          <p className='text-blue-100 text-lg mb-8 max-w-2xl mx-auto'>
            Get in touch with the owner to schedule a visit and learn more about
            this amazing property!
          </p>

          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <a
              href='tel:+919876543210'
              className='px-8 py-4 bg-white text-blue-600 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105'
            >
              <Phone className='w-5 h-5' /> Call Now
            </a>
            <a
              href='https://wa.me/919876543210'
              target='_blank'
              rel='noopener noreferrer'
              className='px-8 py-4 bg-green-500 text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-green-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105'
            >
              <MessageCircle className='w-5 h-5' /> WhatsApp
            </a>
          </div>
        </section>
      </div>

      {/* Fullscreen Gallery Modal */}
      {showGallery && (
        <div className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4'>
          <div className='relative max-w-6xl w-full'>
            <button
              onClick={() => setShowGallery(false)}
              className='absolute -top-16 right-0 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all z-10'
            >
              <X className='text-white w-6 h-6' />
            </button>

            <div className='relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl'>
              <Image
                src={
                  room.images[currentImage].startsWith('http')
                    ? room.images[currentImage]
                    : `/uploads/${room.images[currentImage]}`
                }
                alt={`Gallery ${currentImage + 1}`}
                fill
                className='object-contain'
              />
            </div>

            <div className='flex justify-center items-center gap-6 mt-6'>
              <button
                onClick={() =>
                  setCurrentImage(
                    (i) => (i - 1 + room.images.length) % room.images.length
                  )
                }
                className='w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all'
              >
                <ChevronLeft className='text-white w-6 h-6' />
              </button>

              <div className='text-center'>
                <p className='text-white text-lg font-semibold'>
                  {currentImage + 1} / {room.images.length}
                </p>
              </div>

              <button
                onClick={() =>
                  setCurrentImage((i) => (i + 1) % room.images.length)
                }
                className='w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all'
              >
                <ChevronRight className='text-white w-6 h-6' />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
