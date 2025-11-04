'use client'
import { useState } from 'react'
import { MapPin, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const popularLocations = [
  'Kaloor',
  'Kalamassery',
  'Tripunithura',
  'Kathrikadavu',
  'Maradu',
  'Palarivattom',
  'Thrikkakara',
  'Kundannoor',
  'Pathadipalam',
  'Kadavanthra',
  'Ernakulam North',
  'Fort Kochi',
]

export default function HeroSection() {
  const [selected, setSelected] = useState('')
  const router = useRouter()
  const navigateToLocations = () => router.push('/locations')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <section className='relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 overflow-hidden'>
      {/* Decorative background elements */}

      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float' />
        <div
          className='absolute bottom-20 left-10 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-float'
          style={{ animationDelay: '1s' }}
        />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/30 to-sky-100/30 rounded-full blur-3xl' />
      </div>

      <div className='relative container mx-auto px-4 py-16 md:py-24'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='text-center'
        >
          {/* Main heading */}
          <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight'>
            🏠 Your Next Room is{' '}
            <span className='bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent'>
              Just a Tap Away!
            </span>
          </h1>

          {/* Subheading */}
          <p className='text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto'>
            Discover comfortable rooms and hostels in Kochi&apos;s prime
            locations
          </p>

          {/* How to use */}
          <div className='flex justify-center items-center gap-2 mb-12'>
            <HelpCircle className='text-blue-500 w-5 h-5' />
            <button className='text-blue-600 hover:text-blue-700 font-medium transition-colors hover:underline'>
              How to use?
            </button>
          </div>

          {/* Popular Locations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='mb-12'
          >
            <h2 className='text-2xl md:text-3xl font-bold mb-3 text-gray-800'>
              Popular Locations
            </h2>
            <p className='text-gray-500 mb-8'>
              Tap on a location to find your ideal room or hostel
            </p>

            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='flex flex-wrap justify-center gap-3 mb-10 max-w-4xl mx-auto'
            >
              {popularLocations.map((loc, index) => (
                <motion.button
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelected(loc)}
                  className={`px-5 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg
                    ${
                      selected === loc
                        ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white border-transparent scale-105'
                        : 'bg-white hover:bg-blue-50 border border-blue-200 text-gray-700'
                    }
                  `}
                >
                  {loc}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={navigateToLocations}
              size='lg'
              className='bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group'
            >
              <MapPin className='w-5 h-5 mr-2 group-hover:animate-pulse' />
              View All Locations
            </Button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'
          >
            {[
              {
                icon: '🔍',
                title: 'Easy Search',
                desc: 'Find rooms in seconds',
              },
              {
                icon: '✨',
                title: 'Verified Listings',
                desc: 'Trusted accommodations',
              },
              { icon: '💰', title: 'Best Prices', desc: 'Affordable options' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className='p-6 rounded-2xl bg-white border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300'
              >
                <div className='text-4xl mb-3'>{feature.icon}</div>
                <h3 className='font-bold text-lg mb-2 text-gray-800'>
                  {feature.title}
                </h3>
                <p className='text-sm text-gray-600'>{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
