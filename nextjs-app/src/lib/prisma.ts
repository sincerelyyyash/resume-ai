import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma = globalThis.prisma || new PrismaClient({
  // Increase transaction timeout to handle complex operations
  transactionOptions: {
    timeout: 15000, // 15 seconds instead of default 5 seconds
    maxWait: 20000,  // 20 seconds max wait
    isolationLevel: 'ReadCommitted'
  }
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
