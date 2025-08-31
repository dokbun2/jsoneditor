# JSON Formatter & Validator

A powerful online JSON formatting and validation tool that replicates the functionality of classic.online-json.com.

## Features

✨ **Core Functionality**
- JSON validation with detailed error messages
- JSON formatting with customizable indentation (0-10 spaces)
- JSON minification
- Real-time validation as you type

🎨 **View Modes**
- Code view with syntax highlighting
- Tree view for hierarchical visualization
- Preview view for data tables

📁 **File Operations**
- Load JSON from local files
- Load JSON from URLs (requires CORS)
- Download formatted JSON
- Sample JSON data

🛠️ **Additional Features**
- Copy to clipboard (input/output)
- Font size adjustment
- Fullscreen mode
- Line and character count
- File size display

## How to Use

1. **Open the Application**
   - Simply open `index.html` in any modern web browser

2. **Input JSON**
   - Paste your JSON in the left panel
   - Or load from a file using "Load File" button
   - Or use the "Sample" button for example data

3. **Format/Validate**
   - Click "Format" to beautify your JSON
   - Click "Validate" to check if JSON is valid
   - Click "Minify" to compress JSON

4. **View Options**
   - Switch between Code, Tree, and Preview views
   - Adjust font size with A+ and A- buttons
   - Use fullscreen mode for better visibility

5. **Export**
   - Copy formatted JSON to clipboard
   - Download as a JSON file

## Technical Details

- **Pure JavaScript** - No external dependencies except CodeMirror CDN for optional enhanced editing
- **Client-side only** - All processing happens in your browser
- **Responsive design** - Works on desktop and mobile devices
- **Modern UI** - Clean, intuitive interface with gradient styling

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

All JSON processing happens locally in your browser. No data is sent to any server.

## License

Open source - Feel free to use and modify as needed.