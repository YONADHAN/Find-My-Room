import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/connection/dbConnection'
import Room from '@/lib/db/schemas/room.schema'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB()

  try {
    // Await params before accessing its properties
    const { id } = await params

    console.log('🆔 Room ID in backend:', id)

    const room = await Room.findById(id)
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: room })
  } catch (err) {
    console.error('❌ Error fetching room:', err)
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 })
  }
}
