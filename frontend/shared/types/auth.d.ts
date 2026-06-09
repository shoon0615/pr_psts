export declare module 'next-auth' {
  interface User {
    accessToken: string
    // role: 'USER' | 'ADMIN'
  }
  interface Session {
    accessToken: string
  }
  /* interface Session {
    user: {
      id: string
      role: 'ADMIN' | 'USER'
    } & DefaultSession['user']
  } */
}
export declare module '@auth/core/jwt' {
  interface JWT {
    accessToken: string
  }
}
