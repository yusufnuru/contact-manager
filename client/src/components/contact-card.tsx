import { Edit, Trash2, Mail, Phone, Building } from 'lucide-react'
import type { Contact } from '../types'
import { contactCategories } from '../data/contact-categories'

const ContactCard: React.FC<{
  contact: Contact
  onEdit: () => void
  onDelete: () => void
}> = ({ contact, onEdit, onDelete }) => {
  const category = contactCategories.find((cat) => cat.id === contact.contact_category_id)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {contact.first_name} {contact.last_name}
          </h3>
          {category && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mt-1">
              {category.label}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1 text-gray-400 hover:text-blue-600">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="text-sm">{contact.phone}</span>
        </div>
        {contact.company && (
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="w-4 h-4" />
            <span className="text-sm">{contact.company}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactCard
