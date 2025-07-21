import { createFileRoute } from '@tanstack/react-router'
import ContactDashboard from '../components/contact-dashboard'
import useAuth from '../hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!user) {
    alert('You must be logged in to access this page.')
    navigate({ to: '/', replace: true })
    return () => {}
    return null
  }
  return <ContactDashboard></ContactDashboard>
}
