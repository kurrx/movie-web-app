import { ProfileItemsContent } from '@/features'
import { AuthMiddleware } from '@/middlewares'
import { FirestoreProfileItemType } from '@/types'

export function ProfileItemsView({ type }: { type: FirestoreProfileItemType }) {
  return (
    <AuthMiddleware>
      <ProfileItemsContent key={type} type={type} />
    </AuthMiddleware>
  )
}
