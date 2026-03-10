import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error(
        'Missing Clerk Publishable Key.\n' +
        'Add VITE_CLERK_PUBLISHABLE_KEY to your .env file.\n' +
        'Get it from https://dashboard.clerk.com → API Keys.'
    )
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
                <App />
            </ClerkProvider>
        </BrowserRouter>
    </StrictMode>
)
