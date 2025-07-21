import { createFileRoute } from '@tanstack/react-router'
import LandingPage from '../components/landing-page'
import { useState } from 'react'
import LoginForm from '../components/login-form'
import RegisterForm from '../components/register-form'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <LandingPage />
}
