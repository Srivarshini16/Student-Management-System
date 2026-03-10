import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useUser, useAuth, useClerk, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { setTokenGetter } from './tokenStore'
import Home from './pages/Home'
import AdminProfile from './pages/AdminProfile'
import ChatPage from './pages/ChatPage'

/**
 * Map a Clerk user object → the app's internal user shape.
 * Everyone who signs in is treated as an admin — no email restriction.
 */
function mapClerkUser(clerkUser) {
    const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase() || ''
    return {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        email,
        picture: clerkUser.imageUrl || '',
        role: 'admin'   // All signed-in users are admins
    }
}

function AuthenticatedApp() {
    const { user: clerkUser } = useUser()
    const { getToken } = useAuth()
    const { signOut } = useClerk()
    const navigate = useNavigate()

    useEffect(() => {
        setTokenGetter(getToken)
    }, [getToken])

    const handleLogout = async () => {
        await signOut()
        navigate('/')
    }

    const user = mapClerkUser(clerkUser)

    return (
        <Routes>
            <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
            <Route path="/admin-profile" element={<AdminProfile user={user} />} />
            <Route path="/chat" element={<ChatPage user={user} onLogout={handleLogout} />} />
        </Routes>
    )
}

export default function App() {
    return (
        <>
            <SignedIn>
                <AuthenticatedApp />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    )
}
