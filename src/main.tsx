
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// This ensures that the application will work correctly with the latest Lovable features
const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found. Make sure there's a div with id 'root' in your HTML.");
}
