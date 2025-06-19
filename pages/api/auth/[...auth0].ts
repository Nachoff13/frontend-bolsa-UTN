// import { handleAuth } from '@auth0/nextjs-auth0'

// export default handleAuth()

// Endpoint de Auth0 (deshabilitado)
export default function handler(req: any, res: any) {
  res.status(501).json({ message: 'Auth0 endpoint not implemented' })
} 