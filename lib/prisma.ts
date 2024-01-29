import {PrismaClient} from '@prisma/client'
import env from './env.mjs'

const prisma = global.prisma || new PrismaClient()

if (env.NODE_ENV === 'development') global.prisma = prisma

export default prisma
