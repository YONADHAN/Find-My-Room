import axiosInstance from '@/api_interceptor/interceptor'

const handleError = (error: any) => {
  console.error('Room service error:', error)
  throw error?.response?.data || error
}

export const roomService = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get('/rooms')
      return res.data
    } catch (err) {
      handleError(err)
    }
  },
  getAllRoomsByLocationId: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/rooms/location/${id}`)
      return res.data
    } catch (err) {
      handleError(err)
    }
  },
  getById: async (id: string) => {
    try {
      const res = await axiosInstance.get(`/rooms/${id}`)
      return res.data
    } catch (err) {
      handleError(err)
    }
  },
  create: async (data: any) => {
    try {
      const res = await axiosInstance.post('/rooms', data)
      return res.data
    } catch (err) {
      handleError(err)
    }
  },
  update: async (id: string, data: any) => {
    try {
      const res = await axiosInstance.patch(`/rooms/${id}`, data)
      return res.data
    } catch (err) {
      handleError(err)
    }
  },
  remove: async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/rooms/${id}`)
      return res.data
    } catch (err) {
      handleError(err)
    }
  },
  getFilteredRooms: async ({
    locationId,
    filters,
    searchQuery,
    sortOption,
    page = 1,
    limit = 10,
  }: {
    locationId: string
    filters?: Record<string, any>
    searchQuery?: string
    sortOption?: string
    page?: number
    limit?: number
  }) => {
    const res = await axiosInstance.post('/rooms/filter', {
      locationId,
      filters,
      searchQuery,
      sortOption,
      page,
      limit,
    })
    return res.data
  },
}

// import axiosInstance from '@/api_interceptor/interceptor'

// export const roomService = {
//   getAll: async () => {
//     const res = await axiosInstance.get('/room')
//     return res.data
//   },
//   getAllRoomsByLocationId: async (id: string) => {
//     const res = await axiosInstance.get(`/room/location/${id}`)
//     return res.data
//   },
//   getById: async (id: string) => {
//     const res = await axiosInstance.get(`/room/${id}`)
//     return res.data
//   },
//   create: async (data: any) => {
//     const res = await axiosInstance.post('/room', data)
//     return res.data
//   },
//   update: async (id: string, data: any) => {
//     const res = await axiosInstance.patch(`/room/${id}`, data)
//     return res.data
//   },
//   remove: async (id: string) => {
//     const res = await axiosInstance.delete(`/room/${id}`)
//     return res.data
//   },
// }
