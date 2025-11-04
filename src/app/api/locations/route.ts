import { NextResponse } from 'next/server'
import Location from '@/lib/db/schemas/location.schema'
import connectDB from '@/lib/db/connection/dbConnection'
import { v4 as uuidv4 } from 'uuid'

// 📌 GET /api/locations
export async function GET() {
  try {
    await connectDB()
    const locations = await Location.find()
    return NextResponse.json(locations, { status: 200 })
  } catch (error: any) {
    console.error('GET /locations error:', error)
    return NextResponse.json(
      { message: 'Error fetching locations' },
      { status: 500 }
    )
  }
}

// 📌 POST /api/locations
export async function POST(req: Request) {
  try {
    await connectDB()

    // ✅ 1. Parse form data
    const formData = await req.formData()

    // ✅ 2. Extract fields
    const name = formData.get('name') as string
    const city = formData.get('city') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as File | null

    // ✅ 3. Validate required fields
    if (!name || !city || !image) {
      return NextResponse.json(
        { message: 'Name, city, and image are required' },
        { status: 400 }
      )
    }

    // ✅ 4. Simulate Cloudinary Upload (replace later)
    // Pretend we're uploading to Cloudinary and got back a URL
    const fakeCloudinaryUrl = `https://dummy-cloudinary.com/uploads/${uuidv4()}-${
      image.name
    }`

    // ✅ 5. Save to MongoDB
    const newLocation = await Location.create({
      name,
      city,
      description,
      image: fakeCloudinaryUrl,
    })

    console.log('✅ New location added:', newLocation)

    // ✅ 6. Respond
    return NextResponse.json(newLocation, { status: 201 })
  } catch (error: any) {
    console.error('❌ POST /locations error:', error)
    return NextResponse.json(
      { message: 'Error creating location', error: error.message },
      { status: 500 }
    )
  }
}
