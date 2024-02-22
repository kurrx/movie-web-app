import { ProfileContent } from '@/features'
import { AuthMiddleware } from '@/middlewares'

export function ProfileView() {
  return (
    <AuthMiddleware>
      <ProfileContent />
    </AuthMiddleware>
  )
}
