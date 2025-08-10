# React Form Builder

A dynamic form builder built with React, TypeScript, Material-UI, and Redux Toolkit. Create, configure, and manage dynamic forms with validation rules and derived fields.

## ✨ Features

- **Form Builder** - Create forms with text, number, textarea, select, radio, checkbox, and date fields
- **Field Configuration** - Set labels, defaults, required flags, and validation rules
- **Derived Fields** - Create computed fields based on other field values
- **Live Preview** - Test forms with real-time validation and derived field updates
- **Form Management** - Save, view, and manage all your forms
- **localStorage Persistence** - No backend required

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Redux Toolkit** for state management
- **Material-UI** for components
- **React Router** for navigation
- **localStorage** for data persistence

## 📱 Routes

- `/create` - Build new forms
- `/preview` - Test form behavior
- `/myforms` - Manage saved forms

## 🔧 Field Types

- Text, Number, Textarea
- Select, Radio, Checkbox
- Date picker
- Derived fields (computed values)

## ✅ Validation Rules

- Required fields
- Min/max length
- Email format
- Password requirements
- Custom validation

## 📁 Project Structure

```
src/
├── components/     # UI components
├── pages/         # Main pages
├── store/         # Redux state
├── services/      # localStorage service
└── types/         # TypeScript types
```

## 🎯 Example Use Cases

- **Registration Forms** - User signup with validation
- **Survey Forms** - Multi-field data collection
- **Application Forms** - Job applications, loan requests
- **Contact Forms** - Lead generation and inquiries

## 🌐 Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)

## 📄 License

MIT License

---

**Built with React, TypeScript, and Material-UI** 