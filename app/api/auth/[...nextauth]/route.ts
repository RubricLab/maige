import NextAuth from 'next-auth'
import {authOptions} from '~/authOptions'

const authHandler = NextAuth(authOptions)
export {authHandler as GET, authHandler as POST}
