import axiosInstance from '@/api_interceptor/interceptor'

export const locationService = {
  getAll: async () => {
    const res = await axiosInstance.get('/locations')
    return res.data
  },
  getById: async (id: string) => {
    const res = await axiosInstance.get(`/locations/${id}`)
    return res.data
  },
  create: async (data: any) => {
    const res = await axiosInstance.post('/locations', data)
    return res.data
  },
  update: async (id: string, data: any) => {
    const res = await axiosInstance.patch(`/locations/${id}`, data)
    return res.data
  },
  remove: async (id: string) => {
    const res = await axiosInstance.delete(`/locations/${id}`)
    return res.data
  },
}
