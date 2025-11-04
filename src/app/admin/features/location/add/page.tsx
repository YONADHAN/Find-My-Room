'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import { UploadCloud, MapPin, FileText, Building2 } from 'lucide-react'
import { locationService } from '@/lib/services/location/locationService'
const LocationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    description: '',
    image: null as File | null,
  })
  const [preview, setPreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData({ ...formData, image: file })
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const validateForm = () => {
    const errors: string[] = []

    // Validate name
    if (formData.name.trim().length < 3) {
      errors.push('Location name must be at least 3 characters long')
    }

    // Validate city
    if (formData.city.trim().length < 2) {
      errors.push('City name must be at least 2 characters long')
    }

    // Validate description
    if (formData.description.trim().length < 5) {
      errors.push('Description must be at least 5 characters long')
    }

    // Validate image (optional, but if present check size)
    if (formData.image && formData.image.size > 5 * 1024 * 1024) {
      errors.push('Image size must be less than 5MB')
    }

    // Show errors if any
    if (errors.length > 0) {
      const errorMessage = errors.map((err) => `• ${err}`).join('\n')
      toast(`Validation failed:\n${errorMessage}`, {
        style: {
          background: '#FEE2E2',
          color: '#B91C1C',
          border: '1px solid #FCA5A5',
        },
        icon: '🚫',
      })

      return false
    }

    return true
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // ✅ Create FormData for file upload
      const data = new FormData()
      data.append('name', formData.name)
      data.append('city', formData.city)
      data.append('description', formData.description)
      if (formData.image) data.append('image', formData.image)

      // ✅ Call backend API
      const res = await locationService.create(data)

      toast.success('✅ Location added successfully!')
      console.log('✅ Response:', res)

      // Optional: reset form
      setFormData({ name: '', city: '', description: '', image: null })
      setPreview(null)
    } catch (error: any) {
      console.error('❌ Error saving location:', error)
      toast.error(error?.response?.data?.message || 'Error adding location')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='bg-white shadow-xl rounded-2xl w-full max-w-lg p-8'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          🏙️ Add New Location
        </h2>

        <form
          onSubmit={handleFormSubmit}
          className='flex flex-col gap-5 text-gray-700'
        >
          {/* Name */}
          <div className='relative'>
            <label className='block font-medium mb-1'>Location Name</label>
            <div className='flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400'>
              <MapPin className='text-blue-500 mr-2 w-5 h-5' />
              <input
                type='text'
                name='name'
                placeholder='e.g., Kakkanad'
                value={formData.name}
                onChange={handleInputChange}
                className='w-full p-2 outline-none bg-transparent'
              />
            </div>
          </div>

          {/* City */}
          <div className='relative'>
            <label className='block font-medium mb-1'>City</label>
            <div className='flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400'>
              <Building2 className='text-blue-500 mr-2 w-5 h-5' />
              <input
                type='text'
                name='city'
                placeholder='e.g., Kochi'
                value={formData.city}
                onChange={handleInputChange}
                className='w-full p-2 outline-none bg-transparent'
              />
            </div>
          </div>

          {/* Description */}
          <div className='relative'>
            <label className='block font-medium mb-1'>Description</label>
            <div className='flex items-center border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-400'>
              <FileText className='text-blue-500 mr-2 w-5 h-5' />
              <input
                type='text'
                name='description'
                placeholder='e.g., Ideal for tech professionals'
                value={formData.description}
                onChange={handleInputChange}
                className='w-full p-2 outline-none bg-transparent'
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className='block font-medium mb-2'>Upload Image</label>
            <label className='flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-slate-50 transition'>
              <UploadCloud className='w-10 h-10 text-blue-500 mb-2' />
              <span className='text-sm text-gray-500'>
                {formData.image ? formData.image.name : 'Click to upload image'}
              </span>
              <input
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
              />
            </label>

            {/* Image Preview */}
            {preview && (
              <div className='mt-3'>
                <Image
                  src={preview}
                  alt='Preview'
                  width={400}
                  height={200}
                  className='rounded-lg object-cover w-full h-40 border'
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200'
          >
            Add Location
          </button>
        </form>
      </div>
    </div>
  )
}

export default LocationPage
