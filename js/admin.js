// Firebase-এ Admin ইউজার তৈরি করার ফাংশন
async function createFirebaseAdminUsers() {
    try {
        // শুধুমাত্র ডেভেলপমেন্ট এনভায়রনমেন্টে চালানো হবে
        const isDev = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

        if (!isDev) return;

        const adminUsers = [
            {
                email: 'admintasrik@rjfmedical.com',
                password: 'Admin@123',
                displayName: 'Tasrik Hossain "Admin & Founder"'
            },
            {
                email: 'admin@rjfmedical.com',
                password: 'Admin@123',
                displayName: 'FMC "Admin"'
            }
        ];

        for (const user of adminUsers) {
            try {
                // চেক করুন ইউজার ইতিমধ্যে আছে কিনা
                const signInMethods = await auth.fetchSignInMethodsForEmail(user.email);

                if (signInMethods.length === 0) {
                    // নতুন ইউজার তৈরি করুন
                    const userCredential = await auth.createUserWithEmailAndPassword(
                        user.email,
                        user.password
                    );

                    // ডিসপ্লে নেম আপডেট করুন
                    await userCredential.user.updateProfile({
                        displayName: user.displayName
                    });

                    console.log(`Admin user created: ${user.email}`);

                    // Firestore-এ Admin ডকুমেন্ট তৈরি করুন
                    await db.collection('admins').doc(userCredential.user.uid).set({
                        uid: userCredential.user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        role: 'super_admin',
                        permissions: ['all'],
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                        status: 'active'
                    });

                    // লগআউট করুন (বিকাশের জন্য)
                    await auth.signOut();
                } else {
                    console.log(`Admin user already exists: ${user.email}`);
                }
            } catch (error) {
                console.error(`Error creating admin user ${user.email}:`, error.message);
            }
        }

        console.log('Admin user creation process completed.');

    } catch (error) {
        console.error('Error in createFirebaseAdminUsers:', error);
    }
}

// Admin login page লোড হলে এই ফাংশন কল করুন
function initAdminLoginPage() {
    // Admin users তৈরি করুন (শুধু ডেভেলপমেন্টে)
    createFirebaseAdminUsers();

    // Existing login logic
    initAdminLogin();
}

// DOMContentLoaded event এ initAdminLoginPage কল করুন
document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'admin-login.html') {
        initAdminLoginPage();
    }
});

// Admin Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAdminAuth();

    // Initialize Admin Dashboard
    function initAdminDashboard() {
        console.log('Initializing admin dashboard...');

        // Check authentication first
        if (!checkAdminAuth()) {
            return;
        }

        // Update user info
        updateUserInfoFromStorage();

        // Load dashboard stats
        updateDashboardStats();

        // Initialize charts
        initCharts();

        // Setup real-time listeners
        setupRealtimeListeners();

        // Initialize add functionality
        initAddPatient();
        initAddDoctor();
        initAddVolunteer();

        // Initialize advanced search
        initAdvancedPatientSearch();

        console.log('Admin dashboard initialized successfully');
    }

    // Helper function to update user info from storage
    function updateUserInfoFromStorage() {
        const localAuth = localStorage.getItem('adminAuth');
        if (localAuth) {
            try {
                const authData = JSON.parse(localAuth);
                const userAvatar = document.getElementById('userAvatar');
                const userName = document.getElementById('userName');
                const userEmail = document.getElementById('userEmail');

                if (userAvatar) {
                    const initials = authData.email.substring(0, 2).toUpperCase();
                    userAvatar.textContent = initials;
                }

                if (userName) {
                    userName.textContent = authData.displayName || authData.email.split('@')[0];
                }

                if (userEmail) {
                    userEmail.textContent = authData.email;
                }
            } catch (error) {
                console.error('Error parsing auth data:', error);
            }
        }
    }

    // Initialize sidebar toggle
    initSidebarToggle();

    // Initialize logout functionality
    initLogout();

    // Initialize admin modules based on current page
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'admin-dashboard.html') {
        initDashboardStats();
        initPatientManagement();
        initDoctorManagement();
        initVolunteerManagement();

        // Initialize add buttons
        initAddPatient();
        initAddDoctor();
        initAddVolunteer();

        // Initialize advanced search
        initAdvancedPatientSearch();
    }

    // If on login page, initialize login
    if (currentPage === 'admin-login.html') {
        initAdminLogin();
    }
});

// Check Admin Authentication - Simplified Version
function checkAdminAuth() {
    const isLoginPage = window.location.pathname.includes('admin-login.html');

    // Primary check: localStorage
    const localAuth = localStorage.getItem('adminAuth');
    const sessionAuth = sessionStorage.getItem('currentAdmin');

    if (localAuth || sessionAuth) {
        console.log('Auth found in storage, user authenticated');
        return true;
    }

    // Secondary check: Firebase auth
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged((user) => {
            console.log('Firebase auth state changed:', user ? 'User found' : 'No user');

            if (user && !isLoginPage) {
                // User is logged in and on admin page
                console.log('User authenticated via Firebase:', user.email);
                updateUserInfo(user);
                return;
            }

            if (!user && !isLoginPage) {
                // No user and not on login page, redirect
                console.log('No user found, redirecting to login');
                window.location.href = 'admin-login.html';
            }

            if (user && isLoginPage) {
                // User logged in but on login page, redirect to dashboard
                console.log('User already logged in, redirecting to dashboard');
                window.location.href = 'admin-dashboard.html';
            }
        });
    } else {
        console.log('Firebase auth not available');
        if (!isLoginPage && !localAuth && !sessionAuth) {
            window.location.href = 'admin-login.html';
        }
    }
}

// Helper function to set custom claims
async function setCustomAdminClaim(uid) {
    try {
        // This would typically call a Firebase Function
        // For now, just store in localStorage
        localStorage.setItem('adminAuth', JSON.stringify({
            uid: uid,
            isAdmin: true,
            timestamp: new Date().getTime()
        }));
    } catch (error) {
        console.error('Error setting admin claim:', error);
    }
}

// admin.js ফাইলে নিচের ফাংশনটি যোগ করুন অথবা সংশোধন করুন

// Enhanced Admin Login Function
function initAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;

        console.log('Login attempt for:', email);

        if (!email || !password) {
            showAlert('Please enter both email and password', 'danger');
            return;
        }

        // Submit button loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;

        try {
            // Firebase authentication
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            console.log('Firebase login successful:', user.email);
            console.log('User displayName:', user.displayName);

            // Get the user's ID token
            const idToken = await user.getIdToken();
            console.log('User ID Token:', idToken.substring(0, 20) + '...');

            // Custom display name mapping based on email
            let displayName = user.displayName;

            // If Firebase displayName is not set, use email-based mapping
            if (!displayName || displayName === '') {
                if (email === 'admintasrik@rjfmedical.com') {
                    displayName = 'Tasrik Hossain "Admin & Founder"';
                } else if (email === 'admin@rjfmedical.com') {
                    displayName = 'FMC "Admin"';
                } else {
                    // Default: use email prefix
                    displayName = user.email.split('@')[0];
                }

                // Update Firebase profile with display name
                try {
                    await user.updateProfile({
                        displayName: displayName
                    });
                    console.log('Updated displayName in Firebase:', displayName);
                } catch (updateError) {
                    console.warn('Could not update Firebase profile:', updateError);
                }
            }

            // Check if user is admin (you can add custom logic here)
            // For now, we'll allow any authenticated user with the admin email domain
            if (email.includes('@rjfmedical.com') || email.includes('@roktojoba.org')) {
                // Store user info in localStorage with correct display name
                localStorage.setItem('adminAuth', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: displayName,  // Use the mapped display name
                    isAdmin: true,
                    token: idToken,
                    timestamp: new Date().getTime(),
                    firebaseAuth: true
                }));

                // Also store in sessionStorage for immediate access
                sessionStorage.setItem('currentAdmin', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    displayName: displayName,  // Use the mapped display name
                    loggedIn: true,
                    token: idToken
                }));

                // Check if admin exists in Firestore, if not create one
                try {
                    const adminDoc = await db.collection('admins').doc(user.uid).get();

                    if (!adminDoc.exists) {
                        console.log('Creating admin record in Firestore');
                        await db.collection('admins').doc(user.uid).set({
                            uid: user.uid,
                            email: user.email,
                            displayName: displayName,  // Use the mapped display name
                            role: 'admin',
                            permissions: ['all'],
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    } else {
                        // Update last login time and display name
                        await db.collection('admins').doc(user.uid).update({
                            displayName: displayName,  // Update display name in Firestore too
                            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                        });
                    }
                } catch (firestoreError) {
                    console.warn('Firestore admin check error:', firestoreError);
                    // Continue even if Firestore fails
                }

                showAlert('Login successful! Redirecting to dashboard...', 'success');

                // Force token refresh
                await user.getIdToken(true);

                // Wait a bit then redirect
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html';
                }, 1000);

            } else {
                // Not an admin email
                await auth.signOut();
                localStorage.removeItem('adminAuth');
                sessionStorage.removeItem('currentAdmin');

                showAlert('Access denied. This email is not authorized for admin access.', 'danger');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }

        } catch (error) {
            console.error('Firebase login error:', error);

            // Clear any existing auth data
            localStorage.removeItem('adminAuth');
            sessionStorage.removeItem('currentAdmin');

            let errorMessage = 'Login failed. ';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage += 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage += 'This account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage += 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage += 'Incorrect password.';
                    break;
                case 'auth/invalid-login-credentials':
                    errorMessage += 'Invalid email or password.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage += 'Network error. Please check your internet connection.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += 'Too many login attempts. Please try again later.';
                    break;
                default:
                    errorMessage += error.message || 'An unknown error occurred.';
            }

            showAlert(errorMessage, 'danger');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Also update the user info update function to ensure correct display name is shown
function updateUserInfo(user) {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');

    if (userAvatar) {
        const initials = (user.displayName || user.email).substring(0, 2).toUpperCase();
        userAvatar.textContent = initials;
    }

    if (userName) {
        // Use displayName from user object or fallback to email mapping
        let displayName = user.displayName;
        if (!displayName || displayName === '') {
            if (user.email === 'admintasrik@rjfmedical.com') {
                displayName = 'Tasrik Hossain "Admin & Founder"';
            } else if (user.email === 'admin@rjfmedical.com') {
                displayName = 'FMC "Admin"';
            } else {
                displayName = user.email.split('@')[0];
            }
        }
        userName.textContent = displayName;
    }

    if (userEmail) {
        userEmail.textContent = user.email;
    }
}

// Update the initialization function to use localStorage data properly
function updateUserInfoFromStorage() {
    const localAuth = localStorage.getItem('adminAuth');
    if (localAuth) {
        try {
            const authData = JSON.parse(localAuth);
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');

            if (userAvatar) {
                const initials = (authData.displayName || authData.email).substring(0, 2).toUpperCase();
                userAvatar.textContent = initials;
            }

            if (userName) {
                // Use stored displayName or fallback to email mapping
                let displayName = authData.displayName;
                if (!displayName || displayName === '') {
                    if (authData.email === 'admintasrik@rjfmedical.com') {
                        displayName = 'Tasrik Hossain "Admin & Founder"';
                    } else if (authData.email === 'admin@rjfmedical.com') {
                        displayName = 'FMC "Admin"';
                    } else {
                        displayName = authData.email.split('@')[0];
                    }
                }
                userName.textContent = displayName;
            }

            if (userEmail) {
                userEmail.textContent = authData.email;
            }
        } catch (error) {
            console.error('Error parsing auth data:', error);
        }
    }
}

// Update User Info in Header
function updateUserInfo(user) {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    const userEmail = document.querySelector('.user-email');

    if (userAvatar) {
        const initials = user.email.substring(0, 2).toUpperCase();
        userAvatar.textContent = initials;
    }

    if (userName) {
        userName.textContent = user.displayName || user.email.split('@')[0];
    }

    if (userEmail) {
        userEmail.textContent = user.email;
    }
}

// Initialize Sidebar Toggle
function initSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (event) {
        if (window.innerWidth <= 992) {
            if (!event.target.closest('.admin-sidebar') &&
                !event.target.closest('.mobile-menu-toggle') &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Initialize Logout
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function () {
            try {
                // Clear all auth storage
                localStorage.removeItem('adminAuth');
                sessionStorage.removeItem('currentAdmin');
                localStorage.removeItem('firebase:authUser:*');

                // Clear Firebase auth
                if (typeof auth !== 'undefined') {
                    await auth.signOut();
                }

                // Clear auth manager
                if (typeof window.authManager !== 'undefined') {
                    window.authManager.clearAuth();
                }

                // Redirect to login
                window.location.href = 'admin-login.html';

            } catch (error) {
                console.error('Logout error:', error);
                // Still redirect even if error
                window.location.href = 'admin-login.html';
            }
        });
    }
}

// Initialize Dashboard Statistics
async function initDashboardStats() {
    // Fetch and display real-time stats
    await updateDashboardStats();

    // Initialize charts
    initCharts();

    // Set up real-time listeners
    setupRealtimeListeners();
}

// Update Dashboard Statistics
async function updateDashboardStats() {
    try {
        // Get counts from Firestore
        const [
            patientsSnapshot,
            doctorsSnapshot,
            volunteersSnapshot,
            completedPatientsSnapshot
        ] = await Promise.all([
            db.collection('patients').get(),
            db.collection('doctors').get(),
            db.collection('volunteers').get(),
            db.collection('patients').where('checkupCompleted', '==', true).get()
        ]);

        // Calculate waiting patients
        const waitingPatients = patientsSnapshot.docs.filter(doc => {
            const data = doc.data();
            return !data.checkupStarted && !data.checkupCompleted;
        }).length;

        // Calculate ongoing checkups
        const ongoingPatients = patientsSnapshot.docs.filter(doc => {
            const data = doc.data();
            return data.checkupStarted && !data.checkupCompleted;
        }).length;

        // Update stats cards
        document.getElementById('totalPatientsCount').textContent = patientsSnapshot.size;
        document.getElementById('waitingPatientsCount').textContent = waitingPatients;
        document.getElementById('ongoingPatientsCount').textContent = ongoingPatients;
        document.getElementById('completedPatientsCount').textContent = completedPatientsSnapshot.size;
        document.getElementById('totalDoctorsCount').textContent = doctorsSnapshot.size;
        document.getElementById('totalVolunteersCount').textContent = volunteersSnapshot.size;

        // Calculate average wait time
        const completedPatients = completedPatientsSnapshot.docs.map(doc => doc.data());
        if (completedPatients.length > 0) {
            const totalWaitTime = completedPatients.reduce((sum, patient) => {
                if (patient.waitTime) return sum + patient.waitTime;
                return sum;
            }, 0);

            const avgWaitTime = Math.round(totalWaitTime / completedPatients.length);
            document.getElementById('avgWaitTime').textContent = `${avgWaitTime} min`;
        }

    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

// Initialize Charts
function initCharts() {
    // Patient Status Chart
    const patientStatusCtx = document.getElementById('patientStatusChart');
    if (patientStatusCtx) {
        new Chart(patientStatusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Waiting', 'Under Checkup', 'Completed'],
                datasets: [{
                    data: [
                        parseInt(document.getElementById('waitingPatientsCount').textContent),
                        parseInt(document.getElementById('ongoingPatientsCount').textContent),
                        parseInt(document.getElementById('completedPatientsCount').textContent)
                    ],
                    backgroundColor: [
                        '#e9c46a',
                        '#457b9d',
                        '#2a9d8f'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Daily Registration Chart
    const dailyRegCtx = document.getElementById('dailyRegistrationChart');
    if (dailyRegCtx) {
        // This would typically come from Firebase data
        new Chart(dailyRegCtx, {
            type: 'line',
            data: {
                labels: ['Dec 1', 'Dec 2', 'Dec 3', 'Dec 4', 'Dec 5', 'Dec 6', 'Today'],
                datasets: [{
                    label: 'Patient Registrations',
                    data: [12, 19, 15, 25, 22, 30, 28],
                    backgroundColor: 'rgba(230, 57, 70, 0.1)',
                    borderColor: 'rgb(230, 57, 70)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Setup Realtime Listeners
function setupRealtimeListeners() {
    // Listen for patient updates
    db.collection('patients').onSnapshot(snapshot => {
        updateDashboardStats();
        if (typeof window.loadPatientsTable === 'function') {
            window.loadPatientsTable();
        }
    });

    // Listen for doctor updates
    db.collection('doctors').onSnapshot(snapshot => {
        updateDashboardStats();
        if (typeof window.loadDoctorsTable === 'function') {
            window.loadDoctorsTable();
        }
    });

    // Listen for volunteer updates
    db.collection('volunteers').onSnapshot(snapshot => {
        updateDashboardStats();
        if (typeof window.loadVolunteersTable === 'function') {
            window.loadVolunteersTable();
        }
    });
}

// Initialize Patient Management
async function initPatientManagement() {
    // Load patients table
    await loadPatientsTable();

    // Initialize search and filter
    initPatientSearch();

    // Initialize patient actions
    initPatientActions();
}

// Load Patients Table - Updated with 2 buttons per row
async function loadPatientsTable() {
    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;

    try {
        // Default: Newest to Oldest (registrationDate descending)
        const snapshot = await db.collection('patients')
            .orderBy('registrationDate', 'desc') // Newest first
            .limit(100)
            .get();

        tableBody.innerHTML = '';

        if (snapshot.empty) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="10" class="text-center">No patients found</td>
                </tr>
            `;
            return;
        }

        snapshot.forEach(doc => {
            const patient = doc.data();
            const status = calculatePatientStatus(patient);
            const statusClass = `status-${status.toLowerCase().replace(' ', '-')}`;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.registrationId}</td>
                <td>${patient.fullName}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${formatPhoneNumber(patient.phone)}</td>
                <td>${formatFirestoreTimestamp(patient.registrationDate)}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${status}
                    </span>
                </td>
                <td>${patient.assignedDoctor || 'Not Assigned'}</td>
                <td>
                    <div class="action-buttons-grid">
                        <div class="action-row">
                            <button class="btn-action view-patient" data-id="${doc.id}" title="View Details">
                                <i class="fas fa-eye"></i>
                                <span>View</span>
                            </button>
                            <button class="btn-action edit-patient" data-id="${doc.id}" title="Edit Patient">
                                <i class="fas fa-edit"></i>
                                <span>Edit</span>
                            </button>
                        </div>
                        <div class="action-row">
                            <button class="btn-action assign-doctor" data-id="${doc.id}" title="Assign Doctor">
                                <i class="fas fa-user-md"></i>
                                <span>Assign</span>
                            </button>
                            <button class="btn-action update-status" data-id="${doc.id}" title="Update Status">
                                <i class="fas fa-sync-alt"></i>
                                <span>Status</span>
                            </button>
                        </div>
                        <div class="action-row">
                            <button class="btn-action remove-patient text-danger" data-id="${doc.id}" title="Remove Patient">
                                <i class="fas fa-trash"></i>
                                <span>Remove</span>
                            </button>
                        </div>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        addPatientActionListeners();

    } catch (error) {
        console.error('Error loading patients:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center error">Error loading patients</td>
            </tr>
        `;
    }
}

// CSS স্টাইল যোগ করতে হবে:
const actionButtonsCSS = `
<style>
.action-buttons-grid {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.action-row {
    display: flex;
    gap: 5px;
}

.action-row .btn-action {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5px;
    min-width: 60px;
    min-height: 40px;
    font-size: 0.8rem;
}

.action-row .btn-action i {
    font-size: 0.9rem;
    margin-bottom: 2px;
}

.action-row .btn-action span {
    font-size: 0.7rem;
    display: block;
}

/* For mobile responsiveness */
@media (max-width: 768px) {
    .action-buttons-grid {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 3px;
    }
    
    .action-row {
        flex-direction: column;
        width: 48%;
    }
}
</style>
`;

// CSS ইনজেক্ট করুন
document.head.insertAdjacentHTML('beforeend', actionButtonsCSS);

// Initialize Patient Search
function initPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    if (!searchInput) return;

    let searchTimeout;

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchPatients(this.value);
        }, 500);
    });
}

// Search Patients
async function searchPatients(searchTerm) {
    if (!searchTerm.trim()) {
        await loadPatientsTable();
        return;
    }

    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;

    try {
        // Show loading state
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i> Searching...
                    </div>
                </td>
            </tr>
        `;

        // Get all patients first (better performance for small datasets)
        const snapshot = await db.collection('patients')
            .orderBy('registrationDate', 'desc')
            .limit(200)
            .get();

        if (snapshot.empty) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="no-results">
                            <i class="fas fa-search"></i>
                            <p>No patients found for "${searchTerm}"</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Filter locally for better performance
        const searchLower = searchTerm.toLowerCase();
        const filteredPatients = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(patient => {
                return (
                    (patient.registrationId && patient.registrationId.toLowerCase().includes(searchLower)) ||
                    (patient.fullName && patient.fullName.toLowerCase().includes(searchLower)) ||
                    (patient.phone && patient.phone.includes(searchTerm)) ||
                    (patient.email && patient.email.toLowerCase().includes(searchLower))
                );
            });

        if (filteredPatients.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="no-results">
                            <i class="fas fa-search"></i>
                            <p>No patients found for "${searchTerm}"</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Display filtered patients
        displayFilteredPatients(filteredPatients);

    } catch (error) {
        console.error('Error searching patients:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center error">
                    <i class="fas fa-exclamation-circle"></i> Error searching: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Add Patient Action Listeners
function addPatientActionListeners() {
    // View patient details
    document.querySelectorAll('.view-patient').forEach(btn => {
        btn.addEventListener('click', function () {
            const patientId = this.getAttribute('data-id');
            viewPatientDetails(patientId);
        });
    });

    // Edit patient
    document.querySelectorAll('.edit-patient').forEach(btn => {
        btn.addEventListener('click', function () {
            const patientId = this.getAttribute('data-id');
            editPatient(patientId);
        });
    });

    // Assign doctor
    document.querySelectorAll('.assign-doctor').forEach(btn => {
        btn.addEventListener('click', function () {
            const patientId = this.getAttribute('data-id');
            assignDoctorToPatient(patientId);
        });
    });

    // Update status
    document.querySelectorAll('.update-status').forEach(btn => {
        btn.addEventListener('click', function () {
            const patientId = this.getAttribute('data-id');
            updatePatientStatus(patientId);
        });
    });

    // Remove patient
    document.querySelectorAll('.remove-patient').forEach(btn => {
        btn.addEventListener('click', function () {
            const patientId = this.getAttribute('data-id');
            const patientName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            removePatient(patientId, patientName);
        });
    });
}

// View Patient Details
async function viewPatientDetails(patientId) {
    try {
        const doc = await db.collection('patients').doc(patientId).get();

        if (!doc.exists) {
            showAlert('Patient not found', 'danger');
            return;
        }

        const patient = doc.data();
        const status = calculatePatientStatus(patient);

        // Create modal with patient details
        const modalContent = `
            <div class="modal-header">
                <h3>Patient Details - ${patient.registrationId}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="patient-details-grid">
                    <div class="detail-group">
                        <h4>Personal Information</h4>
                        <p><strong>Full Name:</strong> ${patient.fullName}</p>
                        <p><strong>Age:</strong> ${patient.age} | <strong>Gender:</strong> ${patient.gender}</p>
                        <p><strong>Phone:</strong> ${formatPhoneNumber(patient.phone)}</p>
                        <p><strong>Email:</strong> ${patient.email || 'N/A'}</p>
                        <p><strong>Address:</strong> ${patient.address}</p>
                        <p><strong>Emergency Contact:</strong> ${formatPhoneNumber(patient.emergencyContact) || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Medical Information</h4>
                        <p><strong>Blood Group:</strong> ${patient.bloodGroup || 'Not specified'}</p>
                        <p><strong>Allergies:</strong> ${patient.allergies || 'None reported'}</p>
                        <p><strong>Medical History:</strong> ${patient.medicalHistory || 'None reported'}</p>
                        <p><strong>Current Symptoms:</strong> ${patient.currentSymptoms || 'None reported'}</p>
                        <p><strong>Previous Medications:</strong> ${patient.previousMedications || 'None reported'}</p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Camp Information</h4>
                        <p><strong>Registration Date:</strong> ${formatFirestoreTimestamp(patient.registrationDate)}</p>
                        <p><strong>Status:</strong> <span class="status-badge status-${status.toLowerCase().replace(' ', '-')}">${status}</span></p>
                        <p><strong>Assigned Doctor:</strong> ${patient.assignedDoctor || 'Not assigned'}</p>
                        ${patient.checkupStartTime ? `<p><strong>Checkup Started:</strong> ${formatFirestoreTimestamp(patient.checkupStartTime)}</p>` : ''}
                        ${patient.checkupEndTime ? `<p><strong>Checkup Completed:</strong> ${formatFirestoreTimestamp(patient.checkupEndTime)}</p>` : ''}
                        ${patient.waitTime ? `<p><strong>Wait Time:</strong> ${patient.waitTime} minutes</p>` : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Close</button>
                <button class="btn btn-primary print-details">Print Details</button>
            </div>
        `;

        showModal(modalContent);

        // Add event listeners
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.querySelector('.print-details').addEventListener('click', () => printPatientDetails(patient));

    } catch (error) {
        console.error('Error viewing patient details:', error);
        showAlert('Error loading patient details', 'danger');
    }
}

// Assign Doctor to Patient
async function assignDoctorToPatient(patientId) {
    try {
        // Fetch available doctors
        const doctorsSnapshot = await db.collection('doctors')
            .where('isActive', '==', true)
            .get();

        if (doctorsSnapshot.empty) {
            showAlert('No active doctors available', 'warning');
            return;
        }

        const doctors = doctorsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Create modal with doctor selection
        const optionsHtml = doctors.map(doctor =>
            `<option value="${doctor.id}">Dr. ${doctor.fullName} (${doctor.specialization})</option>`
        ).join('');

        const modalContent = `
            <div class="modal-header">
                <h3>Assign Doctor</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="doctorSelect" class="form-label">Select Doctor:</label>
                    <select id="doctorSelect" class="form-control">
                        <option value="">-- Select a doctor --</option>
                        ${optionsHtml}
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary assign-doctor-btn">Assign Doctor</button>
            </div>
        `;

        showModal(modalContent);

        // Add event listeners
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.querySelector('.assign-doctor-btn').addEventListener('click', async () => {
            const doctorId = document.getElementById('doctorSelect').value;
            if (!doctorId) {
                showAlert('Please select a doctor', 'warning');
                return;
            }

            const selectedDoctor = doctors.find(d => d.id === doctorId);

            try {
                await db.collection('patients').doc(patientId).update({
                    assignedDoctor: `Dr. ${selectedDoctor.fullName}`,
                    assignedDoctorId: doctorId,
                    updatedAt: new Date()
                });

                showAlert('Doctor assigned successfully', 'success');
                closeModal();
                loadPatientsTable();

            } catch (error) {
                console.error('Error assigning doctor:', error);
                showAlert('Error assigning doctor', 'danger');
            }
        });

    } catch (error) {
        console.error('Error in assignDoctorToPatient:', error);
        showAlert('Error loading doctors', 'danger');
    }
}

// Update Patient Status - KEPT AS REQUESTED
async function updatePatientStatus(patientId) {
    try {
        const doc = await db.collection('patients').doc(patientId).get();

        if (!doc.exists) {
            showAlert('Patient not found', 'danger');
            return;
        }

        const patient = doc.data();
        const currentStatus = calculatePatientStatus(patient);

        // Create modal with status options
        const modalContent = `
            <div class="modal-header">
                <h3>Update Patient Status</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Current Status: <strong>${currentStatus}</strong></label>
                </div>
                <div class="form-group">
                    <label for="statusSelect" class="form-label">Update Status To:</label>
                    <select id="statusSelect" class="form-control">
                        <option value="">-- Select new status --</option>
                        <option value="checkupStarted" ${currentStatus === 'Waiting' ? 'selected' : ''}>Start Checkup</option>
                        <option value="checkupCompleted" ${currentStatus === 'Under Checkup' ? 'selected' : ''}>Complete Checkup</option>
                        <option value="reset">Reset to Waiting</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary update-status-btn">Update Status</button>
            </div>
        `;

        showModal(modalContent);

        // Add event listeners
        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.querySelector('.update-status-btn').addEventListener('click', async () => {
            const statusAction = document.getElementById('statusSelect').value;

            if (!statusAction) {
                showAlert('Please select a status action', 'warning');
                return;
            }

            try {
                const updateData = {};
                const now = new Date();

                switch (statusAction) {
                    case 'checkupStarted':
                        updateData.checkupStarted = true;
                        updateData.checkupStartTime = now;
                        updateData.waitTime = Math.floor((now - patient.registrationDate.toDate()) / (1000 * 60));
                        break;
                    case 'checkupCompleted':
                        updateData.checkupCompleted = true;
                        updateData.checkupEndTime = now;
                        break;
                    case 'reset':
                        updateData.checkupStarted = false;
                        updateData.checkupCompleted = false;
                        updateData.checkupStartTime = null;
                        updateData.checkupEndTime = null;
                        break;
                }

                updateData.updatedAt = now;
                await db.collection('patients').doc(patientId).update(updateData);

                showAlert('Patient status updated successfully', 'success');
                closeModal();
                loadPatientsTable();

            } catch (error) {
                console.error('Error updating status:', error);
                showAlert('Error updating status', 'danger');
            }
        });

    } catch (error) {
        console.error('Error in updatePatientStatus:', error);
        showAlert('Error loading patient data', 'danger');
    }
}

// Edit Patient Function
async function editPatient(patientId) {
    try {
        const doc = await db.collection('patients').doc(patientId).get();

        if (!doc.exists) {
            showAlert('Patient not found', 'danger');
            return;
        }

        const patient = doc.data();

        const modalContent = `
            <div class="modal-header">
                <h3>Edit Patient - ${patient.fullName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editPatientForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <input type="text" class="form-control" id="editPatientName" value="${patient.fullName}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Age *</label>
                            <input type="number" class="form-control" id="editPatientAge" value="${patient.age}" min="1" max="120" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Gender *</label>
                            <select class="form-control" id="editPatientGender" required>
                                <option value="">Select Gender</option>
                                <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Other" ${patient.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <input type="tel" class="form-control" id="editPatientPhone" value="${patient.phone}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="editPatientEmail" value="${patient.email || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Address *</label>
                        <textarea class="form-control" id="editPatientAddress" rows="2" required>${patient.address}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Blood Group</label>
                            <select class="form-control" id="editPatientBloodGroup">
                                <option value="">Select Blood Group</option>
                                <option value="A+" ${patient.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                                <option value="A-" ${patient.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                                <option value="B+" ${patient.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                                <option value="B-" ${patient.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                                <option value="O+" ${patient.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                                <option value="O-" ${patient.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                                <option value="AB+" ${patient.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                                <option value="AB-" ${patient.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Emergency Contact</label>
                            <input type="tel" class="form-control" id="editPatientEmergencyContact" value="${patient.emergencyContact || ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Medical History</label>
                        <textarea class="form-control" id="editPatientMedicalHistory" rows="2">${patient.medicalHistory || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Current Symptoms</label>
                        <textarea class="form-control" id="editPatientSymptoms" rows="2">${patient.currentSymptoms || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Allergies</label>
                        <textarea class="form-control" id="editPatientAllergies" rows="2">${patient.allergies || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Previous Medications</label>
                        <textarea class="form-control" id="editPatientMedications" rows="2">${patient.previousMedications || ''}</textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary" id="updatePatientBtn">Update Patient</button>
            </div>
        `;

        showModal(modalContent);

        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.getElementById('updatePatientBtn').addEventListener('click', async () => {
            await updatePatient(patientId);
        });

    } catch (error) {
        console.error('Error editing patient:', error);
        showAlert('Error loading patient data', 'danger');
    }
}

// Update Patient Information
async function updatePatient(patientId) {
    const form = document.getElementById('editPatientForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    try {
        const submitBtn = document.getElementById('updatePatientBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;

        const updateData = {
            fullName: document.getElementById('editPatientName').value.trim(),
            age: parseInt(document.getElementById('editPatientAge').value),
            gender: document.getElementById('editPatientGender').value,
            phone: document.getElementById('editPatientPhone').value.trim(),
            email: document.getElementById('editPatientEmail').value.trim() || '',
            address: document.getElementById('editPatientAddress').value.trim(),
            bloodGroup: document.getElementById('editPatientBloodGroup').value || '',
            emergencyContact: document.getElementById('editPatientEmergencyContact').value.trim() || '',
            medicalHistory: document.getElementById('editPatientMedicalHistory').value.trim() || '',
            currentSymptoms: document.getElementById('editPatientSymptoms').value.trim() || '',
            allergies: document.getElementById('editPatientAllergies').value.trim() || '',
            previousMedications: document.getElementById('editPatientMedications').value.trim() || '',
            updatedAt: new Date()
        };

        await db.collection('patients').doc(patientId).update(updateData);

        showAlert('Patient updated successfully!', 'success');
        closeModal();
        loadPatientsTable();

    } catch (error) {
        console.error('Error updating patient:', error);
        showAlert('Error updating patient: ' + error.message, 'danger');
    } finally {
        const submitBtn = document.getElementById('updatePatientBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Update Patient';
            submitBtn.disabled = false;
        }
    }
}

// Remove Patient Function
async function removePatient(patientId, patientName) {
    const confirmDelete = confirm(`Are you sure you want to remove patient: ${patientName}?\n\nThis action cannot be undone.`);

    if (!confirmDelete) return;

    try {
        await db.collection('patients').doc(patientId).delete();
        showAlert(`Patient "${patientName}" removed successfully!`, 'success');

        // Refresh table
        loadPatientsTable();
        if (typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }

    } catch (error) {
        console.error('Error removing patient:', error);
        showAlert('Error removing patient: ' + error.message, 'danger');
    }
}

// Print Patient Details
function printPatientDetails(patient) {
    const printWindow = window.open('', '_blank');
    const status = calculatePatientStatus(patient);

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Patient Details - ${patient.registrationId}</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                h1 { color: #333; border-bottom: 2px solid #e63946; padding-bottom: 10px; }
                .detail-section { margin-bottom: 30px; }
                .detail-section h3 { color: #1d3557; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                .detail-row { display: flex; margin-bottom: 10px; }
                .detail-label { font-weight: bold; width: 200px; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <h1>Roktojoba Foundation - Patient Details</h1>
            <div class="detail-section">
                <h3>Personal Information</h3>
                <div class="detail-row">
                    <div class="detail-label">Registration ID:</div>
                    <div>${patient.registrationId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Full Name:</div>
                    <div>${patient.fullName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Age / Gender:</div>
                    <div>${patient.age} / ${patient.gender}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Phone:</div>
                    <div>${formatPhoneNumber(patient.phone)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Address:</div>
                    <div>${patient.address}</div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Medical Information</h3>
                <div class="detail-row">
                    <div class="detail-label">Blood Group:</div>
                    <div>${patient.bloodGroup || 'Not specified'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Medical History:</div>
                    <div>${patient.medicalHistory || 'None reported'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Current Symptoms:</div>
                    <div>${patient.currentSymptoms || 'None reported'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Allergies:</div>
                    <div>${patient.allergies || 'None reported'}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Previous Medications:</div>
                    <div>${patient.previousMedications || 'None reported'}</div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3>Medical Camp Information</h3>
                <div class="detail-row">
                    <div class="detail-label">Registration Date:</div>
                    <div>${formatFirestoreTimestamp(patient.registrationDate)}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Status:</div>
                    <div>${status}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Assigned Doctor:</div>
                    <div>${patient.assignedDoctor || 'Not assigned'}</div>
                </div>
                ${patient.checkupStartTime ? `
                <div class="detail-row">
                    <div class="detail-label">Checkup Started:</div>
                    <div>${formatFirestoreTimestamp(patient.checkupStartTime)}</div>
                </div>
                ` : ''}
                ${patient.checkupEndTime ? `
                <div class="detail-row">
                    <div class="detail-label">Checkup Completed:</div>
                    <div>${formatFirestoreTimestamp(patient.checkupEndTime)}</div>
                </div>
                ` : ''}
                ${patient.waitTime ? `
                <div class="detail-row">
                    <div class="detail-label">Wait Time:</div>
                    <div>${patient.waitTime} minutes</div>
                </div>
                ` : ''}
            </div>
            
            <div class="footer">
                <p>Printed on: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</p>
                <p>Roktojoba Foundation - Free Medical Camp | 16 December 2025 | Designed & Developed by Tasrik Hossain</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// Modal Utility Functions
function showModal(content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="modal-content">
            ${content}
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Add close event
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.remove();
        document.body.style.overflow = '';
    }
}

// Initialize Patient Actions (Event Delegation)
function initPatientActions() {
    document.addEventListener('click', function (e) {
        // View patient details
        if (e.target.closest('.view-patient')) {
            const patientId = e.target.closest('.view-patient').getAttribute('data-id');
            viewPatientDetails(patientId);
        }

        // Edit patient
        if (e.target.closest('.edit-patient')) {
            const patientId = e.target.closest('.edit-patient').getAttribute('data-id');
            editPatient(patientId);
        }

        // Assign doctor
        if (e.target.closest('.assign-doctor')) {
            const patientId = e.target.closest('.assign-doctor').getAttribute('data-id');
            assignDoctorToPatient(patientId);
        }

        // Update status
        if (e.target.closest('.update-status')) {
            const patientId = e.target.closest('.update-status').getAttribute('data-id');
            updatePatientStatus(patientId);
        }

        // Remove patient
        if (e.target.closest('.remove-patient')) {
            const patientId = e.target.closest('.remove-patient').getAttribute('data-id');
            const patientName = e.target.closest('tr').querySelector('td:nth-child(2)').textContent;
            removePatient(patientId, patientName);
        }
    });
}

// Initialize Add Patient Functionality
function initAddPatient() {
    const addPatientBtn = document.getElementById('addPatientBtn');
    if (!addPatientBtn) return;

    addPatientBtn.addEventListener('click', function () {
        showAddPatientModal();
    });
}

// Show Add Patient Modal
function showAddPatientModal() {
    const modalContent = `
        <div class="modal-header">
            <h3>Add New Patient</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <form id="addPatientForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-control" id="patientName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Age *</label>
                        <input type="number" class="form-control" id="patientAge" min="1" max="120" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Gender *</label>
                        <select class="form-control" id="patientGender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="tel" class="form-control" id="patientPhone" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="patientEmail">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Address *</label>
                    <textarea class="form-control" id="patientAddress" rows="2" required></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Blood Group</label>
                        <select class="form-control" id="patientBloodGroup">
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Emergency Contact</label>
                        <input type="tel" class="form-control" id="patientEmergencyContact">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Medical History</label>
                    <textarea class="form-control" id="patientMedicalHistory" rows="2"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Current Symptoms</label>
                    <textarea class="form-control" id="patientSymptoms" rows="2"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Allergies</label>
                    <textarea class="form-control" id="patientAllergies" rows="2"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Previous Medications</label>
                    <textarea class="form-control" id="patientMedications" rows="2"></textarea>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary close-modal">Cancel</button>
            <button class="btn btn-primary" id="submitPatientBtn">Add Patient</button>
        </div>
    `;

    showModal(modalContent);

    // Add event listeners
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    document.getElementById('submitPatientBtn').addEventListener('click', async function () {
        await addNewPatient();
    });
}

// Add New Patient to Firestore
async function addNewPatient() {
    const form = document.getElementById('addPatientForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    try {
        const submitBtn = document.getElementById('submitPatientBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;

        // Generate registration ID
        const registrationId = 'RJF' + Date.now().toString().slice(-8);

        // Get current timestamp
        const now = new Date();

        // Create patient data
        const patientData = {
            registrationId: registrationId,
            fullName: document.getElementById('patientName').value.trim(),
            age: parseInt(document.getElementById('patientAge').value),
            gender: document.getElementById('patientGender').value,
            phone: document.getElementById('patientPhone').value.trim(),
            email: document.getElementById('patientEmail').value.trim() || '',
            address: document.getElementById('patientAddress').value.trim(),
            bloodGroup: document.getElementById('patientBloodGroup').value || '',
            emergencyContact: document.getElementById('patientEmergencyContact').value.trim() || '',
            medicalHistory: document.getElementById('patientMedicalHistory').value.trim() || '',
            currentSymptoms: document.getElementById('patientSymptoms').value.trim() || '',
            allergies: document.getElementById('patientAllergies').value.trim() || '',
            previousMedications: document.getElementById('patientMedications').value.trim() || '',
            registrationDate: now,
            checkupStarted: false,
            checkupCompleted: false,
            checkupStartTime: null,
            checkupEndTime: null,
            assignedDoctor: '',
            assignedDoctorId: '',
            waitTime: 0,
            status: 'Waiting',
            createdAt: now,
            updatedAt: now
        };

        // Add to Firestore
        await db.collection('patients').add(patientData);

        showAlert('Patient added successfully!', 'success');
        closeModal();

        // Refresh patients table
        if (typeof loadPatientsTable === 'function') {
            loadPatientsTable();
        }

        // Update dashboard stats
        if (typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }

    } catch (error) {
        console.error('Error adding patient:', error);
        showAlert('Error adding patient: ' + error.message, 'danger');
    } finally {
        const submitBtn = document.getElementById('submitPatientBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Add Patient';
            submitBtn.disabled = false;
        }
    }
}

// Export functions for use in other files
window.patientManagement = {
    initPatientManagement,
    loadPatientsTable,
    searchPatients,
    viewPatientDetails,
    assignDoctorToPatient,
    updatePatientStatus,
    editPatient,
    removePatient,
    printPatientDetails,
    initAddPatient,
    showAddPatientModal,
    addNewPatient
};

// Initialize Add Doctor Functionality
function initAddDoctor() {
    const addDoctorBtn = document.getElementById('addDoctorBtn');
    if (!addDoctorBtn) return;

    addDoctorBtn.addEventListener('click', function () {
        showAddDoctorModal();
    });
}

// Show Add Doctor Modal - Updated with password field
function showAddDoctorModal() {
    const modalContent = `
        <div class="modal-header">
            <h3>Add New Doctor</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <form id="addDoctorForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-control" id="doctorName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Specialization *</label>
                        <select class="form-control" id="doctorSpecialization" required>
                            <option value="">Select Specialization</option>
                            <option value="General Physician">General Physician</option>
                            <option value="Cardiologist">Cardiologist</option>
                            <option value="Radiology">Radiology</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatrician">Pediatrician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Orthopedic">Orthopedic</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Psychiatrist">Psychiatrist</option>
                            <option value="ENT Specialist">ENT Specialist</option>
                            <option value="Dentist">Dentist</option>
                            <option value="Eye Specialist">Eye Specialist</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="tel" class="form-control" id="doctorPhone" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-control" id="doctorEmail" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Password *</label>
                        <input type="password" class="form-control" id="doctorPassword" required minlength="6">
                        <small class="form-text text-muted">Minimum 6 characters</small>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Confirm Password *</label>
                        <input type="password" class="form-control" id="doctorConfirmPassword" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Registration Number</label>
                        <input type="text" class="form-control" id="doctorRegNumber">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Years of Experience</label>
                        <input type="number" class="form-control" id="doctorExperience" min="0" max="50">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Hospital/Clinic</label>
                        <input type="text" class="form-control" id="doctorHospital">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Availability *</label>
                        <select class="form-control" id="doctorAvailability" required>
                            <option value="Full Day">Full Day</option>
                            <option value="Morning Shift">Morning Shift</option>
                            <option value="Evening Shift">Evening Shift</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Address</label>
                    <textarea class="form-control" id="doctorAddress" rows="2"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="doctorNotes" rows="2"></textarea>
                </div>
                
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="doctorIsActive" checked>
                    <label class="form-check-label" for="doctorIsActive">Active</label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary close-modal">Cancel</button>
            <button class="btn btn-primary" id="submitDoctorBtn">Add Doctor</button>
        </div>
    `;

    showModal(modalContent);

    // Add event listeners
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('submitDoctorBtn').addEventListener('click', async function () {
        await addNewDoctor();
    });
}

// Add New Doctor with Firebase Authentication
async function addNewDoctor() {
    const form = document.getElementById('addDoctorForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    // Validate passwords match
    const password = document.getElementById('doctorPassword').value;
    const confirmPassword = document.getElementById('doctorConfirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'danger');
        return;
    }

    try {
        const submitBtn = document.getElementById('submitDoctorBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;

        const email = document.getElementById('doctorEmail').value.trim();
        const fullName = document.getElementById('doctorName').value.trim();

        // Check if email already exists in Firebase Auth
        const signInMethods = await auth.fetchSignInMethodsForEmail(email);

        let userCredential;

        if (signInMethods.length > 0) {
            // User already exists in Auth
            showAlert('A user with this email already exists', 'warning');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }

        // Create user in Firebase Authentication
        userCredential = await auth.createUserWithEmailAndPassword(email, password);

        // Update display name
        await userCredential.user.updateProfile({
            displayName: `Dr. ${fullName}`
        });

        // Generate Doctor ID
        const doctorId = 'DOC' + Date.now().toString().slice(-6);

        // Get current timestamp
        const now = new Date();

        // Create doctor data for Firestore
        const doctorData = {
            doctorId: doctorId,
            uid: userCredential.user.uid,
            fullName: fullName,
            specialization: document.getElementById('doctorSpecialization').value,
            phone: document.getElementById('doctorPhone').value.trim(),
            email: email,
            registrationNumber: document.getElementById('doctorRegNumber').value.trim() || '',
            yearsOfExperience: parseInt(document.getElementById('doctorExperience').value) || 0,
            hospital: document.getElementById('doctorHospital').value.trim() || '',
            availability: document.getElementById('doctorAvailability').value,
            address: document.getElementById('doctorAddress').value.trim() || '',
            notes: document.getElementById('doctorNotes').value.trim() || '',
            isActive: document.getElementById('doctorIsActive').checked,
            patientsToday: 0,
            totalPatients: 0,
            avgCheckupTime: 0,
            status: 'Available',
            userType: 'doctor',
            createdAt: now,
            lastActivity: now
        };

        // Add to Firestore 'doctors' collection
        await db.collection('doctors').doc(userCredential.user.uid).set(doctorData);

        // Also add to 'users' collection for authentication
        await db.collection('users').doc(userCredential.user.uid).set({
            uid: userCredential.user.uid,
            email: email,
            displayName: `Dr. ${fullName}`,
            userType: 'doctor',
            role: 'doctor',
            specialization: doctorData.specialization,
            isActive: doctorData.isActive,
            createdAt: now,
            lastLogin: null
        });

        // Sign out the admin user
        await auth.signOut();

        // Sign back in as admin (you should have stored admin credentials securely)
        // For demo purposes, we'll redirect to login
        showAlert('Doctor added successfully! Doctor can now login to the Doctor Assistant Portal.', 'success');
        closeModal();

        // Refresh doctors table
        if (typeof loadDoctorsTable === 'function') {
            loadDoctorsTable();
        }

        // Update dashboard stats
        if (typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }

        // Note: In production, you should use Firebase Functions to create users
        // or re-authenticate the admin after creating the doctor

    } catch (error) {
        console.error('Error adding doctor:', error);

        let errorMessage = 'Error adding doctor: ';
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += 'Email is already in use';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address';
                break;
            case 'auth/operation-not-allowed':
                errorMessage += 'Email/password accounts are not enabled';
                break;
            case 'auth/weak-password':
                errorMessage += 'Password is too weak';
                break;
            default:
                errorMessage += error.message || 'An unknown error occurred';
        }

        showAlert(errorMessage, 'danger');
    } finally {
        const submitBtn = document.getElementById('submitDoctorBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Add Doctor';
            submitBtn.disabled = false;
        }
    }
}

// Initialize Add Volunteer Functionality - ADMIN DASHBOARD VERSION ONLY
function initAddVolunteer() {
    const addVolunteerBtn = document.getElementById('addVolunteerBtn');
    if (!addVolunteerBtn) return;

    addVolunteerBtn.addEventListener('click', function() {
        showAddVolunteerModal();
    });
}

// Show Add Volunteer Modal - ADMIN DASHBOARD VERSION
function showAddVolunteerModal() {
    const modalContent = `
        <div class="modal-header">
            <h3>Add New Volunteer (Admin)</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <form id="addVolunteerForm" class="modal-form">
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Full Name *</label>
                        <input type="text" class="form-control" id="volunteerName" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Age *</label>
                        <input type="number" class="form-control" id="volunteerAge" min="18" max="70" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Gender *</label>
                        <select class="form-control" id="volunteerGender" required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Phone Number *</label>
                        <input type="tel" class="form-control" id="volunteerPhone" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="volunteerEmail">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Address *</label>
                    <textarea class="form-control" id="volunteerAddress" rows="2" required></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Education/Profession</label>
                        <input type="text" class="form-control" id="volunteerEducation">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Emergency Contact</label>
                        <input type="tel" class="form-control" id="volunteerEmergencyContact">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Preferred Area *</label>
                    <select class="form-control" id="volunteerArea" required>
                        <option value="">Select Preferred Area</option>
                        <option value="Registration">Registration Desk</option>
                        <option value="Reception">Reception</option>
                        <option value="Waiting Area">Waiting Area Management</option>
                        <option value="Pharmacy">Pharmacy Assistance</option>
                        <option value="Food">Food Distribution</option>
                        <option value="Crowd Control">Crowd Control</option>
                        <option value="Transport">Patient Transport</option>
                        <option value="Medical Assistance">Medical Assistance</option>
                        <option value="Admin Support">Admin Support</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Previous Experience</label>
                        <select class="form-control" id="volunteerExperience">
                            <option value="None">No Experience</option>
                            <option value="Beginner">Beginner (1-2 events)</option>
                            <option value="Intermediate">Intermediate (3-5 events)</option>
                            <option value="Experienced">Experienced (5+ events)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Available Hours *</label>
                        <select class="form-control" id="volunteerHours" required>
                            <option value="">Select Hours</option>
                            <option value="4">4 Hours</option>
                            <option value="6">6 Hours</option>
                            <option value="8">8 Hours (Full Day)</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Special Skills/Notes</label>
                    <textarea class="form-control" id="volunteerSkills" rows="2"></textarea>
                </div>
                
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="volunteerCheckedIn">
                    <label class="form-check-label" for="volunteerCheckedIn">Checked In</label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary close-modal">Cancel</button>
            <button class="btn btn-primary" id="submitVolunteerBtn">Add Volunteer</button>
        </div>
    `;

    showModal(modalContent);

    // Add event listeners
    document.querySelector('.close-modal').addEventListener('click', closeModal);

    document.getElementById('submitVolunteerBtn').addEventListener('click', async function() {
        await addNewVolunteerAdmin();
    });
}

// Add New Volunteer to Firestore - ADMIN DASHBOARD VERSION
async function addNewVolunteerAdmin() {
    const form = document.getElementById('addVolunteerForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    try {
        const submitBtn = document.getElementById('submitVolunteerBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        submitBtn.disabled = true;

        // Get form data
        const volunteerData = {
            fullName: document.getElementById('volunteerName').value.trim(),
            age: parseInt(document.getElementById('volunteerAge').value),
            gender: document.getElementById('volunteerGender').value,
            phone: document.getElementById('volunteerPhone').value.trim(),
            email: document.getElementById('volunteerEmail').value.trim() || '',
            address: document.getElementById('volunteerAddress').value.trim(),
            education: document.getElementById('volunteerEducation').value.trim() || '',
            emergencyContact: document.getElementById('volunteerEmergencyContact').value.trim() || '',
            preferredArea: document.getElementById('volunteerArea').value,
            experience: document.getElementById('volunteerExperience').value,
            availableHours: parseInt(document.getElementById('volunteerHours').value),
            specialSkills: document.getElementById('volunteerSkills').value.trim() || '',
            checkedIn: document.getElementById('volunteerCheckedIn').checked,
            status: document.getElementById('volunteerCheckedIn').checked ? 'Active' : 'Registered',
            registrationDate: new Date().toISOString(),
            assignedTask: null,
            assignedArea: null,
            source: 'admin_dashboard' // Add source identifier
        };

        // Check if volunteer already exists
        let existingVolunteer = false;
        let existingVolunteerId = null;
        
        if (volunteerData.phone) {
            const phoneQuery = await db.collection('volunteers')
                .where('phone', '==', volunteerData.phone)
                .limit(1)
                .get();
                
            if (!phoneQuery.empty) {
                existingVolunteer = true;
                existingVolunteerId = phoneQuery.docs[0].id;
            }
        }
        
        if (!existingVolunteer && volunteerData.email) {
            const emailQuery = await db.collection('volunteers')
                .where('email', '==', volunteerData.email)
                .limit(1)
                .get();
                
            if (!emailQuery.empty) {
                existingVolunteer = true;
                existingVolunteerId = emailQuery.docs[0].id;
            }
        }

        if (existingVolunteer) {
            const confirmUpdate = confirm(`A volunteer with this phone/email already exists (ID: ${existingVolunteerId}). Do you want to update the existing record instead of creating a new one?`);
            
            if (confirmUpdate) {
                // Update existing volunteer
                await db.collection('volunteers').doc(existingVolunteerId).update({
                    ...volunteerData,
                    updatedAt: new Date(),
                    source: 'admin_updated'
                });
                showAlert('Existing volunteer record updated successfully!', 'success');
            } else {
                // User chose not to update, just inform
                showAlert('Volunteer already exists. No changes were made.', 'info');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
        } else {
            // Add new volunteer
            await db.collection('volunteers').add(volunteerData);
            showAlert('Volunteer added successfully!', 'success');
        }

        closeModal();

        // Refresh volunteers table
        if (typeof loadVolunteersTable === 'function') {
            loadVolunteersTable();
        }

        // Update dashboard stats
        if (typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }

    } catch (error) {
        console.error('Error adding volunteer:', error);
        showAlert('Error adding volunteer: ' + error.message, 'danger');
    } finally {
        const submitBtn = document.getElementById('submitVolunteerBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Add Volunteer';
            submitBtn.disabled = false;
        }
    }
}

// Enhanced Advanced Patient Search Functionality with Doctor fix and new sort filters
function initAdvancedPatientSearch() {
    const searchInput = document.getElementById('patientSearch');
    if (!searchInput) return;

    let searchTimeout;

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function () {
            document.getElementById('patientSearch').value = '';
            document.getElementById('patientStatusFilter').value = '';
            document.getElementById('patientDoctorFilter').value = '';
            document.getElementById('patientSortFilter').value = '';
            loadPatientsTable();
        });
    }

    // Status filter
    const statusFilter = document.getElementById('patientStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            applyPatientFilters();
        });
    }

    // Doctor filter (populate from Firestore)
    const doctorFilter = document.getElementById('patientDoctorFilter');
    if (doctorFilter) {
        populateDoctorFilter();
    }

    // Sort filter
    const sortFilter = document.getElementById('patientSortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function () {
            applyPatientFilters();
        });
    }

    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            applyPatientFilters();
        }, 300); // Reduced timeout for faster search
    });

    // Add enter key support
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            clearTimeout(searchTimeout);
            applyPatientFilters();
        }
    });
}

// Enhanced Populate Doctor Filter Dropdown - Doctor ফিল্টার ঠিক করা হয়েছে
async function populateDoctorFilter() {
    const doctorFilter = document.getElementById('patientDoctorFilter');
    if (!doctorFilter) return;

    try {
        const snapshot = await db.collection('doctors')
            .where('isActive', '==', true)
            .get();

        // Clear existing options except the first one
        while (doctorFilter.options.length > 1) {
            doctorFilter.remove(1);
        }

        // Add "Not Assigned" option
        const notAssignedOption = document.createElement('option');
        notAssignedOption.value = 'Not Assigned';
        notAssignedOption.textContent = 'Not Assigned';
        doctorFilter.appendChild(notAssignedOption);

        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                const doctor = doc.data();
                const option = document.createElement('option');
                option.value = `Dr. ${doctor.fullName}`; // Doctor এর নাম সঠিকভাবে সংরক্ষণ করা হচ্ছে
                option.textContent = `Dr. ${doctor.fullName} (${doctor.specialization})`;
                doctorFilter.appendChild(option);
            });
        }

        // Add change event listener
        doctorFilter.addEventListener('change', function () {
            applyPatientFilters();
        });

    } catch (error) {
        console.error('Error loading doctors for filter:', error);
    }
}

// Enhanced Apply All Patient Filters - Doctor ফিল্টার এবং নতুন Sort ফিল্টার যুক্ত করা হয়েছে
async function applyPatientFilters() {
    const searchTerm = document.getElementById('patientSearch').value.trim().toLowerCase();
    const statusFilter = document.getElementById('patientStatusFilter').value;
    const doctorFilter = document.getElementById('patientDoctorFilter').value;
    const sortFilter = document.getElementById('patientSortFilter') ? document.getElementById('patientSortFilter').value : 'newest'; // Default to newest

    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;

    try {
        // Show loading state
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i> Loading patients...
                    </div>
                </td>
            </tr>
        `;

        // Get all patients - Default sorting: Newest to Oldest
        const snapshot = await db.collection('patients')
            .orderBy('registrationDate', 'desc') // Default: Newest first
            .limit(200)
            .get();

        if (snapshot.empty) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">No patients found</td>
                </tr>
            `;
            return;
        }

        // Convert to array and apply filters
        let patients = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Apply search filter
        if (searchTerm) {
            patients = patients.filter(patient => {
                // Search in multiple fields
                const searchLower = searchTerm.toLowerCase();
                return (
                    (patient.registrationId && patient.registrationId.toLowerCase().includes(searchLower)) ||
                    (patient.fullName && patient.fullName.toLowerCase().includes(searchLower)) ||
                    (patient.phone && patient.phone.includes(searchTerm)) || // Phone is numeric, no case sensitivity needed
                    (patient.email && patient.email.toLowerCase().includes(searchLower))
                );
            });
        }

        // Apply status filter
        if (statusFilter) {
            patients = patients.filter(patient => {
                const status = calculatePatientStatus(patient);
                return status === statusFilter;
            });
        }

        // Apply doctor filter - FIXED: Doctor ফিল্টার ঠিক করা হয়েছে
        if (doctorFilter) {
            if (doctorFilter === 'Not Assigned') {
                patients = patients.filter(patient =>
                    !patient.assignedDoctor || patient.assignedDoctor.trim() === ''
                );
            } else {
                // Doctor এর নাম দ্বারা ফিল্টার করছি
                patients = patients.filter(patient =>
                    patient.assignedDoctor && patient.assignedDoctor.trim() === doctorFilter
                );
            }
        }

        // Apply sorting - FIXED: Oldest to Newest filter fixed
        if (sortFilter) {
            switch (sortFilter) {
                case 'newest':
                    // Newest to Oldest (Default)
                    patients.sort((a, b) => {
                        const dateA = a.registrationDate?.toDate ? a.registrationDate.toDate() : new Date(a.registrationDate);
                        const dateB = b.registrationDate?.toDate ? b.registrationDate.toDate() : new Date(b.registrationDate);
                        return dateB - dateA; // Newest first
                    });
                    break;

                case 'oldest':
                    // Oldest to Newest - FIXED: Corrected sorting logic
                    patients.sort((a, b) => {
                        const dateA = a.registrationDate?.toDate ? a.registrationDate.toDate() : new Date(a.registrationDate);
                        const dateB = b.registrationDate?.toDate ? b.registrationDate.toDate() : new Date(b.registrationDate);
                        return dateA - dateB; // Oldest first
                    });
                    break;

                case 'name-az':
                    // Name A-Z
                    patients.sort((a, b) => {
                        const nameA = a.fullName || '';
                        const nameB = b.fullName || '';
                        return nameA.localeCompare(nameB);
                    });
                    break;

                case 'name-za':
                    // Name Z-A
                    patients.sort((a, b) => {
                        const nameA = a.fullName || '';
                        const nameB = b.fullName || '';
                        return nameB.localeCompare(nameA);
                    });
                    break;

                case 'age-low-high':
                    // Age Low to High
                    patients.sort((a, b) => {
                        const ageA = a.age || 0;
                        const ageB = b.age || 0;
                        return ageA - ageB;
                    });
                    break;

                case 'age-high-low':
                    // Age High to Low
                    patients.sort((a, b) => {
                        const ageA = a.age || 0;
                        const ageB = b.age || 0;
                        return ageB - ageA;
                    });
                    break;
            }
        } else {
            // Default sorting: Newest to Oldest when no sort filter is selected
            patients.sort((a, b) => {
                const dateA = a.registrationDate?.toDate ? a.registrationDate.toDate() : new Date(a.registrationDate);
                const dateB = b.registrationDate?.toDate ? b.registrationDate.toDate() : new Date(b.registrationDate);
                return dateB - dateA; // Newest first
            });
        }

        displayFilteredPatients(patients);

    } catch (error) {
        console.error('Error applying filters:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center error">
                    <i class="fas fa-exclamation-circle"></i> Error loading patients: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Enhanced Display Filtered Patients
function displayFilteredPatients(patients) {
    const tableBody = document.getElementById('patientsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (patients.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No patients found matching your criteria</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    patients.forEach(patient => {
        const status = calculatePatientStatus(patient);
        const statusClass = `status-${status.toLowerCase().replace(' ', '-')}`;
        const doctorDisplay = patient.assignedDoctor ? patient.assignedDoctor : 'Not Assigned';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.registrationId}</td>
            <td>${patient.fullName}</td>
            <td>${patient.age}</td>
            <td>${patient.gender}</td>
            <td>${formatPhoneNumber(patient.phone)}</td>
            <td>${formatFirestoreTimestamp(patient.registrationDate)}</td>
            <td>
                <span class="status-badge ${statusClass}">
                    ${status}
                </span>
            </td>
            <td>${doctorDisplay}</td>
            <td>
                <div class="action-buttons-grid">
                    <div class="action-row">
                        <button class="btn-action view-patient" data-id="${patient.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                            <span>View</span>
                        </button>
                        <button class="btn-action edit-patient" data-id="${patient.id}" title="Edit Patient">
                            <i class="fas fa-edit"></i>
                            <span>Edit</span>
                        </button>
                    </div>
                    <div class="action-row">
                        <button class="btn-action assign-doctor" data-id="${patient.id}" title="Assign Doctor">
                            <i class="fas fa-user-md"></i>
                            <span>Assign</span>
                        </button>
                        <button class="btn-action update-status" data-id="${patient.id}" title="Update Status">
                            <i class="fas fa-sync-alt"></i>
                            <span>Status</span>
                        </button>
                    </div>
                    <div class="action-row">
                        <button class="btn-action remove-patient text-danger" data-id="${patient.id}" title="Remove Patient">
                            <i class="fas fa-trash"></i>
                            <span>Remove</span>
                        </button>
                    </div>
                </div>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Update count
    const patientCount = document.getElementById('patientCount');
    if (patientCount) {
        patientCount.textContent = `${patients.length} patients`;
    }

    // Add event listeners to action buttons
    addPatientActionListeners();
}

// HTML এ নতুন Sort ফিল্টার যোগ করার জন্য helper function
function initializeSortFilter() {
    const filterControls = document.querySelector('.filter-controls');
    if (filterControls && !document.getElementById('patientSortFilter')) {
        // নতুন Sort ফিল্টার HTML যোগ করুন
        const sortFilterHTML = `
            <div class="filter-group">
                <label for="patientSortFilter">Sort By</label>
                <select class="form-control" id="patientSortFilter">
                    <option value="">Default (Newest)</option>
                    <option value="newest">Newest to Oldest</option>
                    <option value="oldest">Oldest to Newest</option>
                    <option value="name-az">Name (A-Z)</option>
                    <option value="name-za">Name (Z-A)</option>
                    <option value="age-low-high">Age (Low to High)</option>
                    <option value="age-high-low">Age (High to Low)</option>
                </select>
            </div>
        `;

        // Clear filters বাটনের আগে সন্নিবেশ করুন
        const clearBtn = document.getElementById('clearFiltersBtn');
        if (clearBtn) {
            clearBtn.insertAdjacentHTML('beforebegin', sortFilterHTML);
        } else {
            filterControls.insertAdjacentHTML('beforeend', sortFilterHTML);
        }

        // Event listener যোগ করুন
        document.getElementById('patientSortFilter').addEventListener('change', function () {
            applyPatientFilters();
        });
    }
}

// DOMContentLoaded এ নতুন ফিল্টার ইনিশিয়ালাইজ করুন
document.addEventListener('DOMContentLoaded', function () {
    // নতুন Sort ফিল্টার HTML যোগ করুন (যদি প্রয়োজন হয়)
    initializeSortFilter();

    // নতুন ফিল্টার ইভেন্ট লিসেনার যোগ করুন
    const sortFilter = document.getElementById('patientSortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', function () {
            applyPatientFilters();
        });
    }
});

// Export functions for use in other files
window.patientFilters = {
    initAdvancedPatientSearch,
    populateDoctorFilter,
    applyPatientFilters,
    displayFilteredPatients,
    initializeSortFilter
};


// Doctor Management - Updated Version
async function initDoctorManagement() {
    await loadDoctorsTable();
    initAddDoctor();
    initDoctorActions();
}

// Load Doctors Table
async function loadDoctorsTable() {
    const tableBody = document.getElementById('doctorsTableBody');
    if (!tableBody) return;

    try {
        const snapshot = await db.collection('doctors')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();

        tableBody.innerHTML = '';

        if (snapshot.empty) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">No doctors found</td>
                </tr>
            `;
            return;
        }

        // Calculate stats
        const activeDoctors = snapshot.docs.filter(d => d.data().isActive);
        const totalPatients = snapshot.docs.reduce((sum, doc) => sum + (doc.data().patientsToday || 0), 0);
        const avgPatientsPerDoctor = snapshot.size > 0 ? Math.round(totalPatients / snapshot.size) : 0;

        snapshot.forEach(doc => {
            const doctor = doc.data();
            const statusClass = doctor.isActive ? 'status-active' : 'status-inactive';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.doctorId || 'N/A'}</td>
                <td>Dr. ${doctor.fullName}</td>
                <td>${doctor.specialization}</td>
                <td>${formatPhoneNumber(doctor.phone)}</td>
                <td>${doctor.email}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${doctor.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>${doctor.patientsToday || 0}</td>
                <td>${doctor.avgCheckupTime || 0} min</td>
                <td>
                    <button class="btn-action view-doctor" data-id="${doc.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action edit-doctor" data-id="${doc.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action toggle-doctor" data-id="${doc.id}" data-active="${doctor.isActive}">
                        <i class="fas fa-power-off"></i>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Update small stats cards
        document.getElementById('totalDoctorsSmall').textContent = snapshot.size;
        document.getElementById('activeDoctorsSmall').textContent = activeDoctors.length;
        document.getElementById('avgPatientsPerDoctor').textContent = avgPatientsPerDoctor;

    } catch (error) {
        console.error('Error loading doctors:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center error">Error loading doctors</td>
            </tr>
        `;
    }
}

// Initialize Doctor Actions
function initDoctorActions() {
    document.addEventListener('click', function (e) {
        // View doctor details
        if (e.target.closest('.view-doctor')) {
            const doctorId = e.target.closest('.view-doctor').getAttribute('data-id');
            viewDoctorDetails(doctorId);
        }

        // Edit doctor
        if (e.target.closest('.edit-doctor')) {
            const doctorId = e.target.closest('.edit-doctor').getAttribute('data-id');
            editDoctor(doctorId);
        }

        // Toggle doctor status
        if (e.target.closest('.toggle-doctor')) {
            const doctorId = e.target.closest('.toggle-doctor').getAttribute('data-id');
            const isActive = e.target.closest('.toggle-doctor').getAttribute('data-active') === 'true';
            toggleDoctorStatus(doctorId, !isActive);
        }
    });
}

// View Doctor Details
async function viewDoctorDetails(doctorId) {
    try {
        const doc = await db.collection('doctors').doc(doctorId).get();

        if (!doc.exists) {
            showAlert('Doctor not found', 'danger');
            return;
        }

        const doctor = doc.data();
        const patientsSnapshot = await db.collection('patients')
            .where('assignedDoctorId', '==', doctorId)
            .get();

        const modalContent = `
            <div class="modal-header">
                <h3>Doctor Details - Dr. ${doctor.fullName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="doctor-details-grid">
                    <div class="detail-group">
                        <h4>Personal Information</h4>
                        <p><strong>Doctor ID:</strong> ${doctor.doctorId}</p>
                        <p><strong>Full Name:</strong> Dr. ${doctor.fullName}</p>
                        <p><strong>Email:</strong> ${doctor.email}</p>
                        <p><strong>Phone:</strong> ${formatPhoneNumber(doctor.phone)}</p>
                        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
                        <p><strong>Status:</strong> 
                            <span class="status-badge ${doctor.isActive ? 'status-active' : 'status-inactive'}">
                                ${doctor.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Professional Information</h4>
                        <p><strong>Registration Number:</strong> ${doctor.registrationNumber || 'N/A'}</p>
                        <p><strong>Years of Experience:</strong> ${doctor.yearsOfExperience || 0}</p>
                        <p><strong>Hospital/Clinic:</strong> ${doctor.hospital || 'N/A'}</p>
                        <p><strong>Availability:</strong> ${doctor.availability}</p>
                        <p><strong>Address:</strong> ${doctor.address || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Performance Statistics</h4>
                        <p><strong>Patients Today:</strong> ${doctor.patientsToday || 0}</p>
                        <p><strong>Total Patients:</strong> ${doctor.totalPatients || 0}</p>
                        <p><strong>Average Checkup Time:</strong> ${doctor.avgCheckupTime || 0} minutes</p>
                        <p><strong>Current Assigned Patients:</strong> ${patientsSnapshot.size}</p>
                        <p><strong>Account Created:</strong> ${formatFirestoreTimestamp(doctor.createdAt)}</p>
                    </div>
                </div>
                
                <div class="notes-section">
                    <h4>Notes</h4>
                    <p>${doctor.notes || 'No notes available'}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Close</button>
            </div>
        `;

        showModal(modalContent);

    } catch (error) {
        console.error('Error viewing doctor details:', error);
        showAlert('Error loading doctor details', 'danger');
    }
}

// Edit Doctor
async function editDoctor(doctorId) {
    try {
        const doc = await db.collection('doctors').doc(doctorId).get();

        if (!doc.exists) {
            showAlert('Doctor not found', 'danger');
            return;
        }

        const doctor = doc.data();

        const modalContent = `
            <div class="modal-header">
                <h3>Edit Doctor - Dr. ${doctor.fullName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editDoctorForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <input type="text" class="form-control" id="editDoctorName" value="${doctor.fullName}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Specialization *</label>
                            <select class="form-control" id="editDoctorSpecialization" required>
                                <option value="">Select Specialization</option>
                                <option value="General Physician" ${doctor.specialization === 'General Physician' ? 'selected' : ''}>General Physician</option>
                                <option value="Cardiologist" ${doctor.specialization === 'Cardiologist' ? 'selected' : ''}>Cardiologist</option>
                                <option value="Dermatologist" ${doctor.specialization === 'Dermatologist' ? 'selected' : ''}>Dermatologist</option>
                                <option value="Pediatrician" ${doctor.specialization === 'Pediatrician' ? 'selected' : ''}>Pediatrician</option>
                                <option value="Gynecologist" ${doctor.specialization === 'Gynecologist' ? 'selected' : ''}>Gynecologist</option>
                                <option value="Orthopedic" ${doctor.specialization === 'Orthopedic' ? 'selected' : ''}>Orthopedic</option>
                                <option value="Other" ${doctor.specialization === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <input type="tel" class="form-control" id="editDoctorPhone" value="${doctor.phone}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email *</label>
                            <input type="email" class="form-control" id="editDoctorEmail" value="${doctor.email}" required readonly>
                            <small class="form-text text-muted">Email cannot be changed</small>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Registration Number</label>
                            <input type="text" class="form-control" id="editDoctorRegNumber" value="${doctor.registrationNumber || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Years of Experience</label>
                            <input type="number" class="form-control" id="editDoctorExperience" value="${doctor.yearsOfExperience || 0}" min="0" max="50">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Hospital/Clinic</label>
                            <input type="text" class="form-control" id="editDoctorHospital" value="${doctor.hospital || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Availability *</label>
                            <select class="form-control" id="editDoctorAvailability" required>
                                <option value="Full Day" ${doctor.availability === 'Full Day' ? 'selected' : ''}>Full Day</option>
                                <option value="Morning Shift" ${doctor.availability === 'Morning Shift' ? 'selected' : ''}>Morning Shift</option>
                                <option value="Evening Shift" ${doctor.availability === 'Evening Shift' ? 'selected' : ''}>Evening Shift</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <textarea class="form-control" id="editDoctorAddress" rows="2">${doctor.address || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Notes</label>
                        <textarea class="form-control" id="editDoctorNotes" rows="2">${doctor.notes || ''}</textarea>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="editDoctorIsActive" ${doctor.isActive ? 'checked' : ''}>
                        <label class="form-check-label" for="editDoctorIsActive">Active</label>
                    </div>
                    
                    <div class="form-group mt-3">
                        <label class="form-label">Reset Password</label>
                        <input type="password" class="form-control" id="editDoctorNewPassword" placeholder="Leave blank to keep current password">
                        <small class="form-text text-muted">Only enter if you want to change the password</small>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary" id="updateDoctorBtn">Update Doctor</button>
            </div>
        `;

        showModal(modalContent);

        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.getElementById('updateDoctorBtn').addEventListener('click', async () => {
            await updateDoctor(doctorId, doctor.email);
        });

    } catch (error) {
        console.error('Error editing doctor:', error);
        showAlert('Error loading doctor data', 'danger');
    }
}

// Update Doctor Information
async function updateDoctor(doctorId, originalEmail) {
    const form = document.getElementById('editDoctorForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    try {
        const submitBtn = document.getElementById('updateDoctorBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;

        const newPassword = document.getElementById('editDoctorNewPassword').value;
        const updateData = {
            fullName: document.getElementById('editDoctorName').value.trim(),
            specialization: document.getElementById('editDoctorSpecialization').value,
            phone: document.getElementById('editDoctorPhone').value.trim(),
            registrationNumber: document.getElementById('editDoctorRegNumber').value.trim() || '',
            yearsOfExperience: parseInt(document.getElementById('editDoctorExperience').value) || 0,
            hospital: document.getElementById('editDoctorHospital').value.trim() || '',
            availability: document.getElementById('editDoctorAvailability').value,
            address: document.getElementById('editDoctorAddress').value.trim() || '',
            notes: document.getElementById('editDoctorNotes').value.trim() || '',
            isActive: document.getElementById('editDoctorIsActive').checked,
            updatedAt: new Date()
        };

        // Update Firestore doctor document
        await db.collection('doctors').doc(doctorId).update(updateData);

        // Also update users collection
        await db.collection('users').doc(doctorId).update({
            displayName: `Dr. ${updateData.fullName}`,
            specialization: updateData.specialization,
            isActive: updateData.isActive,
            updatedAt: new Date()
        });

        // Update Firebase Auth display name
        const user = auth.currentUser;
        if (user && user.uid === doctorId) {
            await user.updateProfile({
                displayName: `Dr. ${updateData.fullName}`
            });
        }

        // Update password if provided
        if (newPassword && newPassword.length >= 6) {
            try {
                // Note: In production, this should be done via Firebase Functions
                // or require re-authentication
                if (user && user.uid === doctorId) {
                    await user.updatePassword(newPassword);
                }
            } catch (passwordError) {
                console.warn('Could not update password:', passwordError);
                // Don't fail the whole update if password update fails
            }
        }

        showAlert('Doctor updated successfully!', 'success');
        closeModal();
        loadDoctorsTable();

    } catch (error) {
        console.error('Error updating doctor:', error);
        showAlert('Error updating doctor: ' + error.message, 'danger');
    } finally {
        const submitBtn = document.getElementById('updateDoctorBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Update Doctor';
            submitBtn.disabled = false;
        }
    }
}

// Toggle Doctor Status
async function toggleDoctorStatus(doctorId, newStatus) {
    try {
        await db.collection('doctors').doc(doctorId).update({
            isActive: newStatus,
            status: newStatus ? 'Available' : 'Inactive',
            updatedAt: new Date()
        });

        // Also update users collection
        await db.collection('users').doc(doctorId).update({
            isActive: newStatus,
            updatedAt: new Date()
        });

        showAlert(`Doctor ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
        loadDoctorsTable();

    } catch (error) {
        console.error('Error toggling doctor status:', error);
        showAlert('Error updating doctor status', 'danger');
    }
}

// Doctor Login Functionality (for doctor-portal.html)
async function doctorLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Check if user is a doctor
        const userDoc = await db.collection('users').doc(user.uid).get();

        if (!userDoc.exists || userDoc.data().userType !== 'doctor') {
            await auth.signOut();
            throw new Error('Access denied. Not a registered doctor.');
        }

        const doctorDoc = await db.collection('doctors').doc(user.uid).get();
        if (!doctorDoc.exists) {
            await auth.signOut();
            throw new Error('Doctor profile not found.');
        }

        const doctorData = doctorDoc.data();

        // Check if doctor is active
        if (!doctorData.isActive) {
            await auth.signOut();
            throw new Error('Your account is not active. Please contact admin.');
        }

        // Store doctor info in localStorage
        localStorage.setItem('doctorAuth', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            isDoctor: true,
            specialization: doctorData.specialization,
            doctorId: doctorData.doctorId
        }));

        // Update last login time
        await db.collection('doctors').doc(user.uid).update({
            lastLogin: new Date()
        });

        await db.collection('users').doc(user.uid).update({
            lastLogin: new Date()
        });

        return { success: true, doctor: doctorData };

    } catch (error) {
        console.error('Doctor login error:', error);
        throw error;
    }
}

// Export doctor management functions
window.doctorManagement = {
    initDoctorManagement,
    loadDoctorsTable,
    addNewDoctor,
    doctorLogin,
    toggleDoctorStatus
};

// Initialize Volunteer Management
async function initVolunteerManagement() {
    await loadVolunteersTable();
    initAddVolunteer();
    initVolunteerActions();
}

// Load Volunteers Table - FIXED: Now properly loading and displaying volunteers
async function loadVolunteersTable() {
    const tableBody = document.getElementById('volunteersTableBody');
    if (!tableBody) return;

    try {
        // Clear loading message
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i> Loading volunteers...
                    </div>
                </td>
            </tr>
        `;

        // Get volunteers from Firestore
        const snapshot = await db.collection('volunteers')
            .orderBy('registrationDate', 'desc')
            .limit(100)
            .get();

        tableBody.innerHTML = '';

        if (snapshot.empty) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="9" class="text-center">
                        <div class="no-results">
                            <i class="fas fa-users"></i>
                            <p>No volunteers registered yet</p>
                        </div>
                    </td>
                </tr>
            `;

            // Update stats
            document.getElementById('totalVolunteersSmall').textContent = '0';
            document.getElementById('checkedInVolunteers').textContent = '0';
            document.getElementById('assignedVolunteers').textContent = '0';
            return;
        }

        let checkedInCount = 0;
        let assignedCount = 0;

        snapshot.forEach(doc => {
            const volunteer = doc.data();

            // Count stats
            if (volunteer.checkedIn) checkedInCount++;
            if (volunteer.assignedTask && volunteer.assignedTask.trim() !== '') assignedCount++;

            // Format dates
            const registrationDate = formatFirestoreTimestamp(volunteer.registrationDate);
            const checkedInTime = volunteer.checkedInTime ?
                formatFirestoreTimestamp(volunteer.checkedInTime) : 'Not checked in';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${volunteer.fullName || 'N/A'}</td>
                <td>${volunteer.age || 'N/A'}</td>
                <td>${volunteer.gender || 'N/A'}</td>
                <td>${formatPhoneNumber(volunteer.phone || '')}</td>
                <td>${volunteer.preferredArea || 'Not specified'}</td>
                <td>
                    <span class="status-badge ${volunteer.checkedIn ? 'status-completed' : 'status-waiting'}">
                        ${volunteer.checkedIn ? 'Active' : 'Registered'}
                    </span>
                </td>
                <td>${volunteer.assignedTask || 'Not Assigned'}</td>
                <td>${volunteer.checkedIn ? 'Yes' : 'No'}</td>
                <td>
                    <div class="action-buttons-grid">
                        <div class="action-row">
                            <button class="btn-action view-volunteer" data-id="${doc.id}" title="View Details">
                                <i class="fas fa-eye"></i>
                                <span>View</span>
                            </button>
                            <button class="btn-action edit-volunteer" data-id="${doc.id}" title="Edit Volunteer">
                                <i class="fas fa-edit"></i>
                                <span>Edit</span>
                            </button>
                        </div>
                        <div class="action-row">
                            <button class="btn-action assign-task" data-id="${doc.id}" title="Assign Task">
                                <i class="fas fa-tasks"></i>
                                <span>Assign</span>
                            </button>
                            <button class="btn-action toggle-checkin" data-id="${doc.id}" title="${volunteer.checkedIn ? 'Check Out' : 'Check In'}" data-checked="${volunteer.checkedIn}">
                                <i class="fas fa-user-check"></i>
                                <span>${volunteer.checkedIn ? 'Out' : 'In'}</span>
                            </button>
                        </div>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Update small stats cards
        document.getElementById('totalVolunteersSmall').textContent = snapshot.size;
        document.getElementById('checkedInVolunteers').textContent = checkedInCount;
        document.getElementById('assignedVolunteers').textContent = assignedCount;

        // Also update main dashboard stats if available
        const totalVolunteersCount = document.getElementById('totalVolunteersCount');
        if (totalVolunteersCount) {
            totalVolunteersCount.textContent = snapshot.size;
        }

        // Add event listeners to action buttons
        initVolunteerActions();

        console.log(`Loaded ${snapshot.size} volunteers, ${checkedInCount} checked in, ${assignedCount} assigned tasks`);

    } catch (error) {
        console.error('Error loading volunteers:', error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center error">
                    <i class="fas fa-exclamation-circle"></i> 
                    Error loading volunteers: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Also update the initVolunteerManagement function to ensure proper loading
async function initVolunteerManagement() {
    console.log('Initializing volunteer management...');

    // First load the volunteers table
    await loadVolunteersTable();

    // Initialize add volunteer button
    const addVolunteerBtn = document.getElementById('addVolunteerBtn');
    if (addVolunteerBtn) {
        addVolunteerBtn.addEventListener('click', function () {
            showAddVolunteerModal();
        });
    }

    // Initialize volunteer actions
    initVolunteerActions();

    console.log('Volunteer management initialized successfully');
}

// Initialize Volunteer Actions
function initVolunteerActions() {
    document.addEventListener('click', function (e) {
        // View volunteer
        if (e.target.closest('.view-volunteer')) {
            const volunteerId = e.target.closest('.view-volunteer').getAttribute('data-id');
            viewVolunteerDetails(volunteerId);
        }

        // Edit volunteer
        if (e.target.closest('.edit-volunteer')) {
            const volunteerId = e.target.closest('.edit-volunteer').getAttribute('data-id');
            editVolunteer(volunteerId);
        }

        // Toggle check-in
        if (e.target.closest('.toggle-checkin')) {
            const volunteerId = e.target.closest('.toggle-checkin').getAttribute('data-id');
            const isCheckedIn = e.target.closest('.toggle-checkin').getAttribute('data-checked') === 'true';
            toggleVolunteerCheckIn(volunteerId, !isCheckedIn);
        }

        // Remove volunteer (new)
        if (e.target.closest('.remove-volunteer')) {
            const volunteerId = e.target.closest('.remove-volunteer').getAttribute('data-id');
            const volunteerName = e.target.closest('tr').querySelector('td:nth-child(1)').textContent;
            removeVolunteer(volunteerId, volunteerName);
        }
    });
}

// Edit Volunteer Function
async function editVolunteer(volunteerId) {
    try {
        const doc = await db.collection('volunteers').doc(volunteerId).get();

        if (!doc.exists) {
            showAlert('Volunteer not found', 'danger');
            return;
        }

        const volunteer = doc.data();

        const modalContent = `
            <div class="modal-header">
                <h3>Edit Volunteer - ${volunteer.fullName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editVolunteerForm" class="modal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <input type="text" class="form-control" id="editVolunteerName" value="${volunteer.fullName}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Age *</label>
                            <input type="number" class="form-control" id="editVolunteerAge" value="${volunteer.age}" min="18" max="70" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Gender *</label>
                            <select class="form-control" id="editVolunteerGender" required>
                                <option value="">Select Gender</option>
                                <option value="Male" ${volunteer.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${volunteer.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Other" ${volunteer.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <input type="tel" class="form-control" id="editVolunteerPhone" value="${volunteer.phone}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="editVolunteerEmail" value="${volunteer.email || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Address *</label>
                        <textarea class="form-control" id="editVolunteerAddress" rows="2" required>${volunteer.address}</textarea>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Education/Profession</label>
                            <input type="text" class="form-control" id="editVolunteerEducation" value="${volunteer.education || ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Emergency Contact</label>
                            <input type="tel" class="form-control" id="editVolunteerEmergencyContact" value="${volunteer.emergencyContact || ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Preferred Area *</label>
                        <select class="form-control" id="editVolunteerArea" required>
                            <option value="">Select Preferred Area</option>
                            <option value="Registration" ${volunteer.preferredArea === 'Registration' ? 'selected' : ''}>Registration Desk</option>
                            <option value="Reception" ${volunteer.preferredArea === 'Reception' ? 'selected' : ''}>Reception</option>
                            <option value="Waiting Area" ${volunteer.preferredArea === 'Waiting Area' ? 'selected' : ''}>Waiting Area Management</option>
                            <option value="Pharmacy" ${volunteer.preferredArea === 'Pharmacy' ? 'selected' : ''}>Pharmacy Assistance</option>
                            <option value="Food" ${volunteer.preferredArea === 'Food' ? 'selected' : ''}>Food Distribution</option>
                            <option value="Crowd Control" ${volunteer.preferredArea === 'Crowd Control' ? 'selected' : ''}>Crowd Control</option>
                            <option value="Transport" ${volunteer.preferredArea === 'Transport' ? 'selected' : ''}>Patient Transport</option>
                            <option value="Medical Assistance" ${volunteer.preferredArea === 'Medical Assistance' ? 'selected' : ''}>Medical Assistance</option>
                            <option value="Admin Support" ${volunteer.preferredArea === 'Admin Support' ? 'selected' : ''}>Admin Support</option>
                            <option value="Other" ${volunteer.preferredArea === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Previous Experience</label>
                            <select class="form-control" id="editVolunteerExperience">
                                <option value="None" ${volunteer.experience === 'None' ? 'selected' : ''}>No Experience</option>
                                <option value="Beginner" ${volunteer.experience === 'Beginner' ? 'selected' : ''}>Beginner (1-2 events)</option>
                                <option value="Intermediate" ${volunteer.experience === 'Intermediate' ? 'selected' : ''}>Intermediate (3-5 events)</option>
                                <option value="Experienced" ${volunteer.experience === 'Experienced' ? 'selected' : ''}>Experienced (5+ events)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Available Hours *</label>
                            <select class="form-control" id="editVolunteerHours" required>
                                <option value="">Select Hours</option>
                                <option value="4" ${volunteer.availableHours === 4 ? 'selected' : ''}>4 Hours</option>
                                <option value="6" ${volunteer.availableHours === 6 ? 'selected' : ''}>6 Hours</option>
                                <option value="8" ${volunteer.availableHours === 8 ? 'selected' : ''}>8 Hours (Full Day)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Special Skills/Notes</label>
                        <textarea class="form-control" id="editVolunteerSkills" rows="2">${volunteer.specialSkills || ''}</textarea>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="editVolunteerCheckedIn" ${volunteer.checkedIn ? 'checked' : ''}>
                        <label class="form-check-label" for="editVolunteerCheckedIn">Checked In</label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Cancel</button>
                <button class="btn btn-primary" id="updateVolunteerBtn">Update Volunteer</button>
            </div>
        `;

        showModal(modalContent);

        document.querySelector('.close-modal').addEventListener('click', closeModal);
        document.getElementById('updateVolunteerBtn').addEventListener('click', async () => {
            await updateVolunteer(volunteerId);
        });

    } catch (error) {
        console.error('Error editing volunteer:', error);
        showAlert('Error loading volunteer data', 'danger');
    }
}

// Update Volunteer Information
async function updateVolunteer(volunteerId) {
    const form = document.getElementById('editVolunteerForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }

    try {
        const submitBtn = document.getElementById('updateVolunteerBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        submitBtn.disabled = true;

        const now = new Date();
        const updateData = {
            fullName: document.getElementById('editVolunteerName').value.trim(),
            age: parseInt(document.getElementById('editVolunteerAge').value),
            gender: document.getElementById('editVolunteerGender').value,
            phone: document.getElementById('editVolunteerPhone').value.trim(),
            email: document.getElementById('editVolunteerEmail').value.trim() || '',
            address: document.getElementById('editVolunteerAddress').value.trim(),
            education: document.getElementById('editVolunteerEducation').value.trim() || '',
            emergencyContact: document.getElementById('editVolunteerEmergencyContact').value.trim() || '',
            preferredArea: document.getElementById('editVolunteerArea').value,
            experience: document.getElementById('editVolunteerExperience').value,
            availableHours: parseInt(document.getElementById('editVolunteerHours').value),
            specialSkills: document.getElementById('editVolunteerSkills').value.trim() || '',
            checkedIn: document.getElementById('editVolunteerCheckedIn').checked,
            checkedInTime: document.getElementById('editVolunteerCheckedIn').checked ? now : null,
            status: document.getElementById('editVolunteerCheckedIn').checked ? 'Active' : 'Registered',
            updatedAt: now
        };

        await db.collection('volunteers').doc(volunteerId).update(updateData);

        showAlert('Volunteer updated successfully!', 'success');
        closeModal();
        loadVolunteersTable();

    } catch (error) {
        console.error('Error updating volunteer:', error);
        showAlert('Error updating volunteer: ' + error.message, 'danger');
    } finally {
        const submitBtn = document.getElementById('updateVolunteerBtn');
        if (submitBtn) {
            submitBtn.innerHTML = 'Update Volunteer';
            submitBtn.disabled = false;
        }
    }
}

// Remove Volunteer Function
async function removeVolunteer(volunteerId, volunteerName) {
    const confirmDelete = confirm(`Are you sure you want to remove volunteer: ${volunteerName}?\n\nThis action cannot be undone.`);

    if (!confirmDelete) return;

    try {
        await db.collection('volunteers').doc(volunteerId).delete();
        showAlert(`Volunteer "${volunteerName}" removed successfully!`, 'success');

        // Refresh table
        loadVolunteersTable();
        updateDashboardStats();

    } catch (error) {
        console.error('Error removing volunteer:', error);
        showAlert('Error removing volunteer: ' + error.message, 'danger');
    }
}

// View Volunteer Details
async function viewVolunteerDetails(volunteerId) {
    try {
        const doc = await db.collection('volunteers').doc(volunteerId).get();

        if (!doc.exists) {
            showAlert('Volunteer not found', 'danger');
            return;
        }

        const volunteer = doc.data();

        const modalContent = `
            <div class="modal-header">
                <h3>Volunteer Details - ${volunteer.fullName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="volunteer-details-grid">
                    <div class="detail-group">
                        <h4>Personal Information</h4>
                        <p><strong>Full Name:</strong> ${volunteer.fullName}</p>
                        <p><strong>Age:</strong> ${volunteer.age} | <strong>Gender:</strong> ${volunteer.gender}</p>
                        <p><strong>Phone:</strong> ${formatPhoneNumber(volunteer.phone)}</p>
                        <p><strong>Email:</strong> ${volunteer.email || 'N/A'}</p>
                        <p><strong>Address:</strong> ${volunteer.address}</p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Volunteer Information</h4>
                        <p><strong>Education/Profession:</strong> ${volunteer.education || 'N/A'}</p>
                        <p><strong>Preferred Area:</strong> ${volunteer.preferredArea}</p>
                        <p><strong>Experience:</strong> ${volunteer.experience}</p>
                        <p><strong>Available Hours:</strong> ${volunteer.availableHours} hours</p>
                        <p><strong>Emergency Contact:</strong> ${volunteer.emergencyContact || 'N/A'}</p>
                    </div>
                    
                    <div class="detail-group">
                        <h4>Camp Information</h4>
                        <p><strong>Status:</strong> 
                            <span class="status-badge ${volunteer.checkedIn ? 'status-active' : 'status-registered'}">
                                ${volunteer.status || (volunteer.checkedIn ? 'Active' : 'Registered')}
                            </span>
                        </p>
                        <p><strong>Assigned Task:</strong> ${volunteer.assignedTask || 'Not assigned'}</p>
                        <p><strong>Checked In:</strong> ${volunteer.checkedIn ? 'Yes' : 'No'}</p>
                        ${volunteer.checkedInTime ?
                `<p><strong>Checked In Time:</strong> ${formatFirestoreTimestamp(volunteer.checkedInTime)}</p>` : ''}
                        <p><strong>Hours Worked:</strong> ${volunteer.hoursWorked || 0} hours</p>
                        <p><strong>Registration Date:</strong> ${formatFirestoreTimestamp(volunteer.createdAt)}</p>
                    </div>
                </div>
                
                ${volunteer.specialSkills ? `
                <div class="notes-section">
                    <h4>Special Skills/Notes</h4>
                    <p>${volunteer.specialSkills}</p>
                </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Close</button>
            </div>
        `;

        showModal(modalContent);

    } catch (error) {
        console.error('Error viewing volunteer details:', error);
        showAlert('Error loading volunteer details', 'danger');
    }
}

// Toggle Volunteer Check-In Status
async function toggleVolunteerCheckIn(volunteerId, checkIn) {
    try {
        const now = new Date();
        const updateData = {
            checkedIn: checkIn,
            checkedInTime: checkIn ? now : null,
            status: checkIn ? 'Active' : 'Registered',
            updatedAt: now
        };

        await db.collection('volunteers').doc(volunteerId).update(updateData);

        showAlert(`Volunteer ${checkIn ? 'checked in' : 'checked out'} successfully!`, 'success');
        loadVolunteersTable();

    } catch (error) {
        console.error('Error toggling volunteer check-in:', error);
        showAlert('Error updating volunteer status', 'danger');
    }
}

// Utility Functions
function calculatePatientStatus(patient) {
    if (patient.checkupCompleted) return 'Completed';
    if (patient.checkupStarted) return 'Under Checkup';
    return 'Waiting';
}

function formatPhoneNumber(phone) {
    if (!phone) return 'N/A';
    const cleaned = phone.toString().replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

function formatFirestoreTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <span>${message}</span>
            <button class="alert-close">&times;</button>
        </div>
    `;

    document.body.appendChild(alertDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);

    // Close button functionality
    alertDiv.querySelector('.alert-close').addEventListener('click', () => {
        alertDiv.remove();
    });
}

// Initialize all actions when dashboard loads
document.addEventListener('DOMContentLoaded', function () {
    // Initialize patient actions
    initPatientActions();

    // Initialize doctor actions
    initDoctorActions();

    // Initialize volunteer actions
    initVolunteerActions();
});

// Export all functions for use in other files
window.adminUtils = {
    // Authentication
    checkAdminAuth,
    initAdminLogin,
    initLogout,

    // Dashboard
    initDashboardStats,
    updateDashboardStats,
    initCharts,

    // Patient Management
    initPatientManagement,
    loadPatientsTable,
    searchPatients,
    viewPatientDetails,
    assignDoctorToPatient,
    updatePatientStatus,
    editPatient,
    removePatient,
    initAddPatient,
    addNewPatient,

    // Doctor Management
    initDoctorManagement,
    loadDoctorsTable,
    editDoctor,
    toggleDoctorStatus,
    initAddDoctor,
    addNewDoctor,

    // Volunteer Management
    initVolunteerManagement,
    loadVolunteersTable,
    viewVolunteerDetails,
    editVolunteer,
    toggleVolunteerCheckIn,
    removeVolunteer,
    initAddVolunteer,
    addNewVolunteer,

    // Utility Functions
    calculatePatientStatus,
    formatPhoneNumber,
    formatFirestoreTimestamp,
    showAlert,
    showModal,
    closeModal
};