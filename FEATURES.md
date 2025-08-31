# JSON Editor - Feature Documentation

## Overview
This is a comprehensive JSON editor that replicates and enhances the functionality of online-json.com/json-editor, built with React, TypeScript, and Monaco Editor.

## Core Features

### 1. Dual Panel Editor
- **Left Panel**: Input/editing area
- **Right Panel**: Output/preview area
- **Layout Options**: Horizontal or vertical split
- **View Modes**: Code, Tree, Form (coming soon), and Text views

### 2. JSON Operations

#### Format/Beautify
- Pretty print JSON with customizable indentation (0, 2, 4 spaces)
- Keyboard shortcut: `Ctrl+I` / `Cmd+I`

#### Compact/Minify
- Remove all whitespace to minimize JSON size
- Keyboard shortcut: `Ctrl+Shift+I` / `Cmd+Shift+I`

#### Sort Keys
- Alphabetically sort all object keys recursively
- Maintains nested structure integrity

#### Repair JSON
- Automatically fixes common JSON issues:
  - Removes comments (single-line and multi-line)
  - Fixes trailing commas
  - Converts single quotes to double quotes
  - Adds quotes to unquoted keys
  - Converts JavaScript values (undefined, NaN, Infinity) to null
  - Fixes missing commas between elements
  - Balances brackets and braces

### 3. Tree View Features
- **Interactive Navigation**: Expand/collapse nodes
- **Visual Indicators**: 
  - Object count `{n}`
  - Array count `[n]`
  - Type-based color coding
- **Inline Editing**: Edit values directly in tree view
- **Node Operations**: Delete nodes, reorder (drag & drop ready)
- **Search**: Highlight matching keys and values
- **Bulk Actions**: Expand all / Collapse all

### 4. Editor Features

#### Monaco Editor Integration
- Syntax highlighting for JSON
- Automatic bracket pair colorization
- Code folding
- Auto-completion
- Format on paste/type
- Line numbers (toggleable)
- Word wrap (toggleable)
- Minimap (toggleable)
- Cursor position indicator

#### Theme Support
- Dark mode (default)
- Light mode
- Toggle button in header

#### Font Controls
- Adjustable font size (10px - 24px)
- Keyboard shortcuts for quick adjustment

### 5. File Operations

#### Upload
- Support for `.json` and `.txt` files
- Automatic validation on load
- File name display in header

#### Download
- Export formatted or minified JSON
- Automatic file naming with prefix

#### Copy to Clipboard
- One-click copy for input and output
- Visual feedback on successful copy

### 6. Live Mode
- Real-time validation as you type
- Automatic formatting in output panel
- Toggle on/off for manual control

### 7. History Management
- **Undo/Redo** functionality
- Keyboard shortcuts: `Ctrl+Z` / `Ctrl+Shift+Z`
- Maintains full edit history during session

### 8. Validation & Error Handling
- Real-time JSON validation
- Clear error messages with line/column information
- Visual status indicators (Valid/Invalid/Empty)
- Syntax error highlighting
- Auto-fix suggestions

### 9. Status Information
- Line count
- Character count
- File size in bytes
- Validation status
- Cursor position (line, column)

### 10. Search & Filter
- Search within tree view
- Highlight matching nodes
- Case-insensitive search
- Search in both keys and values

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Format JSON | `Ctrl+I` / `Cmd+I` |
| Compact JSON | `Ctrl+Shift+I` / `Cmd+Shift+I` |
| Undo | `Ctrl+Z` / `Cmd+Z` |
| Redo | `Ctrl+Shift+Z` / `Cmd+Shift+Z` |
| Expand Node | `Ctrl+E` (in tree view) |
| Open Actions Menu | `Ctrl+M` (in tree view) |

## UI Components

### Header
- Application title
- File name badge
- Theme toggle
- Layout toggle

### Toolbar
- File operations (Upload, Download)
- JSON operations (Format, Compact, Sort, Repair)
- Edit operations (Undo, Redo, Clear)
- Settings (Live mode, Indentation, Font size)

### Panels
- Tab navigation for view modes
- Copy button
- Validation status
- Line/size information

### Status Bar
- Error messages
- Fixed issues report
- Success notifications

## Technical Implementation

### Technologies Used
- **React 18**: Component framework
- **TypeScript**: Type safety
- **Monaco Editor**: Code editing
- **Tailwind CSS**: Styling
- **Vite**: Build tool

### Component Structure
- `JsonEditor`: Monaco editor wrapper with enhanced features
- `JsonTreeView`: Interactive tree visualization
- `App-Enhanced`: Main application with all features integrated

### State Management
- React hooks for local state
- Controlled components for forms
- History stack for undo/redo

### Performance Optimizations
- Memoized computations
- Lazy loading for large JSON files
- Debounced validation
- Virtual scrolling in tree view

## Improvements Over Original

1. **Enhanced Repair Function**: More comprehensive JSON fixing
2. **Better Tree View**: Interactive editing and search
3. **Keyboard Shortcuts**: Productivity enhancements
4. **Theme Support**: Dark/light mode toggle
5. **Layout Flexibility**: Horizontal/vertical splits
6. **Better Error Messages**: More descriptive and actionable
7. **History Management**: Full undo/redo support
8. **Modern UI**: Cleaner, more intuitive interface

## Future Enhancements

- Form view for structured editing
- JSON Schema validation
- Diff view for comparing JSONs
- Export to different formats (XML, YAML, CSV)
- Collaborative editing
- Custom themes
- Plugin system
- API integration for remote JSON
- Batch processing
- Advanced transformations (JSONPath, jq queries)