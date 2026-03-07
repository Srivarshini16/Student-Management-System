import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

export default function Login({ onLogin }) {
    const handleSuccess = (credentialResponse) => {
        const user = jwtDecode(credentialResponse.credential)
        onLogin(user)
    }

    const handleError = () => {
        alert('Login failed. Please try again.')
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                <h1 style={styles.title}>Student Management System</h1>
                <p style={styles.subtitle}>Sign in to continue</p>
                <div style={styles.btnWrapper}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />
                </div>
            </div>
        </div>
    )
}

const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    },
    card: {
        background: 'white',
        padding: '48px',
        borderRadius: '24px',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '400px',
        border: '1px solid rgba(255,255,255,0.8)'
    },
    title: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '12px',
        letterSpacing: '-0.025em'
    },
    subtitle: {
        fontSize: '16px',
        color: '#64748b',
        marginBottom: '32px',
        fontWeight: '500'
    },
    btnWrapper: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px'
    }
}
