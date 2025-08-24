// Financial Page JavaScript

// Global Variables
let countdownTimer;
let uploadedFiles = [];
let paymentDeadline = new Date();

// Set deadline to 24 hours from now
paymentDeadline.setHours(paymentDeadline.getHours() + 24);

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('receiptFile');
const uploadedFilesContainer = document.getElementById('uploadedFiles');
const uploadBtn = document.getElementById('uploadBtn');

// Initialize Financial Page
document.addEventListener('DOMContentLoaded', function() {
    initializeFinancialPage();
    setupEventListeners();
    startCountdownTimer();
    setupFileUpload();
});

// Initialize Financial Page
function initializeFinancialPage() {
    console.log('Financial page initialized');
    
    // Add scroll animations
    addScrollAnimations();
    
    // Initialize copy functionality
    initializeCopyButtons();
    
    // Load saved data
    loadSavedData();
}

// Setup Event Listeners
function setupEventListeners() {
    // File upload events
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // Copy button events
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            copyToClipboard(targetId);
        });
    });
    
    // View all courses button
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', toggleCourseList);
    }
}

// Start Countdown Timer
function startCountdownTimer() {
    countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
}

// Update Countdown
function updateCountdown() {
    const now = new Date().getTime();
    const distance = paymentDeadline.getTime() - now;
    
    if (distance < 0) {
        clearInterval(countdownTimer);
        handlePaymentExpired();
        return;
    }
    
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Update timer display
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const timeRemainingElement = document.getElementById('timeRemaining');
    
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
    if (timeRemainingElement) {
        timeRemainingElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Change color based on time remaining
    const timerElements = document.querySelectorAll('.timer-value');
    timerElements.forEach(element => {
        if (hours < 2) {
            element.style.color = '#dc3545'; // Red
        } else if (hours < 6) {
            element.style.color = '#ffc107'; // Yellow
        } else {
            element.style.color = '#28a745'; // Green
        }
    });
}

// Handle Payment Expired
function handlePaymentExpired() {
    const alertSection = document.querySelector('.alert-section');
    if (alertSection) {
        alertSection.innerHTML = `
            <div class="alert alert-danger">
                <div class="alert-icon">
                    <i class="fas fa-times-circle"></i>
                </div>
                <div class="alert-content">
                    <h4>انتهت مهلة السداد</h4>
                    <p>لقد انتهت المهلة المحددة للسداد. يرجى التواصل مع الشؤون المالية لتجديد الطلب.</p>
                </div>
                <div class="alert-actions">
                    <button class="btn btn-primary" onclick="contactFinancialServices()">
                        <i class="fas fa-phone"></i>
                        اتصل بالشؤون المالية
                    </button>
                </div>
            </div>
        `;
    }
    
    // Disable upload functionality
    if (uploadBtn) uploadBtn.disabled = true;
    if (uploadArea) uploadArea.style.opacity = '0.5';
    
    showNotification('انتهت مهلة السداد. يرجى التواصل مع الشؤون المالية.', 'error');
}

// File Upload Functions
function setupFileUpload() {
    if (!uploadArea || !fileInput) return;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragOver(e) {
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    [...files].forEach(file => {
        if (validateFile(file)) {
            addFileToList(file);
        }
    });
    updateUploadButton();
}

function validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('نوع الملف غير مدعوم. يرجى اختيار ملف JPG, PNG أو PDF', 'error');
        return false;
    }
    
    if (file.size > maxSize) {
        showNotification('حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت', 'error');
        return false;
    }
    
    // Check if file already exists
    if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
        showNotification('هذا الملف موجود بالفعل', 'warning');
        return false;
    }
    
    return true;
}

function addFileToList(file) {
    const fileId = Date.now() + Math.random();
    const fileObj = {
        id: fileId,
        file: file,
        name: file.name,
        size: file.size,
        type: file.type
    };
    
    uploadedFiles.push(fileObj);
    
    const fileElement = createFileElement(fileObj);
    uploadedFilesContainer.appendChild(fileElement);
    
    showNotification(`تم إضافة الملف: ${file.name}`, 'success');
}

function createFileElement(fileObj) {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file-item';
    fileDiv.setAttribute('data-file-id', fileObj.id);
    
    const fileIcon = getFileIcon(fileObj.type);
    const fileSize = formatFileSize(fileObj.size);
    
    fileDiv.innerHTML = `
        <div class="file-icon">
            <i class="${fileIcon}"></i>
        </div>
        <div class="file-info">
            <div class="file-name">${fileObj.name}</div>
            <div class="file-size">${fileSize}</div>
        </div>
        <div class="file-actions">
            <button class="file-action-btn preview" onclick="previewFile('${fileObj.id}')" title="معاينة">
                <i class="fas fa-eye"></i>
            </button>
            <button class="file-action-btn delete" onclick="removeFile('${fileObj.id}')" title="حذف">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return fileDiv;
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) {
        return 'fas fa-image';
    } else if (fileType === 'application/pdf') {
        return 'fas fa-file-pdf';
    } else {
        return 'fas fa-file';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(fileId) {
    uploadedFiles = uploadedFiles.filter(f => f.id != fileId);
    
    const fileElement = document.querySelector(`[data-file-id="${fileId}"]`);
    if (fileElement) {
        fileElement.remove();
    }
    
    updateUploadButton();
    showNotification('تم حذف الملف', 'info');
}

function previewFile(fileId) {
    const fileObj = uploadedFiles.find(f => f.id == fileId);
    if (!fileObj) return;
    
    if (fileObj.type.startsWith('image/')) {
        previewImage(fileObj.file);
    } else if (fileObj.type === 'application/pdf') {
        previewPDF(fileObj.file);
    }
}

function previewImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const modal = `
            <div class="preview-content">
                <img src="${e.target.result}" alt="معاينة الصورة" style="max-width: 100%; max-height: 70vh; object-fit: contain;">
            </div>
        `;
        
        if (window.KAUPortal && window.KAUPortal.showModal) {
            window.KAUPortal.showModal('معاينة الصورة', modal);
        }
    };
    reader.readAsDataURL(file);
}

function previewPDF(file) {
    const fileURL = URL.createObjectURL(file);
    const modal = `
        <div class="preview-content">
            <iframe src="${fileURL}" style="width: 100%; height: 70vh; border: none;"></iframe>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('معاينة PDF', modal);
    }
}

function updateUploadButton() {
    if (uploadBtn) {
        uploadBtn.disabled = uploadedFiles.length === 0;
    }
}

function clearUploads() {
    uploadedFiles = [];
    uploadedFilesContainer.innerHTML = '';
    updateUploadButton();
    showNotification('تم مسح جميع الملفات', 'info');
}

async function uploadReceipts() {
    if (uploadedFiles.length === 0) {
        showNotification('يرجى اختيار ملف واحد على الأقل', 'warning');
        return;
    }
    
    // Show loading
    uploadBtn.disabled = true;
    uploadBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        جاري الرفع...
    `;
    
    try {
        // Simulate upload process
        for (let i = 0; i < uploadedFiles.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update progress
            const progress = Math.round(((i + 1) / uploadedFiles.length) * 100);
            uploadBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                جاري الرفع... ${progress}%
            `;
        }
        
        // Success
        showNotification('تم رفع جميع الإيصالات بنجاح', 'success');
        
        // Update status
        updatePaymentStatus('uploaded');
        
        // Clear files
        clearUploads();
        
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('حدث خطأ أثناء رفع الملفات', 'error');
    } finally {
        // Reset button
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = `
            <i class="fas fa-upload"></i>
            رفع الإيصالات
        `;
    }
}

// Copy Functions
function initializeCopyButtons() {
    // Add copy functionality to all copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const text = element.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showNotification('فشل في نسخ النص', 'error');
    }
    
    document.body.removeChild(textArea);
}

function copyAllBankInfo() {
    const bankName = document.getElementById('bankName').textContent;
    const accountNumber = document.getElementById('accountNumber').textContent;
    const ibanNumber = document.getElementById('ibanNumber').textContent;
    const beneficiaryName = document.getElementById('beneficiaryName').textContent;
    
    const allInfo = `
اسم البنك: ${bankName}
رقم الحساب: ${accountNumber}
رقم الآيبان: ${ibanNumber}
اسم المستفيد: ${beneficiaryName}
المبلغ المطلوب: 3,000 ريال سعودي
    `.trim();
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(allInfo).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(allInfo);
        });
    } else {
        fallbackCopyTextToClipboard(allInfo);
    }
}

function showCopySuccess() {
    showNotification('تم نسخ البيانات بنجاح', 'success');
    
    // Visual feedback
    const copyBtns = document.querySelectorAll('.copy-btn, .copy-all-btn');
    copyBtns.forEach(btn => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#28a745';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 1000);
    });
}

// Course List Toggle
function toggleCourseList() {
    const coursesGrid = document.querySelector('.courses-grid');
    const viewAllBtn = document.querySelector('.view-all-btn');
    const btnText = viewAllBtn.querySelector('.btn-text');
    const btnIcon = viewAllBtn.querySelector('i');
    
    if (coursesGrid.classList.contains('expanded')) {
        coursesGrid.classList.remove('expanded');
        btnText.textContent = 'عرض جميع المقررات';
        btnIcon.style.transform = 'rotate(0deg)';
    } else {
        coursesGrid.classList.add('expanded');
        btnText.textContent = 'إخفاء المقررات';
        btnIcon.style.transform = 'rotate(180deg)';
    }
}

// Status Update
function updatePaymentStatus(status) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    switch(status) {
        case 'uploaded':
            // Mark "في انتظار السداد" as completed
            timelineItems[1].classList.remove('active');
            timelineItems[1].classList.add('completed');
            
            // Mark "مراجعة الإيصال" as active
            timelineItems[2].classList.add('active');
            
            // Update status badges
            const statusBadges = document.querySelectorAll('.status-badge');
            statusBadges.forEach(badge => {
                if (badge.textContent === 'في الانتظار') {
                    badge.textContent = 'قيد المراجعة';
                    badge.className = 'status-badge processing';
                }
            });
            
            break;
        case 'approved':
            // Mark all as completed
            timelineItems.forEach(item => {
                item.classList.remove('active');
                item.classList.add('completed');
            });
            
            // Update status badges
            const approvedBadges = document.querySelectorAll('.status-badge');
            approvedBadges.forEach(badge => {
                badge.textContent = 'مكتمل';
                badge.className = 'status-badge completed';
            });
            
            break;
    }
}

// Scroll Animations
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .summary-card, .bank-card, .upload-card, .status-card, .help-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease forwards';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
    
    // Add slideUp animation if not exists
    if (!document.querySelector('#slideUp-animation')) {
        const style = document.createElement('style');
        style.id = 'slideUp-animation';
        style.textContent = `
            @keyframes slideUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Save and Load Data
function saveData() {
    const data = {
        uploadedFiles: uploadedFiles.map(f => ({
            id: f.id,
            name: f.name,
            size: f.size,
            type: f.type
        })),
        paymentDeadline: paymentDeadline.toISOString(),
        lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('kau_financial_data', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('kau_financial_data');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        // Restore deadline if within reasonable time
        const savedDeadline = new Date(data.paymentDeadline);
        const now = new Date();
        
        if (savedDeadline > now && (savedDeadline - now) < 24 * 60 * 60 * 1000) {
            paymentDeadline = savedDeadline;
        }
        
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Utility Functions
function contactFinancialServices() {
    const modal = `
        <div class="contact-content">
            <h4>التواصل مع الشؤون المالية</h4>
            <p>يمكنك التواصل معنا عبر الطرق التالية:</p>
            <div class="contact-methods">
                <div class="contact-method">
                    <i class="fas fa-phone"></i>
                    <div>
                        <strong>الهاتف</strong>
                        <p>800-11-69528</p>
                    </div>
                </div>
                <div class="contact-method">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <strong>البريد الإلكتروني</strong>
                        <p>financial@kau.edu.sa</p>
                    </div>
                </div>
                <div class="contact-method">
                    <i class="fas fa-clock"></i>
                    <div>
                        <strong>ساعات العمل</strong>
                        <p>الأحد - الخميس: 8:00 ص - 4:00 م</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('التواصل مع الشؤون المالية', modal);
    }
}

function showNotification(message, type = 'info') {
    if (window.KAUPortal && window.KAUPortal.showNotification) {
        window.KAUPortal.showNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Auto-save data periodically
setInterval(saveData, 30000); // Save every 30 seconds

// Save data before page unload
window.addEventListener('beforeunload', saveData);

// Export functions for global use
window.FinancialPage = {
    copyToClipboard,
    copyAllBankInfo,
    toggleCourseList,
    uploadReceipts,
    clearUploads,
    removeFile,
    previewFile,
    contactFinancialServices
};

