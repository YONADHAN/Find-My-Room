import { NextResponse } from 'next/server'
import Room from '@/lib/db/schemas/room.schema'
import Location from '@/lib/db/schemas/location.schema'
import connectDB from '@/lib/db/connection/dbConnection'

export async function POST(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()

    // ✅ Convert FormData into object
    const roomData: any = {}
    formData.forEach((value, key) => {
      roomData[key] = value
    })

    // ✅ Extract multiple files properly
    const images = formData.getAll('images') as File[]

    console.log('✅ Parsed FormData', { ...roomData, images })

    const parseJSON = (val: any) => {
      try {
        return JSON.parse(val)
      } catch {
        return val
      }
    }

    const finalData = {
      title: roomData.title,
      size: roomData.size,
      propertyType: roomData.propertyType,
      furnishingStatus: roomData.furnishingStatus,
      rent: Number(roomData.rent),
      securityDeposit: Number(roomData.securityDeposit),
      location: roomData.locationId,
      description: roomData.description,
      floorNumber: roomData.floorNumber,
      facilities: parseJSON(roomData.facilities),
      parking: parseJSON(roomData.parking),
      distanceToBusStop: roomData.distanceToBusStop,
      distanceToMetro: roomData.distanceToMetro,
      nearestBusStop: roomData.nearestBusStop,
      nearestMetro: roomData.nearestMetro,
      allowedFor: parseJSON(roomData.allowedFor),
      bachelorsAllowed: Number(roomData.bachelorsAllowed),
      familyMembersAllowed: Number(roomData.familyMembersAllowed),
      mixedMembersAllowed: Number(roomData.mixedMembersAllowed),
      extraCharges: roomData.extraCharges,
      readyForRent: roomData.readyForRent === 'true',
      suitableFor: parseJSON(roomData.suitableFor),
      mapLink: roomData.mapLink,
      petAllowed: roomData.petAllowed === 'true',
      tags: parseJSON(roomData.tags),
      additionalInfo: roomData.additionalInfo,

      // ✅ FIXED: properly handle multiple files
      images: images.map((f) => f.name),

      // ✅ Handle video URLs
      videos: parseJSON(roomData.videoUrls),
    }

    const newRoom = await Room.create(finalData)

    return NextResponse.json({ success: true, data: newRoom }, { status: 201 })
  } catch (error: any) {
    console.error('POST /rooms error', error)
    return NextResponse.json(
      { message: 'Error creating room', error: error.message },
      { status: 500 }
    )
  }
}
