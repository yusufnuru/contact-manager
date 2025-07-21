/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import {
  User,
  LogOut,
  Search,
  Plus,
  Users,
  Heart,
  Briefcase,
  Star,
  Mail,
  Phone,
  Edit,
  Trash2,
  Building,
} from 'lucide-react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import type { Contact } from '../types'
import Button from './ui/button'
import Modal from './ui/modal'
import { fetchContacts, createContact, updateContact, deleteContact } from '../utils/contact-api'
import { contactCategories } from '../data/contact-categories'
import ContactForm from './contact-form'
import { useNavigate } from '@tanstack/react-router'

const ContactDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const navigate = useNavigate()

  const { data: contactsData, isLoading } = useQuery({
    queryKey: ['contacts', { search: searchTerm, category: selectedCategory }],
    queryFn: () => fetchContacts({ search: searchTerm, category: selectedCategory }),
  })

  const createMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      setShowAddModal(false)
    },
    onError: (error) => {
      alert(`Error creating contact: ${error.message}`)
      console.error('Error creating contact:', error)
      setShowAddModal(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
      setEditingContact(null)
    },
    onError: (error) => {
      alert(`Error updating contact: ${error.message}`)
      console.error('Error updating contact:', error)
      setEditingContact(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
    onError: (error) => {
      alert(`Error deleting contact: ${error.message}`)
      console.error('Error deleting contact:', error)
    },
  })

  const handleAddContact = (contactData: any) => {
    createMutation.mutate(contactData)
  }

  const handleEditContact = (contactData: any) => {
    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, ...contactData })
    }
  }

  const handleDeleteContact = (contact: Contact) => {
    if (confirm(`Are you sure you want to delete ${contact.first_name} ${contact.last_name}?`)) {
      deleteMutation.mutate(contact.id)
    }
  }

  const handlelogout = async () => {
    logout()
    queryClient.clear()
    navigate({ to: '/', replace: true })
  }
  const contacts = contactsData?.contacts || ([] as Contact[])
  const getCategoryCount = (categoryId: string) =>
    contacts.filter(
      (contact: { contact_category_id: string }) => contact.contact_category_id === categoryId,
    ).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-900">Contact Manager</h1>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600 truncate max-w-[120px] sm:max-w-none">
                Welcome, {user?.email}
              </span>
              <Button onClick={handlelogout} variant="ghost" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {contactCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Contacts',
              count: contacts.length,
              icon: <Users className="w-8 h-8 text-blue-600" />,
            },
            {
              label: 'Family',
              count: getCategoryCount('family'),
              icon: <Heart className="w-8 h-8 text-red-500" />,
            },
            {
              label: 'Work',
              count: getCategoryCount('work'),
              icon: <Briefcase className="w-8 h-8 text-green-600" />,
            },
            {
              label: 'VIP',
              count: getCategoryCount('vip'),
              icon: <Star className="w-8 h-8 text-yellow-500" />,
            },
          ].map(({ label, count, icon }) => (
            <div key={label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                {icon}
              </div>
            </div>
          ))}
        </div>

        {/* Contacts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Contacts ({contacts.length})</h2>
          </div>

          {contacts.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No contacts found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || selectedCategory
                  ? 'Try adjusting your search or filter'
                  : 'Add your first contact to get started'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contacts.map((contact: Contact) => (
                <div key={contact?.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {contact.first_name?.[0]}
                          {contact.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-base">
                          {contact.first_name} {contact.last_name}
                        </h3>
                        <div className="flex flex-col sm:flex-row flex-wrap sm:items-center sm:gap-4 mt-1 text-sm text-gray-600 break-words">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </div>
                          {contact.company && (
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {contact.company}
                            </div>
                          )}
                        </div>
                        {contact.contact_category_id && (
                          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {
                              contactCategories.find(
                                (cat) => cat.id === contact.contact_category_id,
                              )?.label
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingContact(contact)}
                        className="gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteContact(contact)}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Contact Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Contact">
          <ContactForm
            onSubmit={handleAddContact}
            onCancel={() => setShowAddModal(false)}
            isLoading={isLoading}
          />
        </Modal>
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <Modal
          isOpen={!!editingContact}
          onClose={() => setEditingContact(null)}
          title="Edit Contact"
        >
          <ContactForm
            contact={editingContact}
            onSubmit={handleEditContact}
            onCancel={() => setEditingContact(null)}
            isLoading={isLoading}
          />
        </Modal>
      )}
    </div>
  )
}

export default ContactDashboard
