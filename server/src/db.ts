import mongoose from 'mongoose'
import dns from 'dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])

const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('MongoDB connected')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}

export { connect }
