# React + Redux Form Builder

A dynamic form builder application built with React, TypeScript, Material-UI, and Redux Toolkit. Users can create, configure, preview, and manage dynamic forms with validation rules and derived fields.

## Features

### 🏗️ Form Builder (/create)
- **Dynamic Field Creation**: Add fields of various types (text, number, textarea, select, radio, checkbox, date)
- **Field Configuration**: 
  - Custom labels and default values
  - Required field toggles
  - Comprehensive validation rules (required, min/max length, email format, password rules, custom)
- **Derived Fields**: Create computed fields based on parent field values
- **Field Management**: Reorder, edit, and delete fields with drag-and-drop
- **Form Persistence**: Save forms to localStorage

### 👀 Form Preview (/preview)
- **Live Preview**: See exactly how your form will appear to end users
- **Real-time Validation**: All configured validation rules are active
- **Derived Field Updates**: Automatic computation as parent fields change
- **User Experience**: Test form behavior and validation flow

### 📚 My Forms (/myforms)
- **Form Library**: View all saved forms with creation dates
- **Quick Actions**: Preview, edit, or delete existing forms
- **Form Statistics**: See field counts, types, and validation requirements

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI (MUI)
- **Routing**: React Router v6
- **Drag & Drop**: react-beautiful-dnd
- **Storage**: localStorage for persistence
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uplaince-form-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   └── FieldConfigDialog.tsx  # Field configuration modal
├── pages/              # Main application pages
│   ├── CreateForm.tsx  # Form builder interface
│   ├── PreviewForm.tsx # Form preview and testing
│   └── MyForms.tsx     # Saved forms management
├── store/              # Redux state management
│   ├── index.ts        # Store configuration
│   ├── hooks.ts        # Typed Redux hooks
│   └── formBuilderSlice.ts  # Form builder state logic
├── services/           # External services
│   └── localStorage.ts # Data persistence service
├── types/              # TypeScript type definitions
│   └── index.ts        # Core application types
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## Key Features Implementation

### Field Types Support
- **Text**: Single-line text input
- **Number**: Numeric input with validation
- **Textarea**: Multi-line text input
- **Select**: Dropdown selection with custom options
- **Radio**: Radio button group with custom options
- **Checkbox**: Boolean toggle input
- **Date**: Date picker input

### Validation System
- **Required Fields**: Ensure mandatory data entry
- **Length Validation**: Min/max character limits
- **Email Format**: Standard email validation
- **Password Rules**: Minimum length and complexity requirements
- **Custom Rules**: Extensible validation framework

### Derived Fields
- **Parent Field Selection**: Choose source fields for computation
- **Formula Definition**: Describe computation logic
- **Real-time Updates**: Automatic recalculation on parent changes
- **Example**: Age calculation from Date of Birth

### State Management
- **Redux Toolkit**: Modern Redux with simplified patterns
- **TypeScript Integration**: Full type safety across the application
- **localStorage Persistence**: Automatic form data saving
- **Optimistic Updates**: Immediate UI feedback

## Usage Examples

### Creating a Simple Form
1. Navigate to `/create`
2. Click "Add Field" to add form elements
3. Configure field properties (label, type, validation)
4. Set field order with drag-and-drop
5. Save the form with a descriptive name

### Building a Registration Form
1. **Personal Information Section**
   - Text field: Full Name (required)
   - Email field: Email Address (required, email validation)
   - Date field: Date of Birth (required)
   - Derived field: Age (computed from DOB)

2. **Account Security Section**
   - Text field: Username (required, min length 3)
   - Text field: Password (required, password validation)
   - Text field: Confirm Password (required, custom validation)

3. **Preferences Section**
   - Select field: Country (with predefined options)
   - Radio field: Newsletter Subscription
   - Checkbox field: Terms and Conditions (required)

### Testing Form Behavior
1. Navigate to `/preview` after building a form
2. Fill out fields to test validation rules
3. Observe derived field updates in real-time
4. Submit the form to see final validation results

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- **Efficient Rendering**: React.memo for expensive components
- **Optimized State Updates**: Redux Toolkit's Immer integration
- **Lazy Loading**: Route-based code splitting ready
- **localStorage Limits**: Handles storage quota exceeded scenarios

## Future Enhancements

- **Form Templates**: Pre-built form configurations
- **Advanced Validation**: Custom regex patterns, conditional rules
- **Form Analytics**: Usage statistics and completion rates
- **Export Options**: PDF, CSV, JSON form data export
- **Multi-language Support**: Internationalization (i18n)
- **Cloud Storage**: Backend integration for form persistence
- **Collaboration**: Multi-user form editing and sharing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feature requests, please open an issue in the repository.

---

**Built with ❤️ using React, TypeScript, and Material-UI** 