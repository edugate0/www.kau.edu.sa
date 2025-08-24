// Grades Page JavaScript

// Global Variables
let studentData = {
    id: '2420383',
    name: 'أثير بن أحمد بن علي هادي',
    college: 'كلية الطب',
    level: ' السنه الاولى',
    gpa: null,
    totalCredits: 0,
    completedCourses: 0,
    registrationStatus: 'pending'
};

let upcomingCourses = [
    {
        code: 'MATH 101',
        name: 'التفاضل والتكامل 1',
        credits: 3,
        status: 'planned'
    },
    {
        code: 'PHYS 102',
        name: 'الفيزياء العامة',
        credits: 4,
        status: 'planned'
    },
    {
        code: 'CHEM 103',
        name: 'الكيمياء العضوية',
        credits: 4,
        status: 'planned'
    },
    {
        code: 'CS 101',
        name: 'مقدمة في علوم الحاسب',
        credits: 3,
        status: 'planned'
    },
    {
        code: 'ARAB 103',
        name: 'مهارات اللغة العربية',
        credits: 3,
        status: 'planned'
    },
    {
        code: 'ISLM 103',
        name: 'الثقافة الإسلامية',
        credits: 2,
        status: 'planned'
    }
];

// Initialize Grades Page
document.addEventListener('DOMContentLoaded', function() {
    initializeGradesPage();
    setupEventListeners();
    loadStudentData();
    updatePageContent();
});

// Initialize Grades Page
function initializeGradesPage() {
    console.log('Grades page initialized');
    
    // Add scroll animations
    addScrollAnimations();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Load saved preferences
    loadUserPreferences();
}

// Setup Event Listeners
function setupEventListeners() {
    // Semester selector
    const semesterSelect = document.getElementById('semesterSelect');
    if (semesterSelect) {
        semesterSelect.addEventListener('change', handleSemesterChange);
    }
    
    // Notification interactions
    setupNotificationInteractions();
    
    // Resource item interactions
    setupResourceInteractions();
}

// Load Student Data
function loadStudentData() {
    // In a real application, this would fetch data from an API
    // For now, we'll use the mock data defined above
    
    updateStudentInfo();
    updateProgressStats();
    updateUpcomingCourses();
}

// Update Page Content
function updatePageContent() {
    updateRegistrationStatus();
    updateAcademicCalendar();
    updateNotifications();
}

// Update Student Info
function updateStudentInfo() {
    const studentDetails = document.querySelector('.student-details');
    if (studentDetails) {
        studentDetails.innerHTML = `
            <h3>${studentData.name}</h3>
            <p>الرقم الجامعي: ${studentData.id}</p>
            <p>${studentData.college} - ${studentData.level}</p>
        `;
    }
}

// Update Progress Stats
function updateProgressStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    if (statValues.length >= 4) {
        statValues[0].textContent = studentData.completedCourses;
        statValues[1].textContent = studentData.totalCredits;
        statValues[2].textContent = studentData.gpa || '-';
        statValues[3].textContent = getGradeDescription(studentData.gpa);
    }
}

// Update Upcoming Courses
function updateUpcomingCourses() {
    const coursesPreview = document.querySelector('.courses-preview');
    if (!coursesPreview) return;
    
    coursesPreview.innerHTML = '';
    
    upcomingCourses.slice(0, 4).forEach(course => {
        const courseElement = createCoursePreviewElement(course);
        coursesPreview.appendChild(courseElement);
    });
}

// Create Course Preview Element
function createCoursePreviewElement(course) {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-preview-item';
    
    const statusClass = getStatusClass(course.status);
    const statusText = getStatusText(course.status);
    
    courseDiv.innerHTML = `
        <div class="course-code">${course.code}</div>
        <div class="course-info">
            <h4>${course.name}</h4>
            <p>${course.credits} ساعات معتمدة</p>
        </div>
        <div class="course-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
    `;
    
    return courseDiv;
}

// Get Status Class
function getStatusClass(status) {
    switch(status) {
        case 'completed': return 'completed';
        case 'in-progress': return 'in-progress';
        case 'planned': return 'upcoming';
        default: return 'upcoming';
    }
}

// Get Status Text
function getStatusText(status) {
    switch(status) {
        case 'completed': return 'مكتمل';
        case 'in-progress': return 'جاري';
        case 'planned': return 'مخطط';
        default: return 'مخطط';
    }
}

// Get Grade Description
function getGradeDescription(gpa) {
    if (!gpa) return '-';
    
    if (gpa >= 4.75) return 'ممتاز مرتفع';
    if (gpa >= 4.50) return 'ممتاز';
    if (gpa >= 4.00) return 'جيد جداً مرتفع';
    if (gpa >= 3.50) return 'جيد جداً';
    if (gpa >= 3.00) return 'جيد مرتفع';
    if (gpa >= 2.50) return 'جيد';
    if (gpa >= 2.00) return 'مقبول مرتفع';
    if (gpa >= 1.50) return 'مقبول';
    return 'راسب';
}

// Update Registration Status
function updateRegistrationStatus() {
    const statusAlert = document.querySelector('.status-alert .alert-content');
    if (!statusAlert) return;
    
    switch(studentData.registrationStatus) {
        case 'pending':
            statusAlert.innerHTML = `
                <h4>حالة النتائج الحالية</h4>
                <p>لا توجد نتائج متاحة حالياً. سيتم عرض النتائج بعد إتمام عملية التسجيل والبدء في الدراسة.</p>
            `;
            break;
        case 'registered':
            statusAlert.innerHTML = `
                <h4>تم التسجيل بنجاح</h4>
                <p>تم التسجيل في المقررات بنجاح. ستظهر النتائج بعد بداية الفصل الدراسي.</p>
            `;
            break;
        case 'active':
            statusAlert.innerHTML = `
                <h4>الفصل الدراسي نشط</h4>
                <p>يمكنك الآن متابعة درجاتك ونتائجك الأكاديمية.</p>
            `;
            break;
    }
}

// Handle Semester Change
function handleSemesterChange(event) {
    const selectedSemester = event.target.value;
    console.log('Selected semester:', selectedSemester);
    
    // In a real application, this would fetch semester-specific data
    showNotification('سيتم تحديث البيانات عند توفر النتائج', 'info');
}

// Check Registration Status
function checkRegistrationStatus() {
    showLoadingModal('جاري التحقق من حالة التسجيل...');
    
    // Simulate API call
    setTimeout(() => {
        hideLoadingModal();
        
        const modal = `
            <div class="registration-status-content">
                <div class="status-header">
                    <div class="status-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>حالة التسجيل</h3>
                </div>
                <div class="status-details">
                    <div class="status-item">
                        <span class="status-label">حالة القبول:</span>
                        <span class="status-value accepted">مقبول</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">حالة الرسوم:</span>
                        <span class="status-value pending">في الانتظار</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">حالة التسجيل:</span>
                        <span class="status-value pending">لم يتم التسجيل</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">موعد بداية التسجيل:</span>
                        <span class="status-value">15 أغسطس 2025</span>
                    </div>
                </div>
                <div class="status-actions">
                    <button class="btn btn-primary" onclick="goToFinancialServices()">
                        <i class="fas fa-credit-card"></i>
                        إتمام الرسوم المالية
                    </button>
                </div>
            </div>
        `;
        
        if (window.KAUPortal && window.KAUPortal.showModal) {
            window.KAUPortal.showModal('حالة التسجيل', modal);
        }
    }, 2000);
}

// View Full Schedule
function viewFullSchedule() {
    const modal = `
        <div class="schedule-content">
            <div class="schedule-header">
                <h3>الجدول الدراسي المخطط</h3>
                <p>الفصل الدراسي الأول 2025-2026</p>
            </div>
            <div class="schedule-table">
                <div class="schedule-row schedule-header">
                    <div class="schedule-cell">رمز المقرر</div>
                    <div class="schedule-cell">اسم المقرر</div>
                    <div class="schedule-cell">الساعات</div>
                    <div class="schedule-cell">الوقت</div>
                    <div class="schedule-cell">القاعة</div>
                </div>
                ${upcomingCourses.map(course => `
                    <div class="schedule-row">
                        <div class="schedule-cell">${course.code}</div>
                        <div class="schedule-cell">${course.name}</div>
                        <div class="schedule-cell">${course.credits}</div>
                        <div class="schedule-cell">سيتم تحديده</div>
                        <div class="schedule-cell">سيتم تحديدها</div>
                    </div>
                `).join('')}
            </div>
            <div class="schedule-summary">
                <div class="summary-item">
                    <span class="summary-label">إجمالي المقررات:</span>
                    <span class="summary-value">${upcomingCourses.length} مقرر</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">إجمالي الساعات:</span>
                    <span class="summary-value">${upcomingCourses.reduce((total, course) => total + course.credits, 0)} ساعة</span>
                </div>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('الجدول الدراسي', modal);
    }
}

// Register for Courses
function registerForCourses() {
    if (studentData.registrationStatus === 'pending') {
        showNotification('يجب إتمام الرسوم المالية أولاً قبل التسجيل', 'warning');
        return;
    }
    
    const modal = `
        <div class="registration-content">
            <div class="registration-header">
                <div class="registration-icon">
                    <i class="fas fa-calendar-plus"></i>
                </div>
                <h3>التسجيل في المقررات</h3>
                <p>اختر المقررات التي تريد التسجيل فيها</p>
            </div>
            <div class="registration-courses">
                ${upcomingCourses.map((course, index) => `
                    <div class="registration-course-item">
                        <div class="course-checkbox">
                            <input type="checkbox" id="course-${index}" checked>
                            <label for="course-${index}"></label>
                        </div>
                        <div class="course-details">
                            <div class="course-code">${course.code}</div>
                            <div class="course-info">
                                <h4>${course.name}</h4>
                                <p>${course.credits} ساعات معتمدة</p>
                            </div>
                        </div>
                        <div class="course-availability">
                            <span class="availability-badge available">متاح</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="registration-summary">
                <div class="summary-info">
                    <span>المقررات المختارة: <strong id="selectedCount">${upcomingCourses.length}</strong></span>
                    <span>إجمالي الساعات: <strong id="totalCredits">${upcomingCourses.reduce((total, course) => total + course.credits, 0)}</strong></span>
                </div>
            </div>
            <div class="registration-actions">
                <button class="btn btn-primary" onclick="confirmRegistration()">
                    <i class="fas fa-check"></i>
                    تأكيد التسجيل
                </button>
                <button class="btn btn-secondary" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                    إلغاء
                </button>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('التسجيل في المقررات', modal);
    }
}

// Show Grade Calculator
function showGradeCalculator() {
    const modal = `
        <div class="calculator-content">
            <div class="calculator-header">
                <div class="calculator-icon">
                    <i class="fas fa-calculator"></i>
                </div>
                <h3>حاسبة المعدل التراكمي</h3>
                <p>احسب معدلك التراكمي المتوقع</p>
            </div>
            <div class="calculator-form">
                <div class="calculator-note">
                    <i class="fas fa-info-circle"></i>
                    <p>لا توجد درجات حالية لحساب المعدل. سيتم تفعيل الحاسبة بعد ظهور النتائج.</p>
                </div>
                <div class="calculator-preview">
                    <h4>مثال توضيحي:</h4>
                    <div class="example-courses">
                        <div class="example-course">
                            <span class="course-name">الرياضيات</span>
                            <span class="course-grade">A</span>
                            <span class="course-points">4.75</span>
                            <span class="course-credits">3 ساعات</span>
                        </div>
                        <div class="example-course">
                            <span class="course-name">الفيزياء</span>
                            <span class="course-grade">B+</span>
                            <span class="course-points">4.50</span>
                            <span class="course-credits">4 ساعات</span>
                        </div>
                        <div class="example-course">
                            <span class="course-name">الكيمياء</span>
                            <span class="course-grade">A-</span>
                            <span class="course-points">4.25</span>
                            <span class="course-credits">4 ساعات</span>
                        </div>
                    </div>
                    <div class="example-result">
                        <span class="result-label">المعدل المتوقع:</span>
                        <span class="result-value">4.47</span>
                        <span class="result-grade">ممتاز</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('حاسبة المعدل', modal);
    }
}

// Show Study Plan
function showStudyPlan() {
    const modal = `
        <div class="study-plan-content">
            <div class="study-plan-header">
                <div class="study-plan-icon">
                    <i class="fas fa-map"></i>
                </div>
                <h3>الخطة الدراسية</h3>
                <p>كلية الطب - السنة التحضيرية</p>
            </div>
            <div class="study-plan-details">
                <div class="plan-overview">
                    <div class="plan-stat">
                        <span class="stat-value">6</span>
                        <span class="stat-label">فصول دراسية</span>
                    </div>
                    <div class="plan-stat">
                        <span class="stat-value">180</span>
                        <span class="stat-label">ساعة معتمدة</span>
                    </div>
                    <div class="plan-stat">
                        <span class="stat-value">45</span>
                        <span class="stat-label">مقرر دراسي</span>
                    </div>
                </div>
                <div class="plan-semesters">
                    <div class="semester-item">
                        <h4>السنة التحضيرية - الفصل الأول</h4>
                        <div class="semester-courses">
                            ${upcomingCourses.slice(0, 3).map(course => `
                                <span class="course-tag">${course.code} - ${course.name}</span>
                            `).join('')}
                        </div>
                        <span class="semester-credits">14 ساعة معتمدة</span>
                    </div>
                    <div class="semester-item">
                        <h4>السنة التحضيرية - الفصل الثاني</h4>
                        <div class="semester-courses">
                            ${upcomingCourses.slice(3).map(course => `
                                <span class="course-tag">${course.code} - ${course.name}</span>
                            `).join('')}
                        </div>
                        <span class="semester-credits">12 ساعة معتمدة</span>
                    </div>
                </div>
                <div class="plan-actions">
                    <button class="btn btn-primary" onclick="downloadStudyPlan()">
                        <i class="fas fa-download"></i>
                        تحميل الخطة الكاملة
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('الخطة الدراسية', modal);
    }
}

// Show Academic Advising
function showAcademicAdvising() {
    const modal = `
        <div class="advising-content">
            <div class="advising-header">
                <div class="advising-icon">
                    <i class="fas fa-user-tie"></i>
                </div>
                <h3>الإرشاد الأكاديمي</h3>
                <p>التواصل مع المرشد الأكاديمي</p>
            </div>
            <div class="advisor-info">
                <div class="advisor-card">
                    <div class="advisor-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="advisor-details">
                        <h4>د. محمد أحمد السعيد</h4>
                        <p>مرشد أكاديمي - كلية الطب</p>
                        <div class="advisor-contact">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>m.alsaeed@kau.edu.sa</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <span>+966 12 640 0000 تحويلة 12345</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>مبنى كلية الطب - الدور الثالث - مكتب 301</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="office-hours">
                    <h4>ساعات المكتب</h4>
                    <div class="hours-list">
                        <div class="hour-item">
                            <span class="day">الأحد - الثلاثاء</span>
                            <span class="time">10:00 ص - 12:00 م</span>
                        </div>
                        <div class="hour-item">
                            <span class="day">الأربعاء - الخميس</span>
                            <span class="time">2:00 م - 4:00 م</span>
                        </div>
                    </div>
                </div>
                <div class="advising-actions">
                    <button class="btn btn-primary" onclick="bookAppointment()">
                        <i class="fas fa-calendar-plus"></i>
                        حجز موعد
                    </button>
                    <button class="btn btn-secondary" onclick="sendMessage()">
                        <i class="fas fa-envelope"></i>
                        إرسال رسالة
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('الإرشاد الأكاديمي', modal);
    }
}

// Show Transcript Request
function showTranscriptRequest() {
    const modal = `
        <div class="transcript-content">
            <div class="transcript-header">
                <div class="transcript-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3>طلب كشف الدرجات</h3>
                <p>طلب كشف درجات رسمي</p>
            </div>
            <div class="transcript-form">
                <div class="form-note">
                    <i class="fas fa-info-circle"></i>
                    <p>لا يمكن إصدار كشف درجات حالياً لعدم وجود نتائج مسجلة. سيتم تفعيل هذه الخدمة بعد ظهور النتائج.</p>
                </div>
                <div class="transcript-types">
                    <h4>أنواع كشوف الدرجات المتاحة:</h4>
                    <div class="type-list">
                        <div class="type-item disabled">
                            <div class="type-icon">
                                <i class="fas fa-file-pdf"></i>
                            </div>
                            <div class="type-info">
                                <h5>كشف درجات رسمي</h5>
                                <p>للاستخدام الرسمي والتقديم للجهات الخارجية</p>
                            </div>
                            <div class="type-status">
                                <span class="status-badge disabled">غير متاح</span>
                            </div>
                        </div>
                        <div class="type-item disabled">
                            <div class="type-icon">
                                <i class="fas fa-file"></i>
                            </div>
                            <div class="type-info">
                                <h5>كشف درجات غير رسمي</h5>
                                <p>للاستخدام الشخصي والمراجعة</p>
                            </div>
                            <div class="type-status">
                                <span class="status-badge disabled">غير متاح</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transcript-info">
                    <h4>معلومات مهمة:</h4>
                    <ul>
                        <li>سيتم إصدار كشف الدرجات بعد ظهور النتائج الرسمية</li>
                        <li>كشف الدرجات الرسمي يتطلب رسوم إدارية</li>
                        <li>يمكن طلب كشف الدرجات إلكترونياً أو استلامه من الجامعة</li>
                        <li>مدة الإصدار من 3-5 أيام عمل</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    if (window.KAUPortal && window.KAUPortal.showModal) {
        window.KAUPortal.showModal('طلب كشف الدرجات', modal);
    }
}

// Update Academic Calendar
function updateAcademicCalendar() {
    // This would typically fetch real calendar data
    console.log('Academic calendar updated');
}

// Update Notifications
function updateNotifications() {
    // This would typically fetch real notification data
    console.log('Notifications updated');
}

// Setup Notification Interactions
function setupNotificationInteractions() {
    const notificationItems = document.querySelectorAll('.notification-item');
    
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });
}

// Setup Resource Interactions
function setupResourceInteractions() {
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Initialize Interactive Elements
function initializeInteractiveElements() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.overview-card, .upcoming-card, .grade-scale-card, .calendar-card, .resources-card, .notifications-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Add Scroll Animations
function addScrollAnimations() {
    const animatedElements = document.querySelectorAll('.overview-card, .upcoming-card, .grade-scale-card, .calendar-card, .resources-card, .notifications-card');
    
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

// Utility Functions
function goToFinancialServices() {
    window.location.href = 'financial.html';
}

function confirmRegistration() {
    showLoadingModal('جاري تأكيد التسجيل...');
    
    setTimeout(() => {
        hideLoadingModal();
        showNotification('تم تأكيد التسجيل بنجاح! ستتلقى رسالة تأكيد قريباً.', 'success');
        
        // Update student status
        studentData.registrationStatus = 'registered';
        updateRegistrationStatus();
        
        if (window.KAUPortal && window.KAUPortal.closeModal) {
            window.KAUPortal.closeModal();
        }
    }, 2000);
}

function bookAppointment() {
    showNotification('سيتم تحويلك إلى نظام حجز المواعيد', 'info');
}

function sendMessage() {
    showNotification('سيتم فتح نافذة إرسال رسالة جديدة', 'info');
}

function downloadStudyPlan() {
    showNotification('سيتم تحميل الخطة الدراسية الكاملة', 'info');
}

function closeModal() {
    if (window.KAUPortal && window.KAUPortal.closeModal) {
        window.KAUPortal.closeModal();
    }
}

function showLoadingModal(message) {
    if (window.KAUPortal && window.KAUPortal.showLoadingModal) {
        window.KAUPortal.showLoadingModal(message);
    }
}

function hideLoadingModal() {
    if (window.KAUPortal && window.KAUPortal.hideLoadingModal) {
        window.KAUPortal.hideLoadingModal();
    }
}

function showNotification(message, type = 'info') {
    if (window.KAUPortal && window.KAUPortal.showNotification) {
        window.KAUPortal.showNotification(message, type);
    } else {
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Load User Preferences
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem('kau_grades_preferences');
    if (savedPreferences) {
        try {
            const preferences = JSON.parse(savedPreferences);
            // Apply saved preferences
            console.log('Loaded user preferences:', preferences);
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }
}

// Save User Preferences
function saveUserPreferences() {
    const preferences = {
        lastVisited: new Date().toISOString(),
        // Add other preferences as needed
    };
    
    localStorage.setItem('kau_grades_preferences', JSON.stringify(preferences));
}

// Auto-save preferences periodically
setInterval(saveUserPreferences, 60000); // Save every minute

// Save preferences before page unload
window.addEventListener('beforeunload', saveUserPreferences);

// Export functions for global use
window.GradesPage = {
    checkRegistrationStatus,
    viewFullSchedule,
    registerForCourses,
    showGradeCalculator,
    showStudyPlan,
    showAcademicAdvising,
    showTranscriptRequest,
    goToFinancialServices
};

