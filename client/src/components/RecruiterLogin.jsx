import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'

const RecruiterLogin = () => {
    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

    // Company Logo States
    const [companyLogo, setCompanyLogo] = useState(null)
    const [logoPreview, setLogoPreview] = useState(null)
    const fileInputRef = useRef(null)

    // Forgot Password States
    const [isForgotPassword, setIsForgotPassword] = useState(false)
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotStep, setForgotStep] = useState('email')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otpError, setOtpError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [forgotEmailError, setForgotEmailError] = useState('')

    // ===== PAGE SCROLL LOCK =====
    useEffect(() => {
        // Save original overflow value
        const originalOverflow = document.body.style.overflow
        const originalPosition = document.body.style.position
        const originalWidth = document.body.style.width

        // Lock scroll
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.width = '100%'
        // Scroll to top instantly
        window.scrollTo(0, 0)

        // Cleanup: restore when component unmounts
        return () => {
            document.body.style.overflow = originalOverflow
            document.body.style.position = originalPosition
            document.body.style.width = originalWidth
        }
    }, [])

    // Handle logo file selection
    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file (PNG, JPG, SVG)')
                return
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('Logo size must be less than 2MB')
                return
            }
            setCompanyLogo(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Remove uploaded logo
    const removeLogo = () => {
        setCompanyLogo(null)
        setLogoPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Forgot Password - Send OTP
    const handleForgotSubmit = (e) => {
        e.preventDefault()
        if (forgotStep === 'email') {
            if (!forgotEmail) {
                setForgotEmailError('Please enter your email')
                return
            }
            setForgotEmailError('')
            alert(`OTP sent to ${forgotEmail}`)
            setForgotStep('otp')
        } else if (forgotStep === 'otp') {
            if (!otp) {
                setOtpError('Please enter the OTP')
                return
            }
            if (otp.length !== 6) {
                setOtpError('OTP must be 6 digits')
                return
            }
            setOtpError('')
            setForgotStep('newPassword')
        } else if (forgotStep === 'newPassword') {
            if (!newPassword || !confirmPassword) {
                setPasswordError('Please fill both fields')
                return
            }
            if (newPassword.length < 8) {
                setPasswordError('Password must be at least 8 characters')
                return
            }
            if (newPassword !== confirmPassword) {
                setPasswordError('Passwords do not match')
                return
            }
            setPasswordError('')
            setForgotStep('success')
        }
    }

    // Reset forgot password flow
    const resetForgotFlow = () => {
        setIsForgotPassword(false)
        setForgotEmail('')
        setOtp('')
        setNewPassword('')
        setConfirmPassword('')
        setForgotStep('email')
        setOtpError('')
        setPasswordError('')
        setForgotEmailError('')
    }

    // Main form submit
    const onSubmitHandler = (e) => {
        e.preventDefault()
        if (state === "Sign Up" && !isTextDataSubmitted) {
            setIsTextDataSubmitted(true)
            return
        }
        alert(state === "Login" ? "Login Successful!" : "Account Created Successfully!")
        setName(''); setEmail(''); setPassword(''); setIsTextDataSubmitted(false)
        setCompanyLogo(null); setLogoPreview(null)
    }

    // ===== FORGOT PASSWORD UI =====
    if (isForgotPassword) {
        return (
            <form onSubmit={handleForgotSubmit} className='text-slate-500'>
                <h1 className='text-center text-2xl font-semibold text-neutral-700'>Reset Password</h1>

                {/* Step indicator */}
                <div className='flex items-center justify-center gap-2 mt-4 mb-5'>
                    {['Email', 'Verify', 'New Password'].map((step, i) => {
                        const stepKeys = ['email', 'otp', 'newPassword']
                        const isActive = stepKeys[i] === forgotStep
                        const isDone = ['email', 'otp', 'newPassword'].indexOf(forgotStep) > i
                        return (
                            <React.Fragment key={i}>
                                <div className={`flex items-center gap-1.5 ${isActive ? 'text-blue-600' : isDone ? 'text-green-600' : 'text-slate-400'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${isActive ? 'border-blue-600 bg-blue-50 text-blue-600' : isDone ? 'border-green-600 bg-green-50 text-green-600' : 'border-slate-300 text-slate-400'}`}>
                                        {isDone ? '✓' : i + 1}
                                    </div>
                                    <span className='text-xs font-medium hidden sm:inline'>{step}</span>
                                </div>
                                {i < 2 && <div className={`w-8 h-0.5 ${isDone ? 'bg-green-500' : 'bg-slate-300'}`}></div>}
                            </React.Fragment>
                        )
                    })}
                </div>

                {forgotStep === 'email' && (
                    <>
                        <p className='text-sm text-center mb-4'>Enter your registered email to receive a password reset OTP</p>
                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-1'>
                            <img src={assets.email_icon} alt="" className="w-4 h-4" />
                            <input
                                className='outline-none text-sm w-full'
                                type="email"
                                placeholder='Registered Email Id'
                                value={forgotEmail}
                                onChange={(e) => { setForgotEmail(e.target.value); setForgotEmailError('') }}
                            />
                        </div>
                        {forgotEmailError && <p className='text-red-500 text-xs mt-1.5 ml-2'>{forgotEmailError}</p>}
                    </>
                )}

                {forgotStep === 'otp' && (
                    <>
                        <p className='text-sm text-center mb-4'>Enter the 6-digit OTP sent to <span className='font-medium text-neutral-700'>{forgotEmail}</span></p>
                        <div className='flex justify-center gap-2 my-4'>
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className='w-10 h-12 text-center text-lg font-semibold border-2 border-slate-300 rounded-lg outline-none focus:border-blue-600 transition-colors'
                                    value={otp[i] || ''}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '')
                                        const newOtp = otp.split('')
                                        newOtp[i] = val
                                        setOtp(newOtp.join(''))
                                        setOtpError('')
                                        if (val && e.target.nextElementSibling) {
                                            e.target.nextElementSibling.focus()
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !otp[i] && e.target.previousElementSibling) {
                                            e.target.previousElementSibling.focus()
                                        }
                                    }}
                                />
                            ))}
                        </div>
                        {otpError && <p className='text-red-500 text-xs mt-1 text-center'>{otpError}</p>}
                        <p className='text-xs text-center text-slate-400 mt-2 cursor-pointer hover:text-blue-600' onClick={() => setForgotStep('email')}>
                            ← Change email
                        </p>
                    </>
                )}

                {forgotStep === 'newPassword' && (
                    <>
                        <p className='text-sm text-center mb-4'>Set your new password</p>
                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-1'>
                            <img src={assets.lock_icon} alt="" className="w-4 h-4" />
                            <input
                                className='outline-none text-sm w-full'
                                type="password"
                                placeholder='New Password (min 8 characters)'
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value); setPasswordError('') }}
                            />
                        </div>
                        <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-3'>
                            <img src={assets.lock_icon} alt="" className="w-4 h-4" />
                            <input
                                className='outline-none text-sm w-full'
                                type="password"
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError('') }}
                            />
                        </div>
                        {passwordError && <p className='text-red-500 text-xs mt-1.5 ml-2'>{passwordError}</p>}

                        {newPassword && (
                            <div className='mt-2 ml-1'>
                                <div className='flex gap-1'>
                                    {[...Array(4)].map((_, i) => {
                                        const strength = [
                                            newPassword.length >= 8,
                                            /[A-Z]/.test(newPassword),
                                            /[0-9]/.test(newPassword),
                                            /[^A-Za-z0-9]/.test(newPassword)
                                        ]
                                        return (
                                            <div key={i} className={`h-1 flex-1 rounded-full ${strength[i] ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                                        )
                                    })}
                                </div>
                                <p className='text-xs text-slate-400 mt-0.5'>
                                    Use 8+ chars with uppercase, number & special char
                                </p>
                            </div>
                        )}
                    </>
                )}

                {forgotStep === 'success' && (
                    <div className='text-center py-4'>
                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                            <svg className='w-8 h-8 text-green-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className='text-lg font-semibold text-neutral-700'>Password Reset Successful!</p>
                        <p className='text-sm text-slate-400 mt-1'>You can now login with your new password</p>
                    </div>
                )}

                {forgotStep !== 'success' ? (
                    <div className='flex flex-col gap-2 mt-5'>
                        <button type='submit' className='bg-blue-600 hover:bg-blue-700 transition-all w-full text-white py-2.5 rounded-full font-medium'>
                            {forgotStep === 'email' ? 'Send OTP' : forgotStep === 'otp' ? 'Verify OTP' : 'Reset Password'}
                        </button>
                        <button type='button' onClick={resetForgotFlow} className='border border-slate-300 hover:bg-slate-50 transition-all w-full text-slate-600 py-2.5 rounded-full font-medium text-sm'>
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <button type='button' onClick={resetForgotFlow} className='bg-blue-600 hover:bg-blue-700 transition-all w-full text-white py-2.5 rounded-full mt-5 font-medium'>
                        Back to Login
                    </button>
                )}
            </form>
        )
    }

    // ===== MAIN LOGIN / SIGNUP UI =====
    return (
        <form onSubmit={onSubmitHandler} className='text-slate-500'>
            <h1 className='text-center text-2xl font-semibold text-neutral-700'>Recruiter {state}</h1>
            <p className='text-sm text-center mt-2 mb-5'>{state === "Login" ? "Welcome back! Please sign in" : "Create your recruiter account"}</p>

            {state === "Sign Up" && !isTextDataSubmitted && (
                <>
                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-3'>
                        <img src={assets.person_icon} alt="" className="w-4 h-4" />
                        <input className='outline-none text-sm w-full' type="text" placeholder='Company Name' required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-3'>
                        <img src={assets.email_icon} alt="" className="w-4 h-4" />
                        <input className='outline-none text-sm w-full' type="email" placeholder='Email Id' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </>
            )}

            {state === "Sign Up" && isTextDataSubmitted && (
                <>
                    <div className='mt-3'>
                        <label className='text-xs font-medium text-slate-600 mb-2 block'>Company Logo</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/svg+xml, image/webp"
                            ref={fileInputRef}
                            onChange={handleLogoChange}
                            className='hidden'
                        />
                        {!logoPreview ? (
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className='border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all'
                            >
                                <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center'>
                                    <svg className='w-6 h-6 text-slate-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className='text-xs text-slate-500 font-medium'>Click to upload logo</p>
                                <p className='text-[10px] text-slate-400'>PNG, JPG, SVG or WebP (Max 2MB)</p>
                            </div>
                        ) : (
                            <div className='relative border rounded-2xl p-4 flex flex-col items-center gap-3 bg-slate-50'>
                                <button
                                    type='button'
                                    onClick={removeLogo}
                                    className='absolute top-2 right-2 w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors'
                                >
                                    <svg className='w-3.5 h-3.5 text-red-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className='w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden p-2'>
                                    <img src={logoPreview} alt="Company Logo" className='w-full h-full object-contain' />
                                </div>
                                <div className='text-center'>
                                    <p className='text-xs font-medium text-slate-700'>{companyLogo?.name}</p>
                                    <p className='text-[10px] text-slate-400'>{(companyLogo?.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => fileInputRef.current.click()}
                                    className='text-xs text-blue-600 hover:underline font-medium'
                                >
                                    Change Logo
                                </button>
                            </div>
                        )}
                    </div>

                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-4'>
                        <img src={assets.lock_icon} alt="" className="w-4 h-4" />
                        <input className='outline-none text-sm w-full' type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </>
            )}

            {state === "Login" && (
                <>
                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-3'>
                        <img src={assets.email_icon} alt="" className="w-4 h-4" />
                        <input className='outline-none text-sm w-full' type="email" placeholder='Email Id' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-3'>
                        <img src={assets.lock_icon} alt="" className="w-4 h-4" />
                        <input className='outline-none text-sm w-full' type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className='flex justify-end mt-2'>
                        <span
                            className='text-xs text-blue-600 cursor-pointer hover:underline font-medium'
                            onClick={() => { setIsForgotPassword(true); setEmail(''); setPassword('') }}
                        >
                            Forgot Password?
                        </span>
                    </div>
                </>
            )}

            <button type='submit' className='bg-blue-600 hover:bg-blue-700 transition-all w-full text-white py-2.5 rounded-full mt-5 font-medium'>
                {state === "Login" ? "Login" : isTextDataSubmitted ? "Create Account" : "Next"}
            </button>

            {state === "Login" ? (
                <p className='mt-4 text-center text-sm'>Don't have an account?<span className='text-blue-600 cursor-pointer ml-1 hover:underline' onClick={() => { setState("Sign Up"); setIsTextDataSubmitted(false); setName(''); setEmail(''); setPassword(''); setCompanyLogo(null); setLogoPreview(null) }}>Sign Up</span></p>
            ) : (
                <p className='mt-4 text-center text-sm'>Already have an account?<span className='text-blue-600 cursor-pointer ml-1 hover:underline' onClick={() => { setState("Login"); setIsTextDataSubmitted(false); setName(''); setEmail(''); setPassword(''); setCompanyLogo(null); setLogoPreview(null) }}>Login</span></p>
            )}
        </form>
    )
}

export default RecruiterLogin