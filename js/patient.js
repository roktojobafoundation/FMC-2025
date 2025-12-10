// Patient Registration JavaScript - বাংলা সংস্করণ
// Version: 2.0 - With PDF Preview System

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initPatientRegistration();
    initPatientStatusCheck();
    initFocusAnimations();
    initFormValidationFeedback();
    addFormValidationStyles();
    addPDFStyles();
});

// ============================================
// STYLES MANAGEMENT
// ============================================

function addFormValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Validation Styles */
        .form-control.valid {
            border-color: #28a745;
            background: linear-gradient(135deg, #f8fff8 0%, #e8f5e9 100%);
        }
        
        .form-control.invalid {
            border-color: #dc3545;
            background: linear-gradient(135deg, #fff8f8 0%, #ffebee 100%);
        }
        
        .form-group.focused .form-label {
            color: #e63946;
            transform: translateX(10px);
        }
        
        .form-group.focused .form-control {
            box-shadow: 0 0 0 4px rgba(230, 57, 70, 0.15);
        }
        
        /* Alert Styles */
        .alert {
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: flex-start;
            gap: 15px;
            animation: fadeIn 0.3s ease;
        }
        
        .alert-success {
            background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        
        .alert-danger {
            background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        
        .alert-warning {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        
        .alert-info {
            background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
            border: 1px solid #bee5eb;
            color: #0c5460;
        }
        
        .alert i {
            font-size: 1.5rem;
            margin-top: 2px;
        }
        
        .alert-content {
            flex: 1;
        }
        
        .alert h4 {
            margin: 0 0 5px 0;
            font-size: 1.1rem;
        }
        
        .alert p {
            margin: 0;
            font-size: 0.95rem;
        }
        
        .alert-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0;
            opacity: 0.7;
            transition: opacity 0.3s ease;
            font-size: 1.2rem;
        }
        
        .alert-close:hover {
            opacity: 1;
        }
        
        /* Fade animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        .animate-fade-in {
            animation: fadeIn 0.3s ease;
        }
        
        .animate-fade-out {
            animation: fadeOut 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

function addPDFStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* PDF Preview Container */
        .pdf-preview-container {
            display: none;
            margin-top: 40px;
            animation: fadeIn 0.5s ease;
        }
        
        .pdf-preview-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
        }
        
        /* PDF Header */
        .pdf-header {
            background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
            padding: 30px 25px;
            color: white;
            text-align: center;
            position: relative;
        }
        
        .pdf-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,0.3) 10px,
                rgba(255,255,255,0.3) 20px
            );
        }
        
        .pdf-logo {
            width: 100px;
            height: 100px;
            background: white;
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .pdf-logo i {
            font-size: 50px;
            color: #e63946;
        }
        
        .pdf-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            letter-spacing: 0.5px;
        }
        
        .pdf-subtitle {
            font-size: 1.1rem;
            opacity: 0.95;
            font-weight: 400;
        }
        
        /* Registration ID Display */
        .registration-id-display {
            text-align: center;
            background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
            padding: 20px;
            border-radius: 10px;
            border: 2px dashed #ff9800;
            margin: 20px 25px 0;
        }
        
        .registration-id-display h4 {
            color: #e65100;
            margin-bottom: 12px;
            font-size: 1.1rem;
            font-weight: 600;
        }
        
        .registration-id {
            font-size: 2rem;
            font-weight: 700;
            color: #e63946;
            letter-spacing: 2px;
            background: white;
            padding: 12px 25px;
            border-radius: 8px;
            display: inline-block;
            border: 2px solid #e63946;
            margin-bottom: 8px;
            font-family: 'Courier New', monospace;
        }
        
        .registration-id-display p {
            margin: 0;
            color: #666;
            font-size: 0.9rem;
        }
        
        /* PDF Body */
        .pdf-body {
            padding: 30px;
        }
        
        .pdf-section {
            margin-bottom: 30px;
            padding-bottom: 25px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .pdf-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .section-title {
            color: #e63946;
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 2px solid #e63946;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .section-title i {
            font-size: 1.2rem;
        }
        
        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        
        @media (max-width: 768px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .info-label {
            color: #666;
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        
        .info-label i {
            font-size: 0.8rem;
            color: #e63946;
        }
        
        .info-value {
            font-size: 1.05rem;
            font-weight: 600;
            color: #333;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #e63946;
            min-height: 45px;
            display: flex;
            align-items: center;
        }
        
        /* QR Code Section */
        .qr-code-container {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-top: 20px;
        }
        
        .qr-code {
            width: 200px;
            height: 200px;
            margin: 0 auto;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .qr-code-content {
            text-align: center;
        }
        
        .qr-code-content i {
            font-size: 80px;
            color: #333;
            margin-bottom: 10px;
        }
        
        .qr-code-content p {
            font-size: 12px;
            color: #666;
            margin: 0;
            font-family: 'Courier New', monospace;
        }
        
        /* PDF Footer */
        .pdf-footer {
            background: #f8f9fa;
            padding: 30px 25px;
            border-top: 2px solid #dee2e6;
        }
        
        .footer-instructions {
            background: white;
            padding: 25px;
            border-radius: 10px;
            border-left: 4px solid #28a745;
            box-shadow: 0 3px 10px rgba(0,0,0,0.05);
        }
        
        .footer-instructions h4 {
            color: #28a745;
            margin-bottom: 18px;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .footer-instructions ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-instructions li {
            padding: 10px 0;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            border-bottom: 1px dashed #eee;
        }
        
        .footer-instructions li:last-child {
            border-bottom: none;
        }
        
        .footer-instructions i {
            color: #28a745;
            min-width: 20px;
            margin-top: 3px;
        }
        
        .footer-instructions strong {
            color: #333;
            min-width: 60px;
            display: inline-block;
        }
        
        /* PDF Actions */
        .pdf-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .pdf-btn {
            padding: 12px 30px;
            border-radius: 8px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            min-width: 160px;
            justify-content: center;
        }
        
        .pdf-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .pdf-btn i {
            font-size: 1.1rem;
        }
        
        /* Print Styles */
        @media print {
            body * {
                visibility: hidden;
            }
            
            .pdf-preview-container,
            .pdf-preview-container * {
                visibility: visible;
            }
            
            .pdf-preview-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 0;
            }
            
            .pdf-preview-card {
                box-shadow: none;
                border: none;
                border-radius: 0;
            }
            
            .pdf-actions {
                display: none;
            }
            
            .pdf-btn {
                display: none;
            }
        }
        
        /* Status Badge */
        .status-badge {
            display: inline-block;
            padding: 6px 15px;
            border-radius: 50px;
            color: white;
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Phone validation function for Bangladeshi numbers
function validateBangladeshiPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');

    const patterns = [
        /^01[3-9]\d{8}$/,          // 01123456789
        /^\+8801[3-9]\d{8}$/,      // +8801123456789
        /^8801[3-9]\d{8}$/         // 8801123456789
    ];

    return patterns.some(pattern => pattern.test(cleaned));
}

// Format Bangladeshi phone number for display
function formatBangladeshiPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.startsWith('880') && cleaned.length === 13) {
        return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)}-${cleaned.substring(8)}`;
    } else if (cleaned.startsWith('01') && cleaned.length === 11) {
        return `+880 ${cleaned.substring(1, 3)} ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    } else if (cleaned.startsWith('+880') && cleaned.length === 14) {
        return `+${cleaned.substring(1, 4)} ${cleaned.substring(4, 6)} ${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
    }

    return phone;
}

// Phone input formatting for Bangladeshi numbers
function initBangladeshiPhoneInput(inputId) {
    const phoneInput = document.getElementById(inputId);

    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (e.target.value.startsWith('+') && !value.startsWith('+')) {
            value = '+' + value;
        }

        if (value.length > 14) {
            value = value.substring(0, 14);
        }

        if (value.startsWith('+880') && value.length > 4) {
            const formatted = `+${value.substring(1, 4)} ${value.substring(4, 6)} ${value.substring(6, 9)}-${value.substring(9)}`;
            e.target.value = formatted;
        } else if (value.startsWith('880') && value.length > 3) {
            const formatted = `+${value.substring(0, 3)} ${value.substring(3, 5)} ${value.substring(5, 8)}-${value.substring(8)}`;
            e.target.value = formatted;
        } else if (value.startsWith('01') && value.length > 2) {
            const formatted = `${value.substring(0, 3)} ${value.substring(3, 6)}-${value.substring(6)}`;
            e.target.value = formatted;
        } else {
            e.target.value = value;
        }
    });

    phoneInput.placeholder = "01XXXXXXXXX বা +8801XXXXXXXXX";
}

// বাংলা তারিখ ফরম্যাট করার ফাংশন
function formatBangladeshiDateTime(date) {
    const banglaMonths = [
        'জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];

    const banglaDays = [
        'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
    ];

    const d = new Date(date);
    const day = d.getDate();
    const month = banglaMonths[d.getMonth()];
    const year = d.getFullYear();
    const dayName = banglaDays[d.getDay()];

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day} ${month} ${year}, ${dayName} - ${hours}:${minutes}:${seconds} ${ampm}`;
}

// বাংলা স্ট্যাটাস টেক্সট - FIXED VERSION
// বাংলা স্ট্যাটাস টেক্সট - Admin Portal Compatible
function getBanglaStatus(status) {
    if (!status) return 'অপেক্ষমাণ';

    const statusStr = String(status).trim();

    // Admin Portal compatible status mapping
    const statusMap = {
        'Waiting': 'অপেক্ষমাণ',
        'Under Checkup': 'চেকআপ চলছে',
        'Completed': 'সম্পন্ন',
        'Rejected': 'বাতিল'
    };

    // Exact match
    if (statusMap[statusStr]) {
        return statusMap[statusStr];
    }

    // Case-insensitive match
    const upperStatus = statusStr.toUpperCase();
    if (upperStatus.includes('WAITING')) {
        return 'অপেক্ষমাণ';
    } else if (upperStatus.includes('UNDER CHECKUP') || upperStatus.includes('CHECKUP')) {
        return 'চেকআপ চলছে';
    } else if (upperStatus.includes('COMPLETED')) {
        return 'সম্পন্ন';
    } else if (upperStatus.includes('REJECTED')) {
        return 'বাতিল';
    }

    return statusStr;
}

// Generate unique Registration ID
function generateRegistrationID() {
    const prefix = 'RJF';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${timestamp}${random}`;
}

// Check if Registration ID already exists
async function checkRegistrationIdExists(registrationId) {
    try {
        if (!window.db) {
            console.error('Firestore is not initialized');
            return false;
        }

        const querySnapshot = await window.db.collection('patients')
            .where('registrationId', '==', registrationId)
            .limit(1)
            .get();

        return !querySnapshot.empty;
    } catch (error) {
        console.error('Registration ID চেক করার সময় ত্রুটি:', error);
        return false;
    }
}

// Helper function to show loading state
function showLoading(button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> প্রক্রিয়াধীন...';
    button.disabled = true;
}

// Helper function to hide loading state
function hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// Helper function to show alert
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        console.error('Alert container not found');
        return;
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} animate-fade-in`;

    let icon = 'fa-info-circle';
    let title = 'তথ্য';

    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            title = 'সফল!';
            break;
        case 'danger':
            icon = 'fa-exclamation-circle';
            title = 'ত্রুটি!';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            title = 'সতর্কতা!';
            break;
        case 'info':
            icon = 'fa-info-circle';
            title = 'তথ্য';
            break;
    }

    alert.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="alert-content">
            <h4 class="bengali-text">${title}</h4>
            <p class="bengali-text">${message}</p>
        </div>
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    alertContainer.appendChild(alert);

    // Remove alert after 5 seconds
    setTimeout(() => {
        alert.classList.add('animate-fade-out');
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 5000);
}

// ============================================
// PATIENT REGISTRATION
// ============================================

function initPatientRegistration() {
    const registrationForm = document.getElementById('patientRegistrationForm');

    if (!registrationForm) {
        console.error('Registration form not found');
        return;
    }

    // Initialize Bangladeshi phone input
    initBangladeshiPhoneInput('phone');
    initBangladeshiPhoneInput('emergencyContact');

    // Form submission
    registrationForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!window.db || !window.rtdb) {
            showAlert('ডাটাবেজ সংযোগ পাওয়া যায়নি। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।', 'danger');
            return;
        }

        const db = window.db;
        const rtdb = window.rtdb;

        // Get current date and time with Bangladesh timezone
        const now = new Date();
        const bangladeshTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));

        // Generate registration ID
        const registrationId = generateRegistrationID();
        const phone = document.getElementById('phone').value.replace(/\D/g, '');

        // Check if registration ID already exists
        const idExists = await checkRegistrationIdExists(registrationId);
        if (idExists) {
            showAlert('এই নিবন্ধন আইডিটি ইতিমধ্যে ব্যবহৃত হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'danger');
            return;
        }

        // Check if phone number already registered
        const phoneQuery = await db.collection('patients')
            .where('phone', '==', phone)
            .limit(1)
            .get();

        if (!phoneQuery.empty) {
            const existingPatient = phoneQuery.docs[0].data();
            showAlert(`এই মোবাইল নম্বরটি ইতিমধ্যে নিবন্ধিত হয়েছে। নিবন্ধন আইডি: ${existingPatient.registrationId}`, 'warning');
            return;
        }

        // Validate required fields
        const requiredFields = ['fullName', 'age', 'gender', 'phone', 'address', 'currentSymptoms'];
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                showAlert('অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন', 'warning');
                field?.focus();
                return;
            }
        }

        // Prepare form data
        const formData = {
            registrationId: registrationId,
            fullName: document.getElementById('fullName').value.trim(),
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            phone: phone,
            address: document.getElementById('address').value.trim(),
            emergencyContact: document.getElementById('emergencyContact').value.replace(/\D/g, ''),
            medicalHistory: document.getElementById('medicalHistory').value.trim(),
            currentSymptoms: document.getElementById('currentSymptoms').value.trim(),
            previousMedications: document.getElementById('previousMedications').value.trim(),
            bloodGroup: document.getElementById('bloodGroup').value,
            allergies: document.getElementById('allergies').value.trim(),
            // Firebase Timestamp format
            registrationDate: firebase.firestore.Timestamp.fromDate(bangladeshTime),
            status: 'Waiting',
            checkupStarted: false,
            checkupCompleted: false,
            assignedDoctor: null,
            assignedDoctorId: null,
            checkupStartTime: null,
            checkupEndTime: null,
            waitTime: Math.floor(Math.random() * 30) + 10, // Random wait time 10-40 minutes
            // Additional fields for better tracking
            registrationDateISO: bangladeshTime.toISOString(),
            registrationTimestamp: bangladeshTime.getTime()
        };

        // Validate Bangladeshi phone number
        if (!validateBangladeshiPhoneNumber(formData.phone)) {
            showAlert('অনুগ্রহ করে একটি বৈধ বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX বা +8801XXXXXXXXX)', 'danger');
            return;
        }

        // Validate emergency contact if provided
        if (formData.emergencyContact && !validateBangladeshiPhoneNumber(formData.emergencyContact)) {
            showAlert('অনুগ্রহ করে একটি বৈধ বাংলাদেশি জরুরী যোগাযোগের নম্বর দিন', 'danger');
            return;
        }

        // Validate age
        if (formData.age < 1 || formData.age > 120) {
            showAlert('অনুগ্রহ করে একটি বৈধ বয়স দিন (১-১২০ বছর)', 'danger');
            return;
        }

        const submitBtn = registrationForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        showLoading(submitBtn);

        try {
            console.log("রোগী তথ্য জমা দেওয়া হচ্ছে:", formData);

            // Save to Firestore
            const docRef = await db.collection('patients').add(formData);
            console.log("রোগী সংরক্ষিত হয়েছে ID:", docRef.id);

            // Update real-time database
            await rtdb.ref(`patients/${docRef.id}`).set({
                ...formData,
                id: docRef.id
            });
            console.log("রিয়েল-টাইম ডাটাবেজ আপডেট করা হয়েছে");

            // Show success message
            showAlert(`রোগী নিবন্ধন সফল হয়েছে! আপনার নিবন্ধন আইডি: ${formData.registrationId}`, 'success');

            // Reset form
            registrationForm.reset();

            // Show PDF preview
            showPDFPreview(formData);

        } catch (error) {
            console.error('সম্পূর্ণ ত্রুটির বিবরণ:', error);

            if (error.code === 'permission-denied') {
                showAlert('ডাটাবেজ পারমিশন ডিনাই করা হয়েছে। অনুগ্রহ করে Firebase Rules চেক করুন।', 'danger');
            } else if (error.code === 'unavailable') {
                showAlert('নেটওয়ার্ক সংযোগ ব্যর্থ হয়েছে। অনুগ্রহ করে আপনার ইন্টারনেট চেক করুন।', 'danger');
            } else {
                showAlert(`নিবন্ধন ব্যর্থ হয়েছে: ${error.message}`, 'danger');
            }
        } finally {
            hideLoading(submitBtn, originalBtnText);
        }
    });
}

// ============================================
// PDF PREVIEW SYSTEM
// ============================================

function showPDFPreview(patientData) {
    // Create or show PDF preview container
    let pdfContainer = document.getElementById('pdfPreviewContainer');
    if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdfPreviewContainer';
        pdfContainer.className = 'pdf-preview-container';

        // Insert after form
        const form = document.getElementById('patientRegistrationForm');
        form.parentNode.insertBefore(pdfContainer, form.nextSibling);
    }

    // Format registration date
    let regDate;
    if (patientData.registrationDate && patientData.registrationDate.toDate) {
        regDate = formatBangladeshiDateTime(patientData.registrationDate.toDate());
    } else if (patientData.registrationDateISO) {
        regDate = formatBangladeshiDateTime(new Date(patientData.registrationDateISO));
    } else {
        regDate = formatBangladeshiDateTime(new Date());
    }

    // Get status color
    function getStatusColor(status) {
        const statusStr = String(status).toUpperCase();
        if (statusStr.includes('WAITING') || statusStr.includes('অপেক্ষমাণ')) {
            return '#ffc107';
        } else if (statusStr.includes('UNDER CHECKUP') || statusStr.includes('চেকআপ চলছে')) {
            return '#17a2b8';
        } else if (statusStr.includes('COMPLETED') || statusStr.includes('সম্পন্ন')) {
            return '#28a745';
        } else if (statusStr.includes('REJECTED') || statusStr.includes('বাতিল')) {
            return '#dc3545';
        }
        return '#6c757d';
    }

    const statusColor = getStatusColor(patientData.status);
    const banglaStatus = getBanglaStatus(patientData.status);

    pdfContainer.innerHTML = `
        <div class="pdf-preview-card">
            <!-- PDF Header -->
            <div class="pdf-header">
                <div class="pdf-logo">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <h1 class="pdf-title bengali-text">রক্তজবা ফাউন্ডেশন</h1>
                <p class="pdf-subtitle bengali-text"> ১৬ ডিসেম্বর ২০২৫ - বিনামূল্যে মেডিকেল ক্যাম্প</p>
            </div>

            <!-- Registration ID Display -->
            <div class="registration-id-display">
                <h4 class="bengali-text">আপনার নিবন্ধন আইডি:</h4>
                <div class="registration-id">${patientData.registrationId}</div>
                <p class="bengali-text">এই আইডিটি সংরক্ষণ করুন এবং ক্যাম্পে আনুন</p>
            </div>

            <!-- PDF Body -->
            <div class="pdf-body">
                <!-- Personal Information Section -->
                <div class="pdf-section">
                    <h3 class="section-title bengali-text">
                        <i class="fas fa-user-circle"></i> ব্যক্তিগত তথ্য
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-user"></i> পূর্ণ নাম
                            </span>
                            <div class="info-value bengali-text">${patientData.fullName}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-birthday-cake"></i> বয়স / লিঙ্গ
                            </span>
                            <div class="info-value bengali-text">${patientData.age} বছর / ${patientData.gender}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-phone"></i> মোবাইল নম্বর
                            </span>
                            <div class="info-value bengali-text">${formatBangladeshiPhoneNumber(patientData.phone)}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-tint"></i> রক্তের গ্রুপ
                            </span>
                            <div class="info-value bengali-text">${patientData.bloodGroup || 'নাই'}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-phone-alt"></i> জরুরী যোগাযোগ
                            </span>
                            <div class="info-value bengali-text">${patientData.emergencyContact ? formatBangladeshiPhoneNumber(patientData.emergencyContact) : 'নাই'}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-map-marker-alt"></i> ঠিকানা
                            </span>
                            <div class="info-value bengali-text">${patientData.address}</div>
                        </div>
                    </div>
                </div>

                <!-- Medical Information Section -->
                <div class="pdf-section">
                    <h3 class="section-title bengali-text">
                        <i class="fas fa-file-medical"></i> চিকিৎসা তথ্য
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-stethoscope"></i> বর্তমান সমস্যা
                            </span>
                            <div class="info-value bengali-text">${patientData.currentSymptoms || 'নাই'}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-history"></i> চিকিৎসা ইতিহাস
                            </span>
                            <div class="info-value bengali-text">${patientData.medicalHistory || 'নাই'}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-allergies"></i> অ্যালার্জি
                            </span>
                            <div class="info-value bengali-text">${patientData.allergies || 'নাই'}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-pills"></i> পূর্ববর্তী ঔষধ
                            </span>
                            <div class="info-value bengali-text">${patientData.previousMedications || 'নাই'}</div>
                        </div>
                    </div>
                </div>

                <!-- Registration Details Section -->
                <div class="pdf-section">
                    <h3 class="section-title bengali-text">
                        <i class="fas fa-clipboard-check"></i> নিবন্ধন বিবরণ
                    </h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-id-card"></i> নিবন্ধন আইডি
                            </span>
                            <div class="info-value bengali-text">${patientData.registrationId}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-calendar-alt"></i> নিবন্ধনের তারিখ
                            </span>
                            <div class="info-value bengali-text">${regDate}</div>
                        </div>
                        <div class="info-item">
                            <span class="info-label bengali-text">
                                <i class="fas fa-hourglass-half"></i> বর্তমান স্ট্যাটাস
                            </span>
                            <div class="info-value">
                                <span class="status-badge" style="background: ${statusColor}">${banglaStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PDF Footer -->
            <div class="pdf-footer">
                <div class="footer-instructions">
                    <h4 class="bengali-text"><i class="fas fa-info-circle"></i> গুরুত্বপূর্ণ নির্দেশাবলী:</h4>
                    <ul class="bengali-text">
                        <li>
                            <i class="fas fa-calendar-day"></i> 
                            <strong>তারিখ:</strong> ১৬ ডিসেম্বর ২০২৫ (মঙ্গলবার)
                        </li>
                        <li>
                            <i class="fas fa-clock"></i> 
                            <strong>সময়:</strong> সকাল ৮:০০ টা থেকে শুরু
                        </li>
                        <li>
                            <i class="fas fa-map-marker-alt"></i> 
                            <strong>স্থান:</strong> ভাটিরসুলপুর, এনায়েতনগর, মতলব(উত্তর), চাঁদপুর।
                        </li>
                        <li>
                            <i class="fas fa-id-card"></i> 
                            <strong>ফর্ম:</strong> এই ফর্মটি প্রিন্ট করে আনুন অথবা মোবাইলে সংরক্ষণ করুন।
                        </li>
                        <li>
                            <i class="fas fa-phone"></i> 
                            <strong>জরুরী যোগাযোগ:</strong> +880 1960 506 601
                        </li>
                    </ul>
                </div>

                <div class="pdf-actions">
                    <button class="pdf-btn" style="background: #007bff; color: white;" onclick="printPDF()">
                        <i class="fas fa-print"></i> প্রিন্ট করুন
                    </button>
                    <button class="pdf-btn" style="background: #28a745; color: white;" onclick="downloadPDF()">
                        <i class="fas fa-download"></i> ডাউনলোড করুন
                    </button>
                    <button class="pdf-btn" style="background: #6c757d; color: white;" onclick="sharePDF()">
                        <i class="fas fa-share-alt"></i> শেয়ার করুন
                    </button>
                    <button class="pdf-btn" style="background: white; color: #007bff; border: 2px solid #007bff;" onclick="newRegistration()">
                        <i class="fas fa-user-plus"></i> নতুন নিবন্ধন
                    </button>
                </div>
            </div>
        </div>
    `;

    pdfContainer.style.display = 'block';
    pdfContainer.scrollIntoView({ behavior: 'smooth' });
}

// Print PDF function
function printPDF() {
    const printWindow = window.open('', '_blank');
    const pdfContent = document.getElementById('pdfPreviewContainer').innerHTML;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="bn">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>রক্তজবা ফাউন্ডেশন - নিবন্ধন নিশ্চিতকরণ</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: white;
                }
                .pdf-preview-card {
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    overflow: hidden;
                }
                .pdf-header {
                    background: #e63946;
                    padding: 20px;
                    color: white;
                    text-align: center;
                }
                .registration-id {
                    font-size: 24px;
                    font-weight: bold;
                    color: #e63946;
                    text-align: center;
                    margin: 20px 0;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin: 20px;
                }
                .section-title {
                    color: #e63946;
                    border-bottom: 2px solid #e63946;
                    padding-bottom: 10px;
                    margin: 20px;
                }
                @media print {
                    .pdf-actions { display: none; }
                }
            </style>
        </head>
        <body>
            ${pdfContent}
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Download PDF function
function downloadPDF() {
    showAlert('PDF ডাউনলোড শুরু হচ্ছে...', 'info');

    // In a real implementation, you would use jsPDF library
    // For now, we'll trigger the print function
    setTimeout(() => {
        printPDF();
    }, 1000);
}

// Share PDF function
function sharePDF() {
    const pdfContainer = document.getElementById('pdfPreviewContainer');
    if (!pdfContainer) return;

    const registrationId = pdfContainer.querySelector('.registration-id')?.textContent || '';
    const patientName = pdfContainer.querySelector('.info-value')?.textContent || '';

    const shareText = `রক্তজবা ফাউন্ডেশন - নিবন্ধন নিশ্চিতকরণ\n\nনাম: ${patientName}\nনিবন্ধন আইডি: ${registrationId}\nতারিখ: ১৬ ডিসেম্বর ২০২৫\nস্থান: ১২৩ মেডিকেল স্ট্রিট, ঢাকা\n\nএই আইডিটি সাথে আনুন এবং ক্যাম্পে উপস্থিত হন।`;

    if (navigator.share) {
        navigator.share({
            title: 'রক্তজবা ফাউন্ডেশন - নিবন্ধন নিশ্চিতকরণ',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.log('Sharing cancelled:', error);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('নিবন্ধন তথ্য কপি করা হয়েছে!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showAlert('কপি করতে সমস্যা হচ্ছে, ম্যানুয়ালি কপি করুন', 'warning');
    });
}

// Start new registration
function newRegistration() {
    const pdfContainer = document.getElementById('pdfPreviewContainer');
    if (pdfContainer) {
        pdfContainer.style.display = 'none';
    }

    const form = document.getElementById('patientRegistrationForm');
    form.reset();
    form.scrollIntoView({ behavior: 'smooth' });

    showAlert('নতুন রোগী নিবন্ধন শুরু করুন', 'info');
}

// ============================================
// PATIENT STATUS CHECK
// ============================================

function initPatientStatusCheck() {
    const statusCheckForm = document.getElementById('statusCheckForm');

    if (!statusCheckForm) return;

    statusCheckForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const registrationId = document.getElementById('checkRegistrationId').value.trim();

        if (!registrationId) {
            showAlert('অনুগ্রহ করে নিবন্ধন আইডি দিন', 'warning');
            return;
        }

        const submitBtn = statusCheckForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        showLoading(submitBtn);

        try {
            if (!window.db) {
                throw new Error('ডাটাবেজ সংযোগ নেই');
            }

            const querySnapshot = await window.db.collection('patients')
                .where('registrationId', '==', registrationId)
                .limit(1)
                .get();

            if (querySnapshot.empty) {
                showAlert('প্রদত্ত নিবন্ধন আইডি দিয়ে কোন রোগী পাওয়া যায়নি।', 'warning');
                hideLoading(submitBtn, originalBtnText);
                return;
            }

            const patientDoc = querySnapshot.docs[0];
            const patientData = patientDoc.data();

            // Ensure we have the complete data
            const completePatientData = {
                id: patientDoc.id,
                ...patientData
            };

            console.log('Fetched patient data:', completePatientData);

            // Display patient status
            displayPatientStatus(completePatientData);

        } catch (error) {
            console.error('স্ট্যাটাস চেক করার সময় ত্রুটি:', error);
            showAlert('স্ট্যাটাস চেক করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'danger');
        } finally {
            hideLoading(submitBtn, originalBtnText);
        }
    });
}

// ============================================
// PATIENT STATUS CHECK - UPDATED VERSION
// ============================================

function displayPatientStatus(patientData) {
    const statusResult = document.getElementById('statusResult');
    if (!statusResult) return;

    // Calculate patient status from actual data (Admin Portal style)
    let calculatedStatus;

    if (patientData.checkupCompleted) {
        calculatedStatus = 'Completed';
    } else if (patientData.checkupStarted) {
        calculatedStatus = 'Under Checkup';
    } else {
        calculatedStatus = 'Waiting';
    }

    // Use calculated status if database status is not reliable
    const status = calculatedStatus;
    const banglaStatus = getBanglaStatus(status); // This will return বাংলা স্ট্যাটাস

    console.log('Status calculation:', {
        rawStatus: patientData.status,
        calculatedStatus: calculatedStatus,
        checkupStarted: patientData.checkupStarted,
        checkupCompleted: patientData.checkupCompleted,
        finalStatus: status,
        banglaStatus: banglaStatus
    });

    let statusIcon, statusColor, statusMessage;

    // Determine status details - Use the actual status values
    if (status === 'Waiting') {
        statusIcon = 'fa-clock';
        statusColor = '#ffc107';
        statusMessage = 'আপনি অপেক্ষার তালিকায় আছেন। অনুগ্রহ করে আপনার নির্ধারিত সময়ে ক্যাম্প স্থানে উপস্থিত হন।';
    } else if (status === 'Under Checkup') {
        statusIcon = 'fa-user-md';
        statusColor = '#17a2b8';
        statusMessage = 'আপনার চেকআপ বর্তমানে চলছে। ধৈর্য্য ধরুন, শীঘ্রই সম্পন্ন হবে।';
    } else if (status === 'Completed') {
        statusIcon = 'fa-check-circle';
        statusColor = '#28a745';
        statusMessage = 'আপনার চেকআপ সফলভাবে সম্পন্ন হয়েছে। ডাক্তারের পরামর্শ অনুসরণ করুন।';
    } else if (status === 'Rejected') {
        statusIcon = 'fa-times-circle';
        statusColor = '#dc3545';
        statusMessage = 'আপনার নিবন্ধনটি বাতিল করা হয়েছে। বিস্তারিত জানতে অফিসে যোগাযোগ করুন।';
    } else {
        statusIcon = 'fa-question-circle';
        statusColor = '#6c757d';
        statusMessage = 'স্ট্যাটাস পাওয়া যায়নি।';
    }

    // Format registration date
    let regDate;
    if (patientData.registrationDate && patientData.registrationDate.toDate) {
        regDate = formatBangladeshiDateTime(patientData.registrationDate.toDate());
    } else if (patientData.registrationDateISO) {
        regDate = formatBangladeshiDateTime(new Date(patientData.registrationDateISO));
    } else {
        regDate = 'তারিখ পাওয়া যায়নি';
    }

    // Format times if available
    let checkupStartTime = 'শুরু হয়নি';
    let checkupEndTime = 'সম্পন্ন হয়নি';

    if (patientData.checkupStartTime && patientData.checkupStartTime.toDate) {
        checkupStartTime = formatBangladeshiDateTime(patientData.checkupStartTime.toDate());
    }

    if (patientData.checkupEndTime && patientData.checkupEndTime.toDate) {
        checkupEndTime = formatBangladeshiDateTime(patientData.checkupEndTime.toDate());
    }

    statusResult.innerHTML = `
        <div class="status-result-container animate-fade-in">
            <div class="status-card" style="background: white; border-radius: 10px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid ${statusColor}">
                    <i class="fas ${statusIcon}" style="font-size: 2rem; color: ${statusColor}"></i>
                    <div>
                        <h3 class="bengali-text" style="margin: 0 0 5px 0;">রোগীর স্ট্যাটাস</h3>
                        <span class="status-badge" style="background: ${statusColor}; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold;">
                            ${banglaStatus} <!-- বাংলা স্ট্যাটাস দেখান -->
                        </span>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                    <div>
                        <h4 class="bengali-text" style="color: #e63946; margin-bottom: 15px;">রোগীর তথ্য</h4>
                        <p class="bengali-text"><strong>নিবন্ধন আইডি:</strong> ${patientData.registrationId}</p>
                        <p class="bengali-text"><strong>নাম:</strong> ${patientData.fullName}</p>
                        <p class="bengali-text"><strong>বয়স/লিঙ্গ:</strong> ${patientData.age} বছর / ${patientData.gender}</p>
                        <p class="bengali-text"><strong>মোবাইল:</strong> ${formatBangladeshiPhoneNumber(patientData.phone)}</p>
                    </div>
                    <div>
                        <h4 class="bengali-text" style="color: #e63946; margin-bottom: 15px;">নিবন্ধন বিবরণ</h4>
                        <p class="bengali-text"><strong>নিবন্ধনের সময়:</strong> ${regDate}</p>
                        <p class="bengali-text"><strong>রক্তের গ্রুপ:</strong> ${patientData.bloodGroup || 'নাই'}</p>
                        <p class="bengali-text"><strong>বর্তমান সমস্যা:</strong> ${patientData.currentSymptoms || 'নাই'}</p>
                        ${patientData.assignedDoctor ? `<p class="bengali-text"><strong>ডাক্তার:</strong> ${patientData.assignedDoctor}</p>` : ''}
                    </div>
                </div>
                
                <!-- Progress Timeline -->
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin-bottom: 20px;">
                    <h4 class="bengali-text" style="margin-top: 0; color: ${statusColor};">প্রক্রিয়া সময়রেখা</h4>
                    <div style="display: flex; justify-content: space-between; align-items: center; position: relative; margin: 15px 0;">
                        <!-- Timeline Progress Bar -->
                        <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 4px; background: #e0e0e0; z-index: 1;"></div>
                        <div style="position: absolute; top: 50%; left: 10%; width: ${status === 'Waiting' ? '33%' : status === 'Under Checkup' ? '66%' : '100%'}; height: 4px; background: ${statusColor}; z-index: 2; transition: width 0.5s ease;"></div>
                        
                        <!-- Timeline Steps -->
                        <div style="text-align: center; z-index: 3; position: relative;">
                            <div style="width: 30px; height: 30px; border-radius: 50%; background: ${status === 'Waiting' ? statusColor : '#e0e0e0'}; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                <i class="fas fa-user-plus"></i>
                            </div>
                            <span class="bengali-text" style="font-size: 0.9rem;">নিবন্ধিত</span>
                        </div>
                        
                        <div style="text-align: center; z-index: 3; position: relative;">
                            <div style="width: 30px; height: 30px; border-radius: 50%; background: ${status === 'Under Checkup' || status === 'Completed' ? statusColor : '#e0e0e0'}; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                <i class="fas fa-stethoscope"></i>
                            </div>
                            <span class="bengali-text" style="font-size: 0.9rem;">চেকআপ</span>
                        </div>
                        
                        <div style="text-align: center; z-index: 3; position: relative;">
                            <div style="width: 30px; height: 30px; border-radius: 50%; background: ${status === 'Completed' ? statusColor : '#e0e0e0'}; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
                                <i class="fas fa-check"></i>
                            </div>
                            <span class="bengali-text" style="font-size: 0.9rem;">সম্পূর্ণ</span>
                        </div>
                    </div>
                </div>
                
                <!-- Status Details -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div style="background: ${status === 'Waiting' ? '#fff3cd' : '#f8f9fa'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${status === 'Waiting' ? '#ffc107' : '#dee2e6'};">
                        <h5 class="bengali-text" style="margin: 0 0 10px 0; color: ${status === 'Waiting' ? '#856404' : '#6c757d'};">অপেক্ষার তথ্য</h5>
                        <p class="bengali-text" style="margin: 0;"><strong>অবস্থান:</strong> ${patientData.checkupStarted ? 'চেকআপ শুরু হয়েছে' : 'অপেক্ষা করছেন'}</p>
                        ${patientData.waitTime ? `<p class="bengali-text" style="margin: 0;"><strong>অপেক্ষার সময়:</strong> ${patientData.waitTime} মিনিট</p>` : ''}
                    </div>
                    
                    <div style="background: ${status === 'Under Checkup' ? '#d1ecf1' : '#f8f9fa'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${status === 'Under Checkup' ? '#17a2b8' : '#dee2e6'};">
                        <h5 class="bengali-text" style="margin: 0 0 10px 0; color: ${status === 'Under Checkup' ? '#0c5460' : '#6c757d'};">চেকআপ তথ্য</h5>
                        <p class="bengali-text" style="margin: 0;"><strong>শুরুর সময়:</strong> ${checkupStartTime}</p>
                        ${patientData.assignedDoctor ? `<p class="bengali-text" style="margin: 0;"><strong>ডাক্তার:</strong> ${patientData.assignedDoctor}</p>` : ''}
                    </div>
                    
                    <div style="background: ${status === 'Completed' ? '#d4edda' : '#f8f9fa'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${status === 'Completed' ? '#28a745' : '#dee2e6'};">
                        <h5 class="bengali-text" style="margin: 0 0 10px 0; color: ${status === 'Completed' ? '#155724' : '#6c757d'};">সমাপ্তি তথ্য</h5>
                        <p class="bengali-text" style="margin: 0;"><strong>সমাপ্তির সময়:</strong> ${checkupEndTime}</p>
                        <p class="bengali-text" style="margin: 0;"><strong>স্থিতি:</strong> চেকআপ সম্পূর্ণ</p>
                    </div>
                </div>
                
                <!-- Status Message -->
                <div style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px;">
                    <h4 class="bengali-text" style="color: #e63946; margin-bottom: 10px;">বর্তমান অবস্থা</h4>
                    <p class="bengali-text" style="margin: 0;">${statusMessage}</p>
                    <p class="bengali-text" style="margin: 10px 0 0 0; font-size: 0.9rem; color: #666;">
                        সর্বশেষ আপডেট: ${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    `;

    statusResult.style.display = 'block';
    statusResult.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// ANIMATION FUNCTIONS
// ============================================

function initFocusAnimations() {
    const formControls = document.querySelectorAll('.form-control');

    formControls.forEach(control => {
        control.addEventListener('focus', function () {
            this.parentElement.classList.add('focused');
        });

        control.addEventListener('blur', function () {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
}

function initFormValidationFeedback() {
    const form = document.getElementById('patientRegistrationForm');

    if (!form) return;

    form.addEventListener('input', function (e) {
        const input = e.target;
        if (input.checkValidity()) {
            input.classList.add('valid');
            input.classList.remove('invalid');
        } else {
            input.classList.add('invalid');
            input.classList.remove('valid');
        }
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.patientUtils = {
    generateRegistrationID,
    showPDFPreview,
    displayPatientStatus,
    validateBangladeshiPhoneNumber,
    formatBangladeshiPhoneNumber,
    formatBangladeshiDateTime,
    getBanglaStatus,
    printPDF,
    downloadPDF,
    sharePDF,
    newRegistration,
    showAlert,
    showLoading,
    hideLoading
};

// Test connection on load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.db) {
            console.log("Firestore প্রস্তুত");
        } else {
            console.error("Firestore পাওয়া যায়নি");
            showAlert("অনুগ্রহ করে অপেক্ষা করুন, সিস্টেম লোড হচ্ছে...", 'warning');
        }
    }, 2000);
});

// ============================================
// PDF PREVIEW SYSTEM - MOBILE OPTIMIZED
// ============================================

function showPDFPreview(patientData) {
    // Create or show PDF preview container
    let pdfContainer = document.getElementById('pdfPreviewContainer');
    if (!pdfContainer) {
        pdfContainer = document.createElement('div');
        pdfContainer.id = 'pdfPreviewContainer';
        pdfContainer.className = 'pdf-preview-container';

        // Insert after form
        const form = document.getElementById('patientRegistrationForm');
        form.parentNode.insertBefore(pdfContainer, form.nextSibling);
    }

    // Format registration date
    let regDate;
    if (patientData.registrationDate && patientData.registrationDate.toDate) {
        regDate = formatBangladeshiDateTime(patientData.registrationDate.toDate());
    } else if (patientData.registrationDateISO) {
        regDate = formatBangladeshiDateTime(new Date(patientData.registrationDateISO));
    } else {
        regDate = formatBangladeshiDateTime(new Date());
    }

    // Get status color
    function getStatusColor(status) {
        const statusStr = String(status).toUpperCase();
        if (statusStr.includes('WAITING') || statusStr.includes('অপেক্ষমাণ')) {
            return '#ffc107';
        } else if (statusStr.includes('UNDER CHECKUP') || statusStr.includes('চেকআপ চলছে')) {
            return '#17a2b8';
        } else if (statusStr.includes('COMPLETED') || statusStr.includes('সম্পন্ন')) {
            return '#28a745';
        } else if (statusStr.includes('REJECTED') || statusStr.includes('বাতিল')) {
            return '#dc3545';
        }
        return '#6c757d';
    }

    const statusColor = getStatusColor(patientData.status);
    const banglaStatus = getBanglaStatus(patientData.status);

    // Create compact registration ID display for mobile
    const compactRegIdHTML = `
        <div class="compact-registration-id-display">
            <div class="registration-id-card">
                <div class="registration-icon">
                    <i class="fas fa-id-card"></i>
                </div>
                <div class="registration-info">
                    <p class="registration-label bengali-text">আপনার নিবন্ধন আইডি:</p>
                    <h2 class="registration-id-number">${patientData.registrationId}</h2>
                    <p class="registration-hint bengali-text">এই আইডিটি সংরক্ষণ করুন</p>
                </div>
            </div>
            <div class="registration-actions">
                <button class="action-btn copy-btn" onclick="copyRegistrationId('${patientData.registrationId}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn share-btn" onclick="shareRegistrationId('${patientData.registrationId}', '${patientData.fullName}')">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
    `;

    pdfContainer.innerHTML = `
        <div class="pdf-preview-card">
            <!-- Compact Registration ID Display (Mobile First) -->
            ${compactRegIdHTML}

            <!-- PDF Header -->
            <div class="pdf-header">
                <div class="pdf-logo">
                    <i class="fas fa-heartbeat"></i>
                </div>
                <h1 class="pdf-title bengali-text">রক্তজবা ফাউন্ডেশন</h1>
                <p class="pdf-subtitle bengali-text">১৬ ডিসেম্বর ২০২৫ - বিনামূল্যে মেডিকেল ক্যাম্প</p>
            </div>

            <!-- PDF Body (Accordion Style for Mobile) -->
            <div class="pdf-body">
                <!-- Personal Information Accordion -->
                <div class="pdf-accordion-section" id="personalInfoSection">
                    <button class="accordion-header" onclick="toggleAccordion('personalInfoSection')">
                        <h3 class="section-title bengali-text">
                            <i class="fas fa-user-circle"></i> ব্যক্তিগত তথ্য
                            <span class="accordion-arrow"><i class="fas fa-chevron-down"></i></span>
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <div class="mobile-info-grid">
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-user"></i> নাম
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.fullName}</div>
                            </div>
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-birthday-cake"></i> বয়স/লিঙ্গ
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.age} বছর / ${patientData.gender}</div>
                            </div>
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-phone"></i> মোবাইল
                                </span>
                                <div class="mobile-info-value bengali-text">${formatBangladeshiPhoneNumber(patientData.phone)}</div>
                            </div>
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-tint"></i> রক্তের গ্রুপ
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.bloodGroup || 'নাই'}</div>
                            </div>
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-phone-alt"></i> জরুরী যোগাযোগ
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.emergencyContact ? formatBangladeshiPhoneNumber(patientData.emergencyContact) : 'নাই'}</div>
                            </div>
                            <div class="mobile-info-item full-width">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-map-marker-alt"></i> ঠিকানা
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.address}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Medical Information Accordion -->
                <div class="pdf-accordion-section" id="medicalInfoSection">
                    <button class="accordion-header" onclick="toggleAccordion('medicalInfoSection')">
                        <h3 class="section-title bengali-text">
                            <i class="fas fa-file-medical"></i> চিকিৎসা তথ্য
                            <span class="accordion-arrow"><i class="fas fa-chevron-down"></i></span>
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <div class="mobile-info-grid">
                            <div class="mobile-info-item full-width">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-stethoscope"></i> বর্তমান সমস্যা
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.currentSymptoms || 'নাই'}</div>
                            </div>
                            <div class="mobile-info-item full-width">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-history"></i> চিকিৎসা ইতিহাস
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.medicalHistory || 'নাই'}</div>
                            </div>
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-allergies"></i> অ্যালার্জি
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.allergies || 'নাই'}</div>
                            </div>
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-pills"></i> পূর্ববর্তী ঔষধ
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.previousMedications || 'নাই'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Registration Details Accordion -->
                <div class="pdf-accordion-section" id="registrationDetailsSection">
                    <button class="accordion-header" onclick="toggleAccordion('registrationDetailsSection')">
                        <h3 class="section-title bengali-text">
                            <i class="fas fa-clipboard-check"></i> নিবন্ধন বিবরণ
                            <span class="accordion-arrow"><i class="fas fa-chevron-down"></i></span>
                        </h3>
                    </button>
                    <div class="accordion-content">
                        <div class="mobile-info-grid">
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-id-card"></i> নিবন্ধন আইডি
                                </span>
                                <div class="mobile-info-value bengali-text">${patientData.registrationId}</div>
                            </div>
                            <div class="mobile-info-item full-width">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-calendar-alt"></i> নিবন্ধনের তারিখ
                                </span>
                                <div class="mobile-info-value bengali-text">${regDate}</div>
                            </div>
                            <div class="mobile-info-item">
                                <span class="mobile-info-label bengali-text">
                                    <i class="fas fa-hourglass-half"></i> স্ট্যাটাস
                                </span>
                                <div class="mobile-info-value">
                                    <span class="mobile-status-badge" style="background: ${statusColor}">${banglaStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PDF Footer -->
            <div class="pdf-footer">
                <!-- Instructions Accordion -->
                <div class="instructions-accordion" id="instructionsSection">
                    <button class="accordion-header" onclick="toggleAccordion('instructionsSection')">
                        <h4 class="bengali-text">
                            <i class="fas fa-info-circle"></i> গুরুত্বপূর্ণ নির্দেশাবলী
                            <span class="accordion-arrow"><i class="fas fa-chevron-down"></i></span>
                        </h4>
                    </button>
                    <div class="accordion-content">
                        <div class="mobile-instructions">
                            <div class="instruction-item">
                                <i class="fas fa-calendar-day"></i>
                                <div class="instruction-content">
                                    <strong class="bengali-text">তারিখ:</strong>
                                    <span class="bengali-text">১৬ ডিসেম্বর ২০২৫ (মঙ্গলবার)</span>
                                </div>
                            </div>
                            <div class="instruction-item">
                                <i class="fas fa-clock"></i>
                                <div class="instruction-content">
                                    <strong class="bengali-text">সময়:</strong>
                                    <span class="bengali-text">সকাল ৮:০০ টা থেকে শুরু</span>
                                </div>
                            </div>
                            <div class="instruction-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div class="instruction-content">
                                    <strong class="bengali-text">স্থান:</strong>
                                    <span class="bengali-text">ভাটিরসুলপুর, এনায়েতনগর, মতলব(উত্তর), চাঁদপুর</span>
                                </div>
                            </div>
                            <div class="instruction-item">
                                <i class="fas fa-id-card"></i>
                                <div class="instruction-content">
                                    <strong class="bengali-text">ফর্ম:</strong>
                                    <span class="bengali-text">এই ফর্মটি প্রিন্ট করে আনুন অথবা মোবাইলে সংরক্ষণ করুন</span>
                                </div>
                            </div>
                            <div class="instruction-item">
                                <i class="fas fa-phone"></i>
                                <div class="instruction-content">
                                    <strong class="bengali-text">জরুরী যোগাযোগ:</strong>
                                    <span class="bengali-text">+880 1960 506 601</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PDF Actions -->
                <div class="pdf-actions">
                    <button class="pdf-btn mobile-btn" onclick="printPDF()">
                        <i class="fas fa-print"></i>
                        <span class="btn-text">প্রিন্ট</span>
                    </button>
                    <button class="pdf-btn mobile-btn" onclick="downloadPDF()">
                        <i class="fas fa-download"></i>
                        <span class="btn-text">ডাউনলোড</span>
                    </button>
                    <button class="pdf-btn mobile-btn" onclick="sharePDF()">
                        <i class="fas fa-share-alt"></i>
                        <span class="btn-text">শেয়ার</span>
                    </button>
                    <button class="pdf-btn mobile-btn secondary" onclick="newRegistration()">
                        <i class="fas fa-user-plus"></i>
                        <span class="btn-text">নতুন</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    pdfContainer.style.display = 'block';
    pdfContainer.scrollIntoView({ behavior: 'smooth' });
    
    // Open first accordion by default
    setTimeout(() => {
        toggleAccordion('personalInfoSection', true);
    }, 300);
}

// ============================================
// NEW HELPER FUNCTIONS FOR MOBILE
// ============================================

// Toggle accordion function
function toggleAccordion(sectionId, forceOpen = false) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const content = section.querySelector('.accordion-content');
    const arrow = section.querySelector('.accordion-arrow i');
    
    if (forceOpen || content.style.display !== 'block') {
        content.style.display = 'block';
        arrow.classList.remove('fa-chevron-down');
        arrow.classList.add('fa-chevron-up');
        section.classList.add('active');
    } else {
        content.style.display = 'none';
        arrow.classList.remove('fa-chevron-up');
        arrow.classList.add('fa-chevron-down');
        section.classList.remove('active');
    }
}

// Copy registration ID to clipboard
function copyRegistrationId(regId) {
    navigator.clipboard.writeText(regId).then(() => {
        showAlert('নিবন্ধন আইডি কপি করা হয়েছে!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showAlert('কপি করতে সমস্যা হয়েছে', 'warning');
    });
}

// Share registration ID
function shareRegistrationId(regId, patientName) {
    const shareText = `রক্তজবা ফাউন্ডেশন - মেডিকেল ক্যাম্প নিবন্ধন\n\nনাম: ${patientName}\nনিবন্ধন আইডি: ${regId}\nতারিখ: ১৬ ডিসেম্বর ২০২৫\nস্থান: ভাটিরসুলপুর, এনায়েতনগর, মতলব(উত্তর), চাঁদপুর\n\nএই আইডিটি সাথে আনুন এবং ক্যাম্পে উপস্থিত হন।`;
    
    if (navigator.share) {
        navigator.share({
            title: 'রক্তজবা ফাউন্ডেশন - নিবন্ধন আইডি',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showAlert('নিবন্ধন তথ্য কপি করা হয়েছে!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            showAlert('কপি করতে সমস্যা হচ্ছে', 'warning');
        });
    }
}

// ============================================
// UPDATED PRINT FUNCTION FOR A4 PDF
// ============================================

function printPDF() {
    const printContent = document.querySelector('.pdf-preview-card');
    if (!printContent) return;

    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    
    const printHTML = `
        <!DOCTYPE html>
        <html lang="bn">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>রক্তজবা ফাউন্ডেশন - নিবন্ধন নিশ্চিতকরণ</title>
            <style>
                @page {
                    size: A4;
                    margin: 15mm;
                }
                
                body {
                    font-family: 'Noto Sans Bengali', 'Arial', sans-serif;
                    margin: 0;
                    padding: 0;
                    background: white;
                    color: #333;
                    font-size: 12px;
                    line-height: 1.4;
                }
                
                .print-container {
                    max-width: 210mm;
                    margin: 0 auto;
                    padding: 10mm;
                }
                
                .print-header {
                    text-align: center;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 3px solid #e63946;
                }
                
                .print-logo {
                    width: 60px;
                    height: 60px;
                    background: #e63946;
                    border-radius: 50%;
                    margin: 0 auto 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                }
                
                .print-title {
                    color: #e63946;
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                }
                
                .print-subtitle {
                    color: #666;
                    margin: 5px 0 0;
                    font-size: 12px;
                }
                
                .registration-id-box {
                    text-align: center;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    border: 2px dashed #e63946;
                    margin: 15px 0;
                }
                
                .registration-id-label {
                    color: #666;
                    font-size: 11px;
                    margin-bottom: 8px;
                }
                
                .registration-id-number {
                    color: #e63946;
                    font-size: 20px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    font-family: 'Courier New', monospace;
                }
                
                .patient-name {
                    color: #e63946;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 5px 0;
                }
                
                .print-section {
                    margin: 15px 0;
                    page-break-inside: avoid;
                }
                
                .section-title {
                    color: #e63946;
                    font-size: 14px;
                    font-weight: 600;
                    margin: 0 0 10px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid #e63946;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                
                .info-item {
                    margin-bottom: 8px;
                }
                
                .info-label {
                    color: #666;
                    font-size: 10px;
                    font-weight: 500;
                    margin-bottom: 3px;
                }
                
                .info-value {
                    font-size: 11px;
                    font-weight: 400;
                    color: #333;
                    padding: 6px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    border-left: 3px solid #e63946;
                }
                
                .full-width {
                    grid-column: 1 / -1;
                }
                
                .print-footer {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 2px solid #ddd;
                    font-size: 10px;
                    color: #666;
                }
                
                .footer-title {
                    color: #28a745;
                    font-size: 11px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .instruction-list {
                    margin: 0;
                    padding-left: 15px;
                }
                
                .instruction-list li {
                    margin-bottom: 5px;
                }
                
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    
                    .print-container,
                    .print-container * {
                        visibility: visible;
                    }
                    
                    .print-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 10mm;
                    }
                    
                    .no-print {
                        display: none !important;
                    }
                    
                    .page-break {
                        page-break-before: always;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <!-- Header -->
                <div class="print-header">
                    <div class="print-logo">
                        <i class="fas fa-heartbeat"></i>
                    </div>
                    <h1 class="print-title bengali-text">রক্তজবা ফাউন্ডেশন</h1>
                    <p class="print-subtitle bengali-text">১৬ ডিসেম্বর ২০২৫ - বিনামূল্যে মেডিকেল ক্যাম্প</p>
                </div>
                
                <!-- Registration ID -->
                <div class="registration-id-box">
                    <p class="registration-id-label bengali-text">আপনার নিবন্ধন আইডি:</p>
                    <div class="registration-id-number">${document.querySelector('.registration-id-number')?.textContent || ''}</div>
                    <p class="patient-name bengali-text">${document.querySelector('.mobile-info-value')?.textContent || ''}</p>
                </div>
                
                <!-- Patient Information -->
                <div class="print-section">
                    <h3 class="section-title bengali-text">ব্যক্তিগত তথ্য</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label bengali-text">পূর্ণ নাম</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[0]?.textContent || ''}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label bengali-text">বয়স/লিঙ্গ</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[1]?.textContent || ''}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label bengali-text">মোবাইল নম্বর</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[2]?.textContent || ''}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label bengali-text">রক্তের গ্রুপ</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[3]?.textContent || ''}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label bengali-text">জরুরী যোগাযোগ</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[4]?.textContent || ''}</div>
                        </div>
                        <div class="info-item full-width">
                            <div class="info-label bengali-text">ঠিকানা</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[5]?.textContent || ''}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Medical Information -->
                <div class="print-section">
                    <h3 class="section-title bengali-text">চিকিৎসা তথ্য</h3>
                    <div class="info-grid">
                        <div class="info-item full-width">
                            <div class="info-label bengali-text">বর্তমান সমস্যা</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[6]?.textContent || ''}</div>
                        </div>
                        <div class="info-item full-width">
                            <div class="info-label bengali-text">চিকিৎসা ইতিহাস</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[7]?.textContent || ''}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label bengali-text">অ্যালার্জি</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[8]?.textContent || ''}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label bengali-text">পূর্ববর্তী ঔষধ</div>
                            <div class="info-value bengali-text">${document.querySelectorAll('.mobile-info-value')[9]?.textContent || ''}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer Instructions -->
                <div class="print-footer">
                    <h4 class="footer-title bengali-text">গুরুত্বপূর্ণ নির্দেশাবলী:</h4>
                    <ul class="instruction-list bengali-text">
                        <li>তারিখ: ১৬ ডিসেম্বর ২০২৫ (মঙ্গলবার)</li>
                        <li>সময়: সকাল ৮:০০ টা থেকে শুরু</li>
                        <li>স্থান: ভাটিরসুলপুর, এনায়েতনগর, মতলব(উত্তর), চাঁদপুর</li>
                        <li>এই ফর্মটি প্রিন্ট করে আনুন অথবা মোবাইলে সংরক্ষণ করুন</li>
                        <li>জরুরী যোগাযোগ: +880 1960 506 601</li>
                    </ul>
                </div>
            </div>
            
            <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
        </body>
        </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };
}

// ============================================
// UPDATED PATIENT STATUS DISPLAY FOR MOBILE
// ============================================

function displayPatientStatus(patientData) {
    const statusResult = document.getElementById('statusResult');
    if (!statusResult) return;

    // Calculate patient status
    let calculatedStatus;
    if (patientData.checkupCompleted) {
        calculatedStatus = 'Completed';
    } else if (patientData.checkupStarted) {
        calculatedStatus = 'Under Checkup';
    } else {
        calculatedStatus = 'Waiting';
    }

    const status = calculatedStatus;
    const banglaStatus = getBanglaStatus(status);

    let statusIcon, statusColor, statusMessage;

    if (status === 'Waiting') {
        statusIcon = 'fa-clock';
        statusColor = '#ffc107';
        statusMessage = 'আপনি অপেক্ষার তালিকায় আছেন। অনুগ্রহ করে আপনার নির্ধারিত সময়ে ক্যাম্প স্থানে উপস্থিত হন।';
    } else if (status === 'Under Checkup') {
        statusIcon = 'fa-user-md';
        statusColor = '#17a2b8';
        statusMessage = 'আপনার চেকআপ বর্তমানে চলছে। ধৈর্য্য ধরুন, শীঘ্রই সম্পন্ন হবে।';
    } else if (status === 'Completed') {
        statusIcon = 'fa-check-circle';
        statusColor = '#28a745';
        statusMessage = 'আপনার চেকআপ সফলভাবে সম্পন্ন হয়েছে। ডাক্তারের পরামর্শ অনুসরণ করুন।';
    } else if (status === 'Rejected') {
        statusIcon = 'fa-times-circle';
        statusColor = '#dc3545';
        statusMessage = 'আপনার নিবন্ধনটি বাতিল করা হয়েছে। বিস্তারিত জানতে অফিসে যোগাযোগ করুন।';
    } else {
        statusIcon = 'fa-question-circle';
        statusColor = '#6c757d';
        statusMessage = 'স্ট্যাটাস পাওয়া যায়নি।';
    }

    // Mobile-optimized status display
    statusResult.innerHTML = `
        <div class="mobile-status-container animate-fade-in">
            <!-- Status Header -->
            <div class="status-header" style="background: ${statusColor}">
                <div class="status-icon">
                    <i class="fas ${statusIcon}"></i>
                </div>
                <div class="status-title">
                    <h3 class="bengali-text">স্ট্যাটাস চেক</h3>
                    <span class="status-badge-mobile">${banglaStatus}</span>
                </div>
            </div>
            
            <!-- Patient Info Card -->
            <div class="patient-info-card">
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">নিবন্ধন আইডি</span>
                    <span class="info-value-mobile">${patientData.registrationId}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">নাম</span>
                    <span class="info-value-mobile bengali-text">${patientData.fullName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">বয়স/লিঙ্গ</span>
                    <span class="info-value-mobile bengali-text">${patientData.age} বছর / ${patientData.gender}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">মোবাইল</span>
                    <span class="info-value-mobile">${formatBangladeshiPhoneNumber(patientData.phone)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">রক্তের গ্রুপ</span>
                    <span class="info-value-mobile">${patientData.bloodGroup || 'নাই'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">জরুরী যোগাযোগ</span>
                    <span class="info-value-mobile">${patientData.emergencyContact ? formatBangladeshiPhoneNumber(patientData.emergencyContact) : 'নাই'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">ঠিকানা</span>
                    <span class="info-value-mobile">${patientData.address}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">বর্তমান সমস্যা</span>
                    <span class="info-value-mobile">${patientData.currentSymptoms || 'নাই'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">চিকিৎসা ইতিহাস</span>
                    <span class="info-value-mobile">${patientData.medicalHistory || 'নাই'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">অ্যালার্জি</span>
                    <span class="info-value-mobile">${patientData.allergies || 'নাই'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">পূর্ববর্তী ঔষধ</span>
                    <span class="info-value-mobile">${patientData.previousMedications || 'নাই'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label-mobile bengali-text">ডাক্তার</span>
                    <span class="info-value-mobile">${patientData.assignedDoctor || 'Not Assigned'}</span>
                </div>
            </div>
            
            <!-- Progress Timeline -->
            <div class="progress-timeline">
                <div class="timeline-step ${status === 'Waiting' ? 'active' : ''}">
                    <div class="step-icon">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <span class="step-label bengali-text">নিবন্ধিত</span>
                </div>
                <div class="timeline-line ${status !== 'Waiting' ? 'active' : ''}"></div>
                <div class="timeline-step ${status === 'Under Checkup' ? 'active' : ''}">
                    <div class="step-icon">
                        <i class="fas fa-stethoscope"></i>
                    </div>
                    <span class="step-label bengali-text">চেকআপ</span>
                </div>
                <div class="timeline-line ${status === 'Completed' ? 'active' : ''}"></div>
                <div class="timeline-step ${status === 'Completed' ? 'active' : ''}">
                    <div class="step-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <span class="step-label bengali-text">সম্পূর্ণ</span>
                </div>
            </div>
            
            <!-- Status Details -->
            <div class="status-details">
                <div class="detail-card" style="border-left: 4px solid ${statusColor}">
                    <p class="detail-message bengali-text">${statusMessage}</p>
                    <p class="detail-time bengali-text">
                        <i class="fas fa-clock"></i>
                        সর্বশেষ আপডেট: ${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
                <button class="quick-action-btn" onclick="sharePatientStatus('${patientData.registrationId}', '${patientData.fullName}', '${banglaStatus}')">
                    <i class="fas fa-share-alt"></i>
                    <span class="bengali-text">শেয়ার</span>
                </button>
                <button class="quick-action-btn" onclick="copyStatusInfo('${patientData.registrationId}', '${patientData.fullName}', '${banglaStatus}')">
                    <i class="fas fa-copy"></i>
                    <span class="bengali-text">কপি</span>
                </button>
                <button class="quick-action-btn" onclick="checkAnotherStatus()">
                    <i class="fas fa-search"></i>
                    <span class="bengali-text">আরেকটি</span>
                </button>
            </div>
        </div>
    `;

    statusResult.style.display = 'block';
    statusResult.scrollIntoView({ behavior: 'smooth' });
}

// New helper functions for status check
function sharePatientStatus(regId, name, status) {
    const shareText = `রক্তজবা ফাউন্ডেশন - মেডিকেল ক্যাম্প স্ট্যাটাস\n\nনাম: ${name}\nনিবন্ধন আইডি: ${regId}\nস্ট্যাটাস: ${status}\nতারিখ: ১৬ ডিসেম্বর ২০২৫`;
    
    if (navigator.share) {
        navigator.share({
            title: 'রক্তজবা স্ট্যাটাস',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showAlert('স্ট্যাটাস তথ্য কপি করা হয়েছে!', 'success');
        });
    }
}

function copyStatusInfo(regId, name, status) {
    const text = `নাম: ${name}\nনিবন্ধন আইডি: ${regId}\nস্ট্যাটাস: ${status}`;
    navigator.clipboard.writeText(text).then(() => {
        showAlert('স্ট্যাটাস তথ্য কপি করা হয়েছে!', 'success');
    });
}

function checkAnotherStatus() {
    document.getElementById('statusResult').style.display = 'none';
    document.getElementById('checkRegistrationId').value = '';
    document.getElementById('checkRegistrationId').focus();
}
