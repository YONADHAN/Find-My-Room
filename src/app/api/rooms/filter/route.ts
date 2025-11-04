import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/connection/dbConnection'
import Room from '@/lib/db/schemas/room.schema'
import mongoose from 'mongoose'

export async function POST(req: Request) {
  try {
    await connectDB()
    const Location = (await import('@/lib/db/schemas/location.schema')).default
    console.log('✅ Models loaded:', mongoose.modelNames())

    const body = await req.json()

    const {
      locationId,
      filters = {},
      searchQuery = '',
      sortOption = '',
      page = 1,
      limit = 10,
    } = body

    // 🧩 1️⃣ Validation
    if (!locationId) {
      return NextResponse.json(
        { success: false, message: 'locationId is required' },
        { status: 400 }
      )
    }

    // 🧩 2️⃣ Build MongoDB Query
    const query: any = { location: locationId }

    // -- Property Type (match any)
    if (filters.propertyType?.length > 0) {
      query.propertyType = { $in: filters.propertyType }
    }

    // -- Furnishing Status (match any)
    if (filters.furnishingStatus?.length > 0) {
      query.furnishingStatus = { $in: filters.furnishingStatus }
    }

    // -- Allowed For (match any)
    if (filters.allowedFor?.length > 0) {
      query.allowedFor = { $in: filters.allowedFor }
    }

    // -- Suitable For (match any)
    if (filters.suitableFor?.length > 0) {
      query.suitableFor = { $in: filters.suitableFor } // changed from $all → $in
    }

    // -- Facilities (match any)
    if (filters.facilities?.length > 0) {
      query.facilities = { $in: filters.facilities } // changed from $all → $in
    }

    // -- Parking (match any)
    if (filters.parking?.length > 0) {
      query.parking = { $in: filters.parking }
    }

    // -- Rent Range (between min and max)
    if (filters.rentRange) {
      const { min, max } = filters.rentRange
      query.rent = {}
      if (min) query.rent.$gte = parseInt(min)
      if (max) query.rent.$lte = parseInt(max)
    }

    // -- Pet Allowed (exact boolean)
    if (filters.petAllowed !== undefined) {
      query.petAllowed = filters.petAllowed
    }

    // -- Ready For Rent (exact boolean)
    if (filters.readyForRent !== undefined) {
      query.readyForRent = filters.readyForRent
    }

    // 🧩 3️⃣ Search (partial match)
    if (searchQuery) {
      query.$or = [
        { size: { $regex: searchQuery, $options: 'i' } },
        { propertyType: { $regex: searchQuery, $options: 'i' } },
        { tags: { $in: [new RegExp(searchQuery, 'i')] } },
        { additionalInfo: { $regex: searchQuery, $options: 'i' } },
      ]
    }

    // 🧩 4️⃣ Sorting
    let sort: Record<string, 1 | -1> = {}
    switch (sortOption) {
      case 'priceLow':
        sort = { rent: 1 }
        break
      case 'priceHigh':
        sort = { rent: -1 }
        break
      case 'newest':
        sort = { createdAt: -1 }
        break
      case 'oldest':
        sort = { createdAt: 1 }
        break
      default:
        sort = { createdAt: -1 }
    }

    // 🧩 5️⃣ Pagination
    const skip = (page - 1) * limit

    console.log('🔎 MongoDB Query:', JSON.stringify(query, null, 2))
    console.log('🧭 Sort Option:', sort)

    // 🧩 6️⃣ Execute query and count in parallel
    const [rooms, totalCount] = await Promise.all([
      Room.find(query)
        .populate('location', 'name city state')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Room.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    // 🧩 7️⃣ Response
    return NextResponse.json({
      success: true,
      data: rooms,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error('❌ Error fetching filtered rooms:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Server Error',
        error: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
