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
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh',
        background: '#f4f6f8'
    },
    card: {
        background: 'white', padding: '40px',
        borderRadius: '12px', textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '360px'
    },
    title: {
        fontSize: '22px', color: '#333',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '14px', color: '#888',
        marginBottom: '28px'
    },
    btnWrapper: {
        display: 'flex', justifyContent: 'center'
    }
}