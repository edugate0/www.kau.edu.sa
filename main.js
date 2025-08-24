// Main JavaScript for KAU Academic Portal

// Global Variables
let currentUser = null;
let notifications = [];
let isLoading = false;

// DOM Elements
const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const loadingOverlay = document.getElementById('loadingOverlay');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    animateCounters();
    setupScrollAnimations();
    loadNotifications();
    checkUserSession();
});

// Initialize Application
function initializeApp() {
    console.log('KAU Academic Portal initialized');
    
    // Set up smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Set up header scroll effect
    window.addEventListener('scroll', handleHeaderScroll);
    
    // Set up service category tabs
    setupServiceTabs();
}

// Setup Event Listeners
function setupEventListeners() {
    // User menu toggle
    if (userBtn) {
        userBtn.addEventListener('click', toggleUserDropdown);
    }
    
    // Notification panel toggle
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotifications);
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            closeUserDropdown();
        }
        if (!e.target.closest('.notification-btn') && !e.target.closest('.notification-panel')) {
            closeNotifications();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Header Scroll Effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#ffffff';
        header.style.backdropFilter = 'none';
    }
}

// Service Category Tabs
function setupServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(tab => tab.classList.remove('active'));
            categoryContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(category);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// User Dropdown Functions
function toggleUserDropdown() {
    userDropdown.classList.toggle('show');
}

function closeUserDropdown() {
    userDropdown.classList.remove('show');
}

// Notification Functions
function toggleNotifications() {
    notificationPanel.classList.toggle('show');
    markNotificationsAsRead();
}

function closeNotifications() {
    notificationPanel.classList.remove('show');
}

function loadNotifications() {
    // Simulate loading notifications
    notifications = [
        {
            id: 1,
            title: 'تحديث النظام',
            message: 'تم تحديث نظام الخدمات الأكاديمية بميزات جديدة',
            time: 'منذ ساعة',
            icon: 'fas fa-info-circle',
            unread: true
        },
        {
            id: 2,
            title: 'موعد التسجيل',
            message: 'يبدأ التسجيل للفصل الجديد غداً',
            time: 'منذ 3 ساعات',
            icon: 'fas fa-calendar',
            unread: true
        },
        {
            id: 3,
            title: 'تذكير',
            message: 'لا تنس دفع الرسوم الدراسية',
            time: 'منذ يوم',
            icon: 'fas fa-bell',
            unread: false
        }
    ];
    
    updateNotificationBadge();
}

function markNotificationsAsRead() {
    notifications.forEach(notification => {
        notification.unread = false;
    });
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    const unreadCount = notifications.filter(n => n.unread).length;
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString('ar-SA');
        }, 16);
    };
    
    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Navigation Functions
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function openQuickGuide() {
    showModal('دليل الاستخدام السريع', `
        <div class="guide-content">
            <h4>مرحباً بك في بوابة الخدمات الأكاديمية</h4>
            <p>هذا الدليل السريع سيساعدك على التنقل في البوابة:</p>
            <ul>
                <li><strong>الصفحة الرئيسية:</strong> عرض عام للخدمات والأخبار</li>
                <li><strong>خدمات الطلاب:</strong> التسجيل، الجداول، النتائج</li>
                <li><strong>خدمات أعضاء هيئة التدريس:</strong> إدارة المقررات والطلاب</li>
                <li><strong>الخدمات المالية:</strong> الرسوم والمدفوعات</li>
                <li><strong>الإشعارات:</strong> تحديثات مهمة ومواعيد</li>
            </ul>
            <p>للمساعدة الإضافية، يرجى التواصل مع الدعم التقني.</p>
        </div>
    `);
}

// Service Navigation
function openService(serviceType) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        switch(serviceType) {
            case 'student-services':
                window.location.href = 'pages/student-services.html';
                break;
            case 'faculty-services':
                window.location.href = 'pages/faculty-services.html';
                break;
            case 'employee-services':
                window.location.href = 'pages/employee-services.html';
                break;
            case 'financial-services':
                window.location.href = '#';
                break;
            default:
                showNotification('الخدمة غير متاحة حالياً', 'warning');
        }
    }, 1000);
}

function openServicePage(serviceName) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        
        switch(serviceName) {
            case 'registration':
                window.location.href = 'registration.html';
                break;
            case 'schedule':
                window.location.href = 'schedule.html';
                break;
            case 'grades':
                showNotification('خدمة النتائج قيد التطوير', 'info');
                break;
            case 'transcript':
                window.location.href = '#';
                break;
            case 'financial':
                window.location.href = '#';
                break;
            case 'documents':
                window.location.href = '#';
                break;
            case 'student_card':
                window.location.href = 'student_card.html';
                break;
            default:
                showNotification('الصفحة غير متاحة حالياً', 'warning');
        }
    }, 800);
}

// Loading Functions
function showLoading() {
    isLoading = true;
    if (loadingOverlay) {
        loadingOverlay.classList.add('show');
    }
}

function hideLoading() {
    isLoading = false;
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
    }
}

// Modal Functions
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="closeModal(this)">حسناً</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h3 {
                margin: 0;
                color: var(--primary);
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                color: #666;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
                color: var(--primary);
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #eee;
                text-align: left;
            }
            
            .guide-content ul {
                margin: 1rem 0;
                padding-right: 1.5rem;
            }
            
            .guide-content li {
                margin-bottom: 0.5rem;
                line-height: 1.6;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    setTimeout(() => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.querySelector('.modal-close'));
            }
        });
    }, 100);
}

function closeModal(button) {
    const modal = button.closest('.modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Notification Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="closeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                z-index: 10001;
                animation: slideInRight 0.3s ease;
                border-left: 4px solid;
            }
            
            .notification-success { border-left-color: #28a745; }
            .notification-warning { border-left-color: #ffc107; }
            .notification-error { border-left-color: #dc3545; }
            .notification-info { border-left-color: #17a2b8; }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success i { color: #28a745; }
            .notification-warning i { color: #ffc107; }
            .notification-error i { color: #dc3545; }
            .notification-info i { color: #17a2b8; }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #666;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .notification-close:hover {
                background: #f0f0f0;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification.querySelector('.notification-close'));
        }
    }, 5000);
}

function closeNotification(button) {
    const notification = button.closest('.notification');
    if (notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// User Session Management
function checkUserSession() {
    const savedUser = localStorage.getItem('kau_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

function updateUserInterface() {
    if (currentUser && userBtn) {
        const userSpan = userBtn.querySelector('span');
        if (userSpan) {
            userSpan.textContent = `أهلاً ${currentUser.name}`;
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('kau_user');
    showNotification('تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    // ESC key to close modals and dropdowns
    if (e.key === 'Escape') {
        closeUserDropdown();
        closeNotifications();
        
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            closeModal(modal.querySelector('.modal-close'));
        }
    }
    
    // Alt + N for notifications
    if (e.altKey && e.key === 'n') {
        e.preventDefault();
        toggleNotifications();
    }
    
    // Alt + U for user menu
    if (e.altKey && e.key === 'u') {
        e.preventDefault();
        toggleUserDropdown();
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const searchResults = document.querySelector('.search-results');
    
    if (query.length > 2) {
        // Simulate search results
        const results = [
            { title: 'التسجيل في المقررات', url: 'registration.html' },
            { title: 'الجدول الدراسي', url: 'schedule.html' },
            { title: 'الشؤون المالية', url: 'financial.html' },
            { title: 'كشف الدرجات', url: '#' }
        ].filter(item => item.title.includes(query));
        
        displaySearchResults(results);
    } else {
        hideSearchResults();
    }
}

function displaySearchResults(results) {
    // Implementation for displaying search results
    console.log('Search results:', results);
}

function hideSearchResults() {
    const searchResults = document.querySelector('.search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

// Utility Functions
function formatDate(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

function formatTime(date) {
    return new Intl.DateTimeFormat('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global use
window.KAUPortal = {
    showLoading,
    hideLoading,
    showModal,
    closeModal,
    showNotification,
    closeNotification,
    openService,
    openServicePage,
    scrollToServices,
    openQuickGuide,
    logout,
    toggleNotifications,
    closeNotifications
};

// Add CSS for fadeOut animation
const fadeOutStyles = document.createElement('style');
fadeOutStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyles);

