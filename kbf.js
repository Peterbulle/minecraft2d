function showSponsor() {
    alert('Sponsored by Volleyballstudio');
}

function loadShop() {
    showLoadingAndHideSections('shop');
}

function loadAboutUs() {
    showLoadingAndHideSections('aboutUs');
}

function loadContact() {
    showLoadingAndHideSections('contact');
}

function showHome() {
    showLoadingAndHideSections('content');
}

function openVolleyballStudio() {
    window.open('https://scratch.mit.edu/studios/26893696/', '_blank');
    setTimeout(function () {
        window.open('https://www.youtube.com/@VolleyballStudioYT', '_blank');
    }, 500);
}

function showLoadingAndHideSections(sectionToShow) {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(function () {
        document.getElementById('loading').style.display = 'none';
        // Hide all sections
        ['content', 'shop', 'aboutUs', 'contact', 'login', 'register', 'users', 'adminLogin'].forEach(function (id) {
            document.getElementById(id).style.display = 'none';
        });
        // Show the selected section
        document.getElementById(sectionToShow).style.display = 'block';
    }, 2000);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log("Latitude: " + lat + "\nLongitude: " + lon);
    document.getElementById('content').style.display = 'block';
    document.getElementById('consent').style.display = 'none';
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function acceptConsent() {
    getLocation();
}

window.onload = function () {
    document.getElementById('content').style.display = 'none';
    document.getElementById('consent').style.display = 'flex';
};

// Register new account
document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const realName = document.getElementById('realName').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userId = 'user_' + (users.length + 1);
    const newUser = { id: userId, username: newUsername, realName, password: newPassword, online: false, location: null };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully!');
    loadLogin();
});

// Login to account
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username && u.password === password);

    if (userIndex !== -1) {
        users[userIndex].online = true;
        localStorage.setItem('users', JSON.stringify(users));
        trackUserLocation(users[userIndex].id);
        alert('Login successful!');
        showHome();
    } else {
        alert('Invalid username or password.');
    }
});

function trackUserLocation(userId) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                users[userIndex].location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                localStorage.setItem('users', JSON.stringify(users));
            }
        }, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function logoutUser(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        users[userIndex].online = false;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

function loadLogin() {
    hideAllSections();
    document.getElementById('login').style.display = 'block';
}

function loadRegister() {
    hideAllSections();
    document.getElementById('register').style.display = 'block';
}

function loadUsers() {
    hideAllSections();
    document.getElementById('users').style.display = 'block';

    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = `ID: ${user.id}, Username: ${user.username}, Real Name: ${user.realName}, Online: ${user.online ? 'Yes' : 'No'}`;
        if (user.online && user.location) {
            listItem.textContent += `, Location: Latitude ${user.location.latitude}, Longitude ${user.location.longitude}`;
        }
        userList.appendChild(listItem);
    });
}

function showAdminLogin() {
    hideAllSections();
    document.getElementById('adminLogin').style.display = 'block';
}

// Admin Login
document.getElementById('adminLoginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const adminPassword = document.getElementById('adminPassword').value;

    if (adminPassword === '280712') {
        loadUsers();
    } else {
        alert('Incorrect password.');
        document.getElementById('adminPassword').value = '';
    }
});

// Function to hide all sections
function hideAllSections() {
    ['content', 'shop', 'aboutUs', 'contact', 'login', 'register', 'users', 'adminLogin'].forEach(function (id) {
        document.getElementById(id).style.display = 'none';
    });
}
function showAdminLogin() {
    hideAllSections(); // Hide all other sections
    document.getElementById('adminLogin').style.display = 'block'; // Show admin login
}

// Admin Login
document.getElementById('adminLoginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const adminPassword = document.getElementById('adminPassword').value;

    // Check for the correct password
    if (adminPassword === '280712') {
        loadUsers(); // Show users if the password is correct
    } else {
        alert('Incorrect password.'); // Alert for incorrect password
        document.getElementById('adminPassword').value = ''; // Clear the input field
    }
});