import { useState } from 'react'
import axios from 'axios'

const API_BASE = 'http://localhost:5000'

export default function Login({ onLogin }) {
    const [mode, setMode] = useState('login') // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (mode === 'register' && form.name.trim().length < 2) {
            setError('Please enter your full name.')
            return
        }
        if (!form.email.includes('@')) {
            setError('Please enter a valid email address.')
            return
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)
        try {
            const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
            const payload = mode === 'login'
                ? { email: form.email.toLowerCase().trim(), password: form.password }
                : { name: form.name.trim(), email: form.email.toLowerCase().trim(), password: form.password }

            const res = await axios.post(`${API_BASE}${endpoint}`, payload)
            const { token, user } = res.data

            localStorage.setItem('token', token)
            onLogin(user)
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login')
        setForm({ name: '', email: '', password: '' })
        setError('')
    }

    return (
        <div style={styles.wrapper}>
            <div style={styles.card}>
                {/* Logo / Header */}
                <div style={styles.header}>
                    <div style={styles.logoIcon}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <h1 style={styles.title}>Student Management</h1>
                    <p style={styles.subtitle}>
                        {mode === 'login' ? 'Welcome back! Sign in to your account.' : 'Create a new account to get started.'}
                    </p>
                </div>

                {/* Demo Credentials */}
                <div style={styles.demoBox}>
                    <div style={styles.demoHeader}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span style={styles.demoTitle}>Demo Admin Credentials</span>
                    </div>
                    <div style={styles.demoCredentials}>
                        <div style={styles.demoRow}>
                            <span style={styles.demoKey}>Email</span>
                            <code style={styles.demoVal}>admin@gmail.com</code>
                        </div>
                        <div style={styles.demoRow}>
                            <span style={styles.demoKey}>Password</span>
                            <code style={styles.demoVal}>admin123</code>
                        </div>
                    </div>
                    <button
                        type="button"
                        style={styles.demoFillBtn}
                        onClick={() => {
                            setMode('login')
                            setForm(f => ({ ...f, email: 'admin@gmail.com', password: 'admin123' }))
                            setError('')
                        }}
                    >
                        ↙ Fill credentials
                    </button>
                </div>

                {/* Tabs */}
                <div style={styles.tabRow}>
                    <button
                        style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
                        onClick={toggleMode}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
                        onClick={toggleMode}
                        type="button"
                    >
                        Register
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form} noValidate>
                    {mode === 'register' && (
                        <div style={styles.fieldGroup}>
                            <label style={styles.label} htmlFor="name">Full Name</label>
                            <div style={styles.inputWrapper}>
                                <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                    style={styles.input}
                                    autoComplete="name"
                                />
                            </div>
                        </div>
                    )}

                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="email">Email Address</label>
                        <div style={styles.inputWrapper}>
                            <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                style={styles.input}
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label} htmlFor="password">Password</label>
                        <div style={styles.inputWrapper}>
                            <svg style={styles.inputIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder={mode === 'register' ? 'Min. 6 characters' : 'Your password'}
                                value={form.password}
                                onChange={handleChange}
                                style={{ ...styles.input, paddingRight: '44px' }}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeBtn}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={styles.errorBox}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnDisabled : {}) }}
                    >
                        {loading ? (
                            <span style={styles.loadingInner}>
                                <svg style={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                            </span>
                        ) : (
                            mode === 'login' ? 'Sign In' : 'Create Account'
                        )}
                    </button>
                </form>

                <p style={styles.switchText}>
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                    {' '}
                    <button onClick={toggleMode} style={styles.switchLink} type="button">
                        {mode === 'login' ? 'Register here' : 'Sign in here'}
                    </button>
                </p>
            </div>
        </div>
    )
}

const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },
    card: {
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '44px 40px',
        width: '420px',
        maxWidth: '94vw',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '28px'
    },
    logoIcon: {
        width: '56px',
        height: '56px',
        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        boxShadow: '0 8px 20px rgba(37,99,235,0.3)'
    },
    title: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#0f172a',
        margin: '0 0 8px 0',
        letterSpacing: '-0.025em'
    },
    subtitle: {
        fontSize: '14px',
        color: '#64748b',
        margin: 0,
        fontWeight: '500'
    },
    tabRow: {
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: '12px',
        padding: '4px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
    },
    tab: {
        flex: 1,
        padding: '10px',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        color: '#64748b',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    tabActive: {
        background: 'white',
        color: '#1e40af',
        boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        border: '1px solid #dbeafe'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: '14px',
        pointerEvents: 'none',
        zIndex: 1
    },
    input: {
        width: '100%',
        padding: '12px 14px 12px 44px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        color: '#0f172a',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s, background 0.2s',
        boxSizing: 'border-box'
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '6px'
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 14px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '10px',
        color: '#dc2626',
        fontSize: '13px',
        fontWeight: '500'
    },
    submitBtn: {
        marginTop: '4px',
        padding: '13px',
        background: '#2563eb',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'background 0.2s',
        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        letterSpacing: '-0.01em'
    },
    submitBtnDisabled: {
        opacity: 0.65,
        cursor: 'not-allowed'
    },
    loadingInner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    spinner: {
        animation: 'spin 1s linear infinite'
    },
    switchText: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
        color: '#64748b'
    },
    switchLink: {
        background: 'transparent',
        border: 'none',
        color: '#2563eb',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '14px',
        padding: 0,
        textDecoration: 'underline',
        textUnderlineOffset: '2px'
    },
    demoBox: {
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '20px'
    },
    demoHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '10px'
    },
    demoTitle: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#1e40af'
    },
    demoCredentials: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '10px'
    },
    demoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },
    demoKey: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#3b82f6',
        width: '60px',
        flexShrink: 0
    },
    demoVal: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#1e3a8a',
        background: 'rgba(37,99,235,0.08)',
        padding: '2px 8px',
        borderRadius: '6px',
        fontFamily: "'Courier New', monospace"
    },
    demoFillBtn: {
        background: 'transparent',
        border: 'none',
        color: '#2563eb',
        fontSize: '12px',
        fontWeight: '700',
        cursor: 'pointer',
        padding: 0,
        textDecoration: 'underline',
        textUnderlineOffset: '2px'
    }
}
