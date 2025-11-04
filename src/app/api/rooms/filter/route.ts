import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/connection/dbConnection'
import Room from '@/lib/db/schemas/room.schema'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const {
      locationId,
      filters = {},
      searchQuery = '',
      sortOption = '',
      page = 1,
      limit = 10,
    } = body

    if (!locationId) {
      return NextResponse.json(
        { success: false, message: 'locationId is required' },
        { status: 400 }
      )
    }

    // ✅ Build MongoDB query
    const query: any = { location: locationId }

    // Optional filters (customize as per your model)
    if (filters.furnished !== undefined) {
      query.furnished = filters.furnished
    }
    if (filters.priceRange) {
      query.price = {
        $gte: filters.priceRange.min,
        $lte: filters.priceRange.max,
      }
    }

    // ✅ Search
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' }
    }

    // ✅ Sorting
    let sort: any = {}
    switch (sortOption) {
      case 'priceLow':
        sort = { price: 1 }
        break
      case 'priceHigh':
        sort = { price: -1 }
        break
      case 'ratingHigh':
        sort = { rating: -1 }
        break
      default:
        sort = { createdAt: -1 }
    }

    // ✅ Pagination logic
    const skip = (page - 1) * limit

    const [rooms, totalCount] = await Promise.all([
      Room.find(query).sort(sort).skip(skip).limit(limit),
      Room.countDocuments(query),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: rooms,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
      },
    })
  } catch (error) {
    console.error('Error fetching filtered rooms:', error)
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
