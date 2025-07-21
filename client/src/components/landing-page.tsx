import { User, LogIn, UserPlus, Search, Tag } from 'lucide-react'
import Button from './ui/button'
import { Link } from '@tanstack/react-router'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-600 rounded-2xl">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Contact Manager</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Organize and manage your contacts with ease. Keep track of family, friends, colleagues,
            and business contacts all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signin" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2">
                <LogIn className="w-5 h-5" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="secondary" size="lg" className="gap-2">
                <UserPlus className="w-5 h-5" />
                Create Account
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organize Contacts</h3>
              <p className="text-gray-600">
                Categorize and organize your contacts by family, work, friends, and more.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
              <p className="text-gray-600">
                Find any contact instantly with our powerful search functionality.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Categories</h3>
              <p className="text-gray-600">
                Use built-in categories or create custom tags for better organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LandingPage
