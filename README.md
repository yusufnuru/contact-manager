# IBN Contact Manager

A full-stack contact management application built with React frontend and Express backend, featuring contact organization, categorization, and search capabilities.

## 📋 Assessment Project

This is a technical assessment project demonstrating full-stack development skills with modern technologies and best practices.

## 🎯 Objective

Build a comprehensive contact management system for storing and organizing contacts with clean, functional implementation and intuitive user experience.

## ✨ Features

### Core Requirements
- **Contact Storage**: Store complete contact information (name, phone, email, company)
- **Contact Categorization**: Organize contacts by type (Customer, Vendor, VIP, etc.)
- **Search & Filter**: Advanced search and filtering capabilities
- **Organized Display**: Clean, user-friendly contact display interface
- **Data Management**: Full CRUD operations for contact management

### Additional Features
- Modern React frontend with responsive design
- RESTful API backend
- PostgreSQL database with Supabase
- User authentication and authorization (Supabase Auth)
- Multi-user support with data isolation
- Type-safe database operations with Drizzle ORM
- Database indexing for optimal performance
- Environment-based configuration
- Clean architecture with separation of concerns

## 🏗️ Architecture

```
contact-management-system/
├── client/                 # React Frontend
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
├── server/                 # Express Backend
│   ├── src/
│   ├── drizzle/           # Database migrations
│   ├── .env
│   └── package.json
└── README.md
```

## 🚀 Tech Stack

### Frontend (Client)
- **React** - UI framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **Modern CSS/Tailwind** - Styling

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database toolkit
- **Supabase** - PostgreSQL database with built-in authentication

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn or pnpm package manager
- Supabase account and project

### 1. Clone the Repository
```bash
git clone https://github.com/yusufnuru/contact-manager
cd contact-manager
```

### 2. Server Setup
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
PORT=5000
DB_URL=your_supabase_database_url
NODE_ENV=development
APP_ORIGIN=http://localhost:3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Client Setup
```bash
cd ../client
npm install
```

Create `.env` file in the client directory:
```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Database Setup
```bash
cd ../server

# Generate database migrations
npm run drizzle:dev:generate

# Run database migrations
npm run drizzle:dev:migrate

# Seed database with initial categories
npm run db:dev:seed
```

## 🏃‍♂️ Running the Application

### Start the Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

### Start the Frontend Client
```bash
cd client
npm run dev
```
Client will run on `http://localhost:3000`

## 📚 Available Scripts

### Server Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run drizzle:dev:generate` - Generate database migrations
- `npm run drizzle:dev:migrate` - Run database migrations
- `npm run db:dev:seed` - Seed database with initial categories

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🗂️ Database Schema

### Contact Categories Table
```sql
CREATE TABLE "contact_categories" (
    "id" varchar(50) PRIMARY KEY NOT NULL,
    "label" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
```

### Contacts Table
```sql
CREATE TABLE "contacts" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    "first_name" varchar(100) NOT NULL,
    "last_name" varchar(100) NOT NULL,
    "email" varchar(255) NOT NULL,
    "phone" varchar(20) NOT NULL,
    "company" varchar(100),
    "contact_category_id" varchar(50),
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "contacts_contact_category_id_contact_categories_id_fk" 
        FOREIGN KEY ("contact_category_id") REFERENCES "contact_categories"("id") 
        ON DELETE SET NULL,
    CONSTRAINT "contact_user_email_phone_unique_idx" 
        UNIQUE("user_id","email","phone")
);
```

### Key Features:
- **User Isolation**: Each contact belongs to a specific user via `user_id`
- **Supabase Auth Integration**: References `auth.users(id)` for user management
- **Category System**: Flexible contact categorization with foreign key relationship
- **Performance Optimized**: Multiple indexes for fast queries
- **Data Integrity**: Unique constraints and proper referential integrity

## 🗂️ Project Structure
```
client/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application component
├── public/               # Static assets
└── index.html           # HTML template
```

### Client Structure
```
server/
├── src/
│   ├── routes/           # API route handlers
│   ├── controllers/      # Business logic controllers
│   ├── models/           # Database models (Drizzle schema)
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── app.ts            # Express application setup
├── drizzle/              # Database migrations and config
│   └── seed/             # Database seed files
└── drizzle.config.ts     # Drizzle configuration
```

### Server Structure

## 🎨 API Endpoints

### Authentication (Supabase Integration)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (authenticated)
- `POST /api/auth/logout` - User logout (authenticated)

### Contacts (User-specific)
- `GET /api/contacts` - Get all contacts for authenticated user
- `GET /api/contacts/:id` - Get contact by ID (user-owned)
- `POST /api/contacts` - Create new contact for authenticated user
- `PUT /api/contacts/:id` - Update contact (user-owned)
- `DELETE /api/contacts/:id` - Delete contact (user-owned)
- `GET /api/contacts/search?q=query` - Search user's contacts
- `GET /api/contacts/category/:category` - Filter user's contacts by category

## 🔧 Configuration

### Environment Variables

#### Client (.env)
- `VITE_API_BASE_URL` - Backend API base URL

#### Server (.env)
- `PORT` - Server port number
- `DB_URL` - Supabase database connection URL
- `NODE_ENV` - Environment mode (development/production)
- `APP_ORIGIN` - Frontend application origin for CORS
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## 🧪 Data Structure

### Contact Interface
```typescript
interface Contact {
  id: string;                    // UUID
  user_id: string;               // UUID - References Supabase auth.users
  first_name: string;            // Max 100 characters
  last_name: string;             // Max 100 characters
  email: string;                 // Max 255 characters
  phone: string;                 // Max 20 characters
  company?: string;              // Optional, max 100 characters
  contact_category_id?: string;  // References contact_categories.id
  created_at: Date;
  updated_at: Date;
}
```

### Contact Category Interface
```typescript
interface ContactCategory {
  id: string;                    // varchar(50) - Primary key
  label: string;                 // Category label (Customer, Vendor, VIP, etc.)
  created_at: Date;
  updated_at: Date;
}
```

### Database Indexes (Performance Optimized)
- **Contact Categories**: `id`, `label`, `created_at`
- **Contacts**: `user_id`, `email`, `contact_category_id`, `first_name + last_name`, `created_at`
- **Unique Constraint**: `user_id + email + phone` (prevents duplicate contacts per user)

## 🎯 Key Features Implementation

### Contact Management
- Complete CRUD operations for contacts
- Form validation and error handling
- Real-time updates

### Search & Filter
- Text-based search across all contact fields
- Category-based filtering
- Combined search and filter capabilities

### User Experience
- Responsive design for all device sizes
- Loading states and error handling
- Intuitive navigation and interactions
- Clean, modern interface design

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Update `VITE_API_BASE_URL` to production API URL
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🛟 Support

If you encounter any issues or have questions, please create an issue in the GitHub repository.

---

**Happy Contact Managing! 📇**
