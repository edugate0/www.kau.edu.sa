// بيانات الطالبة المقبولة (محاكاة قاعدة البيانات)
const studentData = {
    '1137521918': {
        name: 'يقين احمد العلي',
        email: 'waddrii3033@gmail.com',
        nationalId: '1137521918',
        phone: '0569161225',
        region: '',
        major: 'الموارد البشرية',
        highSchoolGPA: '',
        aptitudeScore: '',
        status: 'مقبولة',
        degree: 'بكالوريوس',
        university: 'جامعة الملك عبدالعزيز',
        tuitionFee: 750,
        isConfirmed: false,
        isPaid: false
    }
};

// بيانات الحساب البنكي للجامعة
const bankInfo = {
    accountNumber: '11100310718902',
    iban: 'SA3410000011100310718902',
    bankName: 'البنك الأهلي'
};

// عناصر DOM
const inquiryForm = document.getElementById('inquiryForm');
const admissionResult = document.getElementById('admissionResult');

// معالج إرسال نموذج الاستعلام
inquiryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nationalId = document.getElementById('nationalId').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // التحقق من صحة البيانات
    if (!validateNationalId(nationalId)) {
        showError('رقم الهوية الوطنية غير صحيح. يجب أن يكون 10 أرقام.');
        return;
    }
    
    if (!validateEmail(email)) {
        showError('البريد الإلكتروني غير صحيح.');
        return;
    }
    
    // البحث عن الطالبة
    const student = studentData[nationalId];
    
    if (student && student.email === email) {
        displayAdmissionResult(student);
    } else {
        showError('لم يتم العثور على بيانات مطابقة. تأكد من رقم الهوية والبريد الإلكتروني.');
    }
});

// التحقق من صحة رقم الهوية الوطنية
function validateNationalId(id) {
    return /^\d{10}$/.test(id);
}

// التحقق من صحة البريد الإلكتروني
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// عرض رسالة خطأ
function showError(message) {
    admissionResult.innerHTML = `
        <div class="error-message" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 1.5rem; border-radius: 10px; text-align: center; font-weight: 600;">
            ${message}
        </div>
    `;
    admissionResult.classList.remove('hidden');
}

// عرض نتيجة القبول
function displayAdmissionResult(student) {
    const resultHTML = `
        <div class="success-message">
            🎉 تهانينا! تم قبولك في جامعة الملك عبدالعزيز
        </div>
        
        <div class="student-info">
            <h5>بيانات الطالبة</h5>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">الاسم الكامل:</span>
                    <span class="info-value">${student.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">رقم الهوية:</span>
                    <span class="info-value">${student.nationalId}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">البريد الإلكتروني:</span>
                    <span class="info-value">${student.email}</span>
                </div>
                
                <div class="info-item">
                    <span class="info-label">رقم الجوال:</span>
                    <span class="info-value">${student.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">التخصص:</span>
                    <span class="info-value">${student.major}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">الدرجة العلمية:</span>
                    <span class="info-value">${student.degree}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">الجامعة:</span>
                    <span class="info-value">${student.university}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">حالة القبول:</span>
                    <span class="info-value" style="color: #27ae60; font-weight: 600;">${student.status}</span>
                </div>
            </div>
        </div>
        
        ${!student.isConfirmed ? `
            <div class="action-buttons">
                <button class="btn-secondary" onclick="confirmAdmission('${student.nationalId}')">
                    تأكيد القبول
                </button>
            </div>
        ` : `
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 1.5rem; margin: 1rem 0; text-align: center; color: #155724; font-weight: 600;">
                ✅ تم تأكيد القبول بنجاح
            </div>
            
            ${!student.isPaid ? `
                <div class="payment-section">
                    <h6>💳 دفع الرسوم الدراسية</h6>
                    <p style="margin-bottom: 1rem; color: #856404; font-weight: 500;">
                        المبلغ المطلوب: <strong>${student.tuitionFee} ريال سعودي</strong>
                    </p>
                    
                    <div class="bank-info">
                        <h7>معلومات الحساب البنكي للجامعة:</h7>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">رقم الحساب:</span>
                                <span class="info-value">${bankInfo.accountNumber}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">رقم الآيبان:</span>
                                <span class="info-value">${bankInfo.iban}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">اسم البنك:</span>
                                <span class="info-value">${bankInfo.bankName}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="upload-section">
                        <h7 style="display: block; margin-bottom: 1rem; color: #0f4c75; font-weight: 600;">رفع إيصال السداد:</h7>
                        <div class="file-upload" onclick="document.getElementById('receiptFile').click()">
                            <input type="file" id="receiptFile" accept="image/*,.pdf" onchange="handleFileUpload(event, '${student.nationalId}')">
                            <label class="file-upload-label">
                                📎 اضغط هنا لرفع إيصال السداد
                                <br><small style="color: #666;">يُقبل ملفات الصور و PDF</small>
                            </label>
                        </div>
                        <div id="uploadStatus"></div>
                    </div>
                </div>
            ` : `
                <div style="background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 10px; padding: 1.5rem; margin: 1rem 0; text-align: center; color: #0c5460; font-weight: 600;">
                    💰 تم استلام الرسوم الدراسية بنجاح
                    <br><small>مرحباً بك في جامعة الملك عبدالعزيز!</small>
                </div>
            `}
        `}
    `;
    
    admissionResult.innerHTML = resultHTML;
    admissionResult.classList.remove('hidden');
    
    // التمرير إلى النتيجة
    admissionResult.scrollIntoView({ behavior: 'smooth' });
}

// تأكيد القبول
function confirmAdmission(nationalId) {
    const student = studentData[nationalId];
    if (student) {
        student.isConfirmed = true;
        
        // إعادة عرض النتيجة مع التحديث
        displayAdmissionResult(student);
        
        // عرض رسالة تأكيد
        setTimeout(() => {
            alert('تم تأكيد القبول بنجاح! يمكنك الآن المتابعة لدفع الرسوم الدراسية.');
        }, 500);
    }
}

// معالجة رفع الملف
function handleFileUpload(event, nationalId) {
    const file = event.target.files[0];
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (file) {
        // التحقق من نوع الملف
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            uploadStatus.innerHTML = `
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 1rem; margin-top: 1rem; color: #721c24;">
                    ❌ نوع الملف غير مدعوم. يُرجى رفع صورة أو ملف PDF.
                </div>
            `;
            return;
        }
        
        // التحقق من حجم الملف (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
            uploadStatus.innerHTML = `
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 1rem; margin-top: 1rem; color: #721c24;">
                    ❌ حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.
                </div>
            `;
            return;
        }
        
        // محاكاة رفع الملف
        uploadStatus.innerHTML = `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 1rem; margin-top: 1rem; color: #856404;">
                ⏳ جاري رفع الملف...
            </div>
        `;
        
        setTimeout(() => {
            const student = studentData[nationalId];
            if (student) {
                student.isPaid = true;
                
                uploadStatus.innerHTML = `
                    <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 1rem; margin-top: 1rem; color: #155724;">
                        ✅ تم رفع إيصال السداد بنجاح!
                        <br><small>اسم الملف: ${file.name}</small>
                    </div>
                `;
                
                // إعادة عرض النتيجة مع التحديث
                setTimeout(() => {
                    displayAdmissionResult(student);
                }, 1000);
            }
        }, 2000);
    }
}

// إضافة تأثيرات تفاعلية
document.addEventListener('DOMContentLoaded', function() {
    // تأثير الكتابة على حقول الإدخال
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // تأثير الأزرار
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

