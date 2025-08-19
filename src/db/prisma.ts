import { PrismaClient } from '@prisma/client'

declare global {
    // evita instancias duplicadas en hot-reload (dev)
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

export const prisma =
    global.prisma ??
    new PrismaClient({
        log: ['warn', 'error'], // agrega 'query' si quieres
    })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma
