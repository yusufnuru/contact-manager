import { Mail, Phone, Building } from 'lucide-react'
import { useState, useEffect } from 'react'
import { contactCategories } from '../data/contact-categories'
import type { Contact } from '../types'
import Button from './ui/button'
import Input from './ui/input'
import Select from './ui/select'
import useAuth from '../hooks/useAuth'

const ContactForm: React.FC<{
  contact?: Partial<Contact>
  onSubmit: (contact: Omit<Contact, 'id' | 'created_at'>) => void
  onCancel: () => void
  isLoading?: boolean
}> = ({ contact, onSubmit, onCancel, isLoading }) => {
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    user_id: contact?.user_id || '',
    first_name: contact?.first_name || '',
    last_name: contact?.last_name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    contact_category_id: contact?.contact_category_id || '',
  })

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({
        ...prev,
        user_id: user.id,
      }))
    }
  }, [user?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          icon={<Mail className="w-5 h-5 text-gray-400" />}
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          icon={<Phone className="w-5 h-5 text-gray-400" />}
        />

        <Input
          label="Company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          icon={<Building className="w-5 h-5 text-gray-400" />}
        />

        <Select
          label="Category"
          value={formData.contact_category_id}
          onChange={(e) => setFormData({ ...formData, contact_category_id: e.target.value })}
          options={contactCategories.map((cat) => ({ value: cat.id, label: cat.label }))}
          placeholder="Select a category"
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? 'Saving...' : contact ? 'Update Contact' : 'Add Contact'}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
