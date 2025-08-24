// Login Page JavaScript

// Global Variables
let currentCaptcha = { question: '', answer: 0 };
let loginAttempts = 0;
const maxAttempts = 3;

// User credentials for demo
const demoUsers = {
    student: {
        '202511922': { password: '1136334107', name: 'أثير بنت أحمد بن علي هادي أحمد', type: 'student' },
        '202511923': { password: '1137521918', name: 'يقين احمد العلي', type: 'student' },
        '2420385': { password: 'student789', name: 'فهد عبدالله أحمد', type: 'student' }
    },
    faculty: {
        'ahmed.mohamed': { password: 'faculty123', name: 'د. أحمد محمد السعيد', type: 'faculty' },
        'fatima.ali': { password: 'faculty456', name: 'د. فاطمة علي الزهراني', type: 'faculty' },
        'omar.hassan': { password: 'faculty789', name: 'د. عمر حسن القحطاني', type: 'faculty' }
    },
    employee: {
        'admin': { password: 'admin123', name: 'محمد عبدالرحمن الإداري', type: 'employee' },
        'hr.manager': { password: 'hr456', name: 'نورا أحمد الموارد البشرية', type: 'employee' },
        'it.support': { password: 'it789', name: 'خالد سعد الدعم التقني', type: 'employee' }
    }
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const captchaInput = document.getElementById('captcha');
const loginBtn = document.getElementById('loginBtn');
const successModal = document.getElementById('successModal');
const userTypeInput = document.getElementById('userType');
const tabBtns = document.querySelectorAll('.tab-btn');
const passwordStrength = document.getElementById('passwordStrength');

// Initialize Login Page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
    setupEventListeners();
    generateCaptcha();
    checkSavedCredentials();
});

// Initialize Login Page
function initializeLoginPage() {
    console.log('Login page initialized');
    
    // Set initial user type
    updateUserTypeInterface('student');
    
    // Add input animations
    addInputAnimations();
    
    // Check for URL parameters
    checkURLParameters();
}

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const userType = this.getAttribute('data-tab');
            switchUserType(userType);
        });
    });
    
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Input validation
    usernameInput.addEventListener('input', validateUsername);
    usernameInput.addEventListener('blur', validateUsername);
    
    passwordInput.addEventListener('input', validatePassword);
    passwordInput.addEventListener('blur', validatePassword);
    
    captchaInput.addEventListener('input', validateCaptcha);
    
    // Password strength indicator
    passwordInput.addEventListener('input', updatePasswordStrength);
    
    // Enter key handling
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT') {
                e.preventDefault();
                handleLogin(e);
            }
        }
    });
}

// Switch User Type
function switchUserType(userType) {
    // Update active tab
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${userType}"]`).classList.add('active');
    
    // Update hidden input
    userTypeInput.value = userType;
    
    // Update interface
    updateUserTypeInterface(userType);
    
    // Clear form
    clearForm();
}

// Update User Type Interface
function updateUserTypeInterface(userType) {
    const loginTitle = document.getElementById('loginTitle');
    const loginSubtitle = document.getElementById('loginSubtitle');
    const usernameLabel = document.getElementById('usernameLabel');
    const usernameHint = document.getElementById('usernameHint');
    
    switch(userType) {
        case 'student':
            loginTitle.textContent = 'تسجيل دخول الطلاب';
            loginSubtitle.textContent = 'يرجى إدخال الرقم الجامعي وكلمة المرور';
            usernameLabel.textContent = 'الرقم الجامعي';
            usernameHint.textContent = 'للطلاب: الرقم الجامعي ( )';
            usernameInput.placeholder = 'أدخل الرقم الجامعي';
            break;
        case 'faculty':
            loginTitle.textContent = 'تسجيل دخول أعضاء هيئة التدريس';
            loginSubtitle.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
            usernameLabel.textContent = 'اسم المستخدم';
            usernameInput.placeholder = 'أدخل اسم المستخدم';
            break;
        case 'employee':
            loginTitle.textContent = 'تسجيل دخول الموظفين';
            loginSubtitle.textContent = 'يرجى إدخال اسم المستخدم وكلمة المرور';
            usernameLabel.textContent = 'اسم المستخدم';
            usernameInput.placeholder = 'أدخل اسم المستخدم';
            break;
    }
}

// Add Input Animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

// Generate CAPTCHA
function generateCaptcha() {
    const operations = [
        { question: '7 + 10 × 9', answer: 97 },
        { question: '15 - 3 × 2', answer: 9 },
        { question: '8 × 5 + 12', answer: 52 },
        { question: '20 ÷ 4 + 6', answer: 11 },
        { question: '3 × 7 - 5', answer: 16 },
        { question: '25 - 8 + 3', answer: 20 },
        { question: '6 × 4 ÷ 2', answer: 12 },
        { question: '18 + 7 - 10', answer: 15 }
    ];
    
    const randomOperation = operations[Math.floor(Math.random() * operations.length)];
    currentCaptcha = randomOperation;
    
    document.getElementById('captchaText').textContent = `${randomOperation.question} = ?`;
    captchaInput.value = '';
    captchaInput.classList.remove('valid', 'invalid');
}

// Refresh CAPTCHA
function refreshCaptcha() {
    const refreshBtn = document.querySelector('.captcha-refresh');
    refreshBtn.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        generateCaptcha();
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 300);
}

// Validate Username
function validateUsername() {
    const username = usernameInput.value.trim();
    const userType = userTypeInput.value;
    
    if (!username) {
        setInputState(usernameInput, 'normal');
        return false;
    }
    
    let isValid = false;
    
    switch(userType) {
        case 'student':
            isValid = /^\d{9}$/.test(username); // 7 digits for student ID
            break;
        case 'faculty':
        case 'employee':
            isValid = /^[a-zA-Z][a-zA-Z0-9._]{2,19}$/.test(username); // Username format
            break;
    }
    
    setInputState(usernameInput, isValid ? 'valid' : 'invalid');
    return isValid;
}

// Validate Password
function validatePassword() {
    const password = passwordInput.value;
    
    if (!password) {
        setInputState(passwordInput, 'normal');
        return false;
    }
    
    const isValid = password.length >= 6;
    setInputState(passwordInput, isValid ? 'valid' : 'invalid');
    return isValid;
}

// Validate CAPTCHA
function validateCaptcha() {
    const answer = parseInt(captchaInput.value);
    
    if (!captchaInput.value) {
        setInputState(captchaInput, 'normal');
        return false;
    }
    
    const isValid = answer === currentCaptcha.answer;
    setInputState(captchaInput, isValid ? 'valid' : 'invalid');
    return isValid;
}

// Set Input State
function setInputState(input, state) {
    input.classList.remove('valid', 'invalid');
    
    if (state === 'valid') {
        input.classList.add('valid');
    } else if (state === 'invalid') {
        input.classList.add('invalid');
    }
}

// Update Password Strength
function updatePasswordStrength() {
    const password = passwordInput.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!password) {
        passwordStrength.classList.remove('show');
        return;
    }
    
    passwordStrength.classList.add('show');
    
    let strength = 0;
    let strengthLabel = '';
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
    
    // Set strength class and label
    strengthBar.classList.remove('weak', 'medium', 'strong');
    
    if (strength < 40) {
        strengthBar.classList.add('weak');
        strengthLabel = 'ضعيفة';
    } else if (strength < 70) {
        strengthBar.classList.add('medium');
        strengthLabel = 'متوسطة';
    } else {
        strengthBar.classList.add('strong');
        strengthLabel = 'قوية';
    }
    
    strengthText.textContent = `قوة كلمة المرور: ${strengthLabel}`;
}

// Toggle Password Visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    // Check if already loading
    if (loginBtn.classList.contains('loading')) {
        return;
    }
    
    // Validate all fields
    const isUsernameValid = validateUsername();
    const isPasswordValid = validatePassword();
    const isCaptchaValid = validateCaptcha();
    
    if (!isUsernameValid || !isPasswordValid || !isCaptchaValid) {
        showLoginError('يرجى التأكد من صحة جميع البيانات المدخلة');
        return;
    }
    
    // Check login attempts
    if (loginAttempts >= maxAttempts) {
        showLoginError('تم تجاوز الحد الأقصى لمحاولات تسجيل الدخول. يرجى المحاولة لاحقاً');
        return;
    }
    
    // Start loading
    setLoadingState(true);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check credentials
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const userType = userTypeInput.value;
        
        const user = authenticateUser(username, password, userType);
        
        if (user) {
            // Save user session
            saveUserSession(user);
            
            // Show success
            showLoginSuccess(user);
            
            // Reset attempts
            loginAttempts = 0;
            
        } else {
            loginAttempts++;
            showLoginError(`بيانات تسجيل الدخول غير صحيحة. المحاولات المتبقية: ${maxAttempts - loginAttempts}`);
            
            // Refresh CAPTCHA after failed attempt
            refreshCaptcha();
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('حدث خطأ في النظام. يرجى المحاولة لاحقاً');
    } finally {
        setLoadingState(false);
    }
}

// Authenticate User
function authenticateUser(username, password, userType) {
    const users = demoUsers[userType];
    
    if (users && users[username] && users[username].password === password) {
        return {
            username,
            name: users[username].name,
            type: users[username].type,
            loginTime: new Date().toISOString()
        };
    }
    
    return null;
}

// Set Loading State
function setLoadingState(loading) {
    if (loading) {
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
    } else {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
}

// Show Login Error
function showLoginError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    // Add error styles
    if (!document.querySelector('#error-styles')) {
        const styles = document.createElement('style');
        styles.id = 'error-styles';
        styles.textContent = `
            .login-error {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(220, 53, 69, 0.1);
                color: #dc3545;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border: 1px solid rgba(220, 53, 69, 0.2);
                animation: errorSlideIn 0.3s ease;
            }
            
            @keyframes errorSlideIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Insert before login button
    loginBtn.parentNode.insertBefore(errorDiv, loginBtn);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show Login Success
function showLoginSuccess(user) {
    // Update success modal content
    const successContent = successModal.querySelector('.success-content');
    successContent.querySelector('h3').textContent = 'تم تسجيل الدخول بنجاح';
    successContent.querySelector('p').textContent = `مرحباً بك ${user.name}`;
    
    // Show success modal
    successModal.classList.add('show');
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
        redirectToDashboard();
    }, 3000);
}

// Save User Session
function saveUserSession(user) {
    localStorage.setItem('kau_user', JSON.stringify(user));
    localStorage.setItem('kau_login_time', new Date().toISOString());
    
    // Save remember me preference
    const rememberMe = document.getElementById('rememberMe').checked;
    if (rememberMe) {
        localStorage.setItem('kau_remember_credentials', JSON.stringify({
            username: usernameInput.value,
            userType: userTypeInput.value
        }));
    }
}

// Check Saved Credentials
function checkSavedCredentials() {
    const savedCredentials = localStorage.getItem('kau_remember_credentials');
    
    if (savedCredentials) {
        try {
            const credentials = JSON.parse(savedCredentials);
            usernameInput.value = credentials.username;
            switchUserType(credentials.userType);
            document.getElementById('rememberMe').checked = true;
            
            // Focus on password field
            passwordInput.focus();
        } catch (error) {
            console.error('Error loading saved credentials:', error);
        }
    }
}

// Check URL Parameters
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get('type');
    const returnUrl = urlParams.get('return');
    
    if (userType && ['student', 'faculty', 'employee'].includes(userType)) {
        switchUserType(userType);
    }
    
    if (returnUrl) {
        sessionStorage.setItem('kau_return_url', returnUrl);
    }
}

// Clear Form
function clearForm() {
    usernameInput.value = '';
    passwordInput.value = '';
    captchaInput.value = '';
    
    // Reset input states
    setInputState(usernameInput, 'normal');
    setInputState(passwordInput, 'normal');
    setInputState(captchaInput, 'normal');
    
    // Hide password strength
    passwordStrength.classList.remove('show');
    
    // Remove error messages
    const errorDiv = document.querySelector('.login-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    
    // Generate new CAPTCHA
    generateCaptcha();
}

// Redirect to Dashboard
function redirectToDashboard() {
    const returnUrl = sessionStorage.getItem('kau_return_url');
    
    if (returnUrl) {
        sessionStorage.removeItem('kau_return_url');
        window.location.href = returnUrl;
    } else {
        window.location.href = 'academic.html';
    }
}

// Alternative Login Methods
function loginWithMicrosoft() {
    showNotification('تسجيل الدخول عبر Microsoft غير متاح حالياً', 'info');
}

function loginWithGoogle() {
    showNotification('تسجيل الدخول عبر Google غير متاح حالياً', 'info');
}

// Show Forgot Password
function showForgotPassword() {
    const modal = `
        <div class="forgot-password-content">
            <h4>استعادة كلمة المرور</h4>
            <p>يرجى إدخال الرقم الجامعي أو اسم المستخدم لإرسال رابط استعادة كلمة المرور</p>
            <div class="form-group">
                <label>الرقم الجامعي / اسم المستخدم</label>
                <input type="text" id="resetUsername" placeholder="أدخل الرقم الجامعي أو اسم المستخدم">
            </div>
            <div class="form-group">
                <label>البريد الإلكتروني</label>
                <input type="email" id="resetEmail" placeholder="أدخل البريد الإلكتروني">
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="sendResetLink()">إرسال رابط الاستعادة</button>
                <button class="btn btn-secondary" onclick="closeModal(this)">إلغاء</button>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('استعادة كلمة المرور', modal);
    }
}

// Send Reset Link
function sendResetLink() {
    const username = document.getElementById('resetUsername').value;
    const email = document.getElementById('resetEmail').value;
    
    if (!username || !email) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'warning');
        return;
    }
    
    // Simulate sending reset link
    showNotification('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني', 'success');
    
    // Close modal
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Show Notification (fallback if main.js not loaded)
function showNotification(message, type = 'info') {
    if (window.KAUPortal && window.KAUPortal.showNotification) {
        window.KAUPortal.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Export functions for global use
window.LoginPage = {
    togglePassword,
    refreshCaptcha,
    showForgotPassword,
    sendResetLink,
    loginWithMicrosoft,
    loginWithGoogle,
    redirectToDashboard
};

