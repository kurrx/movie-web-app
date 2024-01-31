import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface RedirectViewProps {
  to: string
}

export function RedirectView({ to }: RedirectViewProps) {
  const navigate = useNavigate()

  useEffect(() => {
    navigate(to, { replace: true })
  }, [navigate, to])

  return null
}
