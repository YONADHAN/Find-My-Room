'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { roomService } from '@/lib/services/room/roomService'
type FormState = {
  title: string
  size: string
  propertyType: string
  furnishingStatus: string
  rent: string
  securityDeposit: string
  locationId: string
  description: string
  floorNumber: string
  facilities: string[]
  parking: string[]
  distanceToBusStop: string
  distanceToMetro: string
  nearestBusStop: string
  nearestMetro: string
  allowedFor: string[]
  bachelorsAllowed: string
  familyMembersAllowed: string
  mixedMembersAllowed: string
  extraCharges: string
  readyForRent: boolean
  suitableFor: string[]
  mapLink: string
  petAllowed: boolean
  tags: string[]
  additionalInfo: string
  images: File[]
  videoUrls: string[]
}

const defaultState: FormState = {
  title: '',
  size: '',
  propertyType: 'Room',
  furnishingStatus: 'Furnished',
  rent: '',
  securityDeposit: '',
  locationId: '',
  description: '',
  floorNumber: '',
  facilities: [],
  parking: [],
  distanceToBusStop: '',
  distanceToMetro: '',
  nearestBusStop: '',
  nearestMetro: '',
  allowedFor: ['Mixed'],
  bachelorsAllowed: '0',
  familyMembersAllowed: '0',
  mixedMembersAllowed: '0',
  extraCharges: '',
  readyForRent: true,
  suitableFor: [],
  mapLink: '',
  petAllowed: false,
  tags: [],
  additionalInfo: '',
  images: [],
  videoUrls: [],
}

const AddRoomPage = () => {
  const [form, setForm] = useState<FormState>(defaultState)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [videoInput, setVideoInput] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k: keyof FormState, v: any) =>
    setForm((s) => ({ ...s, [k]: v }))

  const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const arr = Array.from(files)
    setForm((s) => ({ ...s, images: [...s.images, ...arr] }))
    const urls = arr.map((f) => URL.createObjectURL(f))
    setPreviewUrls((prev) => [...prev, ...urls])
  }

  const removeImage = (index: number) => {
    setForm((s) => ({
      ...s,
      images: s.images.filter((_, i) => i !== index),
    }))
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const addVideoUrl = () => {
    if (!videoInput.trim()) return
    setForm((s) => ({ ...s, videoUrls: [...s.videoUrls, videoInput.trim()] }))
    setVideoInput('')
  }

  const removeVideoUrl = (index: number) => {
    setForm((s) => ({
      ...s,
      videoUrls: s.videoUrls.filter((_, i) => i !== index),
    }))
  }

  const toggleMultiSelect = (
    field: 'allowedFor' | 'suitableFor' | 'parking',
    value: string
  ) => {
    setForm((s) => {
      const current = s[field] as string[]
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return {
        ...s,
        [field]: next.length ? next : field === 'allowedFor' ? ['Mixed'] : [],
      }
    })
  }

  const validate = () => {
    const errors: string[] = []
    if (!form.title || form.title.trim().length < 3)
      errors.push('Title must be at least 3 characters')
    if (!form.size) errors.push('Size is required')
    if (!form.propertyType) errors.push('Property type is required')
    if (!form.rent || isNaN(Number(form.rent)))
      errors.push('Valid rent is required')
    if (!form.locationId) errors.push('Location is required')
    return errors
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (errs.length) {
      toast.error(errs.join('\n'))
      return
    }

    try {
      setLoading(true)
      const data = new FormData()

      // Append all fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          form.images.forEach((file) => data.append('images', file))
        } else if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value))
        } else if (typeof value === 'boolean') {
          data.append(key, String(value))
        } else {
          data.append(key, String(value))
        }
      })

      // Simulate API call

      const res = await roomService.create(data)
      console.log('Created room:', res)
      toast.success('Room added successfully!')
      setForm(defaultState)
      setPreviewUrls([])
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto py-8 px-4'>
      <h1 className='text-3xl font-bold mb-6'>Add New Room</h1>

      <form onSubmit={onSubmit} className='space-y-4'>
        {/* Quick Summary */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            <input
              className='border rounded-md p-2 col-span-2'
              placeholder='Room Title (e.g., Spacious 1RK near Infopark)'
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
            <input
              className='border rounded-md p-2'
              placeholder='Monthly Rent (₹)'
              type='number'
              value={form.rent}
              onChange={(e) => update('rent', e.target.value)}
            />
          </div>
        </div>

        {/* Basic Details */}
        <details
          className='group bg-white border rounded-lg p-4 shadow-sm'
          open
        >
          <summary className='cursor-pointer font-semibold text-lg flex items-center justify-between'>
            <span>📋 Basic Details</span>
            <span className='text-sm text-gray-500 group-open:rotate-180 transition-transform'>
              ▼
            </span>
          </summary>

          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Size *</label>
              <input
                placeholder='e.g., 1 RK, Single Room'
                value={form.size}
                onChange={(e) => update('size', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Property Type *
              </label>
              <select
                value={form.propertyType}
                onChange={(e) => update('propertyType', e.target.value)}
                className='border rounded-md p-2 w-full'
              >
                <option value='Room'>Room</option>
                <option value='Flat'>Flat</option>
                <option value='PG'>PG</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Furnishing Status *
              </label>
              <select
                value={form.furnishingStatus}
                onChange={(e) => update('furnishingStatus', e.target.value)}
                className='border rounded-md p-2 w-full'
              >
                <option value='Furnished'>Furnished</option>
                <option value='Semi-furnished'>Semi-furnished</option>
                <option value='Unfurnished'>Unfurnished</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Location *
              </label>
              <select
                value={form.locationId}
                onChange={(e) => update('locationId', e.target.value)}
                className='border rounded-md p-2 w-full'
              >
                <option value=''>Select Location</option>
                <option value='652b63d5adf1ef3b7c6d88a1'>Kakkanad</option>
                <option value='652b63d5adf1ef3b7c6d88a1'>Infopark</option>
                <option value='652b63d5adf1ef3b7c6d88a1'>MG Road</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Security Deposit (₹)
              </label>
              <input
                type='number'
                placeholder='e.g., 10000'
                value={form.securityDeposit}
                onChange={(e) => update('securityDeposit', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Floor Number
              </label>
              <input
                placeholder='e.g., Ground, 1st, 2nd'
                value={form.floorNumber}
                onChange={(e) => update('floorNumber', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium mb-1'>
                Description
              </label>
              <textarea
                placeholder='Brief description of the room...'
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className='border rounded-md p-2 w-full'
                rows={3}
              />
            </div>
          </div>
        </details>

        {/* Amenities & Features */}
        <details className='group bg-white border rounded-lg p-4 shadow-sm'>
          <summary className='cursor-pointer font-semibold text-lg flex items-center justify-between'>
            <span>✨ Amenities & Features</span>
            <span className='text-sm text-gray-500 group-open:rotate-180 transition-transform'>
              ▼
            </span>
          </summary>

          <div className='mt-4 space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Facilities
              </label>
              <input
                placeholder='Comma separated: AC, Fridge, Washing Machine, WiFi'
                value={form.facilities.join(', ')}
                onChange={(e) =>
                  update(
                    'facilities',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                Parking Available
              </label>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.parking.includes('Car')}
                    onChange={() => toggleMultiSelect('parking', 'Car')}
                  />
                  <span>Car</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.parking.includes('Bike')}
                    onChange={() => toggleMultiSelect('parking', 'Bike')}
                  />
                  <span>Bike</span>
                </label>
              </div>
            </div>

            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={form.petAllowed}
                  onChange={(e) => update('petAllowed', e.target.checked)}
                />
                <span className='text-sm font-medium'>Pet Allowed</span>
              </label>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Extra Charges
              </label>
              <input
                placeholder='e.g., Electricity extra, Water charges included'
                value={form.extraCharges}
                onChange={(e) => update('extraCharges', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>
          </div>
        </details>

        {/* Location & Connectivity */}
        <details className='group bg-white border rounded-lg p-4 shadow-sm'>
          <summary className='cursor-pointer font-semibold text-lg flex items-center justify-between'>
            <span>📍 Location & Connectivity</span>
            <span className='text-sm text-gray-500 group-open:rotate-180 transition-transform'>
              ▼
            </span>
          </summary>

          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Nearest Bus Stop
              </label>
              <input
                placeholder='e.g., Infopark Bus Stop'
                value={form.nearestBusStop}
                onChange={(e) => update('nearestBusStop', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Distance to Bus Stop
              </label>
              <input
                placeholder='e.g., 500m, 5 min walk'
                value={form.distanceToBusStop}
                onChange={(e) => update('distanceToBusStop', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Nearest Metro
              </label>
              <input
                placeholder='e.g., Palarivattom Metro'
                value={form.nearestMetro}
                onChange={(e) => update('nearestMetro', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Distance to Metro
              </label>
              <input
                placeholder='e.g., 2km, 10 min by bus'
                value={form.distanceToMetro}
                onChange={(e) => update('distanceToMetro', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div className='md:col-span-2'>
              <label className='block text-sm font-medium mb-1'>
                Google Maps Link
              </label>
              <input
                placeholder='https://maps.google.com/...'
                value={form.mapLink}
                onChange={(e) => update('mapLink', e.target.value)}
                className='border rounded-md p-2 w-full'
              />
            </div>
          </div>
        </details>

        {/* Tenant Rules */}
        <details className='group bg-white border rounded-lg p-4 shadow-sm'>
          <summary className='cursor-pointer font-semibold text-lg flex items-center justify-between'>
            <span>👥 Tenant Rules & Capacity</span>
            <span className='text-sm text-gray-500 group-open:rotate-180 transition-transform'>
              ▼
            </span>
          </summary>

          <div className='mt-4 space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Allowed For
              </label>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.allowedFor.includes('Bachelors')}
                    onChange={() =>
                      toggleMultiSelect('allowedFor', 'Bachelors')
                    }
                  />
                  <span>Bachelors</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.allowedFor.includes('Family')}
                    onChange={() => toggleMultiSelect('allowedFor', 'Family')}
                  />
                  <span>Family</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.allowedFor.includes('Mixed')}
                    onChange={() => toggleMultiSelect('allowedFor', 'Mixed')}
                  />
                  <span>Mixed</span>
                </label>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Bachelors Count
                </label>
                <input
                  type='number'
                  value={form.bachelorsAllowed}
                  onChange={(e) => update('bachelorsAllowed', e.target.value)}
                  className='border rounded-md p-2 w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Family Members
                </label>
                <input
                  type='number'
                  value={form.familyMembersAllowed}
                  onChange={(e) =>
                    update('familyMembersAllowed', e.target.value)
                  }
                  className='border rounded-md p-2 w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Mixed Members
                </label>
                <input
                  type='number'
                  value={form.mixedMembersAllowed}
                  onChange={(e) =>
                    update('mixedMembersAllowed', e.target.value)
                  }
                  className='border rounded-md p-2 w-full'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                Suitable For
              </label>
              <div className='flex gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.suitableFor.includes('Students')}
                    onChange={() =>
                      toggleMultiSelect('suitableFor', 'Students')
                    }
                  />
                  <span>Students</span>
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={form.suitableFor.includes('Working Professionals')}
                    onChange={() =>
                      toggleMultiSelect('suitableFor', 'Working Professionals')
                    }
                  />
                  <span>Working Professionals</span>
                </label>
              </div>
            </div>
          </div>
        </details>

        {/* Media */}
        <details className='group bg-white border rounded-lg p-4 shadow-sm'>
          <summary className='cursor-pointer font-semibold text-lg flex items-center justify-between'>
            <span>📸 Images & Videos</span>
            <span className='text-sm text-gray-500 group-open:rotate-180 transition-transform'>
              ▼
            </span>
          </summary>

          <div className='mt-4 space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Upload Images
              </label>
              <input
                type='file'
                accept='image/*'
                multiple
                onChange={onImagesChange}
                className='block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100'
              />
              {previewUrls.length > 0 && (
                <div className='grid grid-cols-4 gap-3 mt-3'>
                  {previewUrls.map((url, i) => (
                    <div key={i} className='relative group'>
                      <img
                        src={url}
                        alt={`Preview ${i + 1}`}
                        className='w-full h-24 object-cover rounded-md border'
                      />
                      <button
                        type='button'
                        onClick={() => removeImage(i)}
                        className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                Video URLs (YouTube, etc.)
              </label>
              <div className='flex gap-2'>
                <input
                  placeholder='Paste video URL'
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  className='border rounded-md p-2 flex-1'
                />
                <button
                  type='button'
                  onClick={addVideoUrl}
                  className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
                >
                  Add
                </button>
              </div>
              {form.videoUrls.length > 0 && (
                <div className='mt-2 space-y-2'>
                  {form.videoUrls.map((url, i) => (
                    <div
                      key={i}
                      className='flex items-center gap-2 bg-gray-50 p-2 rounded'
                    >
                      <span className='flex-1 text-sm truncate'>{url}</span>
                      <button
                        type='button'
                        onClick={() => removeVideoUrl(i)}
                        className='text-red-500 hover:text-red-700'
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </details>

        {/* Additional Info */}
        <details className='group bg-white border rounded-lg p-4 shadow-sm'>
          <summary className='cursor-pointer font-semibold text-lg flex items-center justify-between'>
            <span>ℹ️ Additional Information</span>
            <span className='text-sm text-gray-500 group-open:rotate-180 transition-transform'>
              ▼
            </span>
          </summary>

          <div className='mt-4 space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Tags (comma separated)
              </label>
              <input
                placeholder='e.g., Near IT Park, Quiet Area, 24x7 Water'
                value={form.tags.join(', ')}
                onChange={(e) =>
                  update(
                    'tags',
                    e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  )
                }
                className='border rounded-md p-2 w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Additional Info
              </label>
              <textarea
                placeholder='Any other important details...'
                value={form.additionalInfo}
                onChange={(e) => update('additionalInfo', e.target.value)}
                className='border rounded-md p-2 w-full'
                rows={3}
              />
            </div>

            <div>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={form.readyForRent}
                  onChange={(e) => update('readyForRent', e.target.checked)}
                />
                <span className='text-sm font-medium'>Ready for Rent</span>
              </label>
            </div>
          </div>
        </details>

        {/* Submit Actions */}
        <div className='flex items-center justify-between gap-4 pt-4'>
          <div className='text-sm text-gray-600'>
            {form.images.length} images • {form.videoUrls.length} videos
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => {
                setForm(defaultState)
                setPreviewUrls([])
                toast.success('Form reset')
              }}
              className='px-5 py-2 border rounded-md hover:bg-gray-50'
            >
              Reset
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Saving...' : 'Save Room'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddRoomPage
