import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";


import { getDatabase, ref, push, set, onChildAdded, onDisconnect, remove, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC0dTY1qsYezogvMOIe4iErRwB9xeBoI5k",
    authDomain: "login-page-babec.firebaseapp.com",
    databaseURL: "https://login-page-babec-default-rtdb.firebaseio.com",
    projectId: "login-page-babec",
    storageBucket: "login-page-babec.firebasestorage.app",
    messagingSenderId: "316778720700",
    appId: "1:316778720700:web:205a0fb101df9285944fb9",
    measurementId: "G-1EC538NYNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const database = getDatabase(app);
auth.languageCode = 'it';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
provider.setCustomParameters({ 'login_hint': 'user@example.com' });

// Selectors
const loginBtn = document.querySelector(".Login");
const googleBtn = document.querySelector(".Login_user");
const logoutBtn = document.querySelector(".google");
const sendBtn = document.querySelector('#SeandBtn');
const errorDisplay = document.querySelector(".error");

// Event listener for creating a new user
loginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const userName = document.querySelector("#User_Name").value;
    const email = document.querySelector("#User_Email").value;
    const pass = document.querySelector("#password").value;

    createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            localStorage.setItem("User_Name", userName);

            if (error.message.includes("email-already-in-use")) {
                errorDisplay.innerHTML = "Email Already In Use";
            } else if (error.message.includes("invalid-email")) {
                errorDisplay.innerHTML = "Invalid Email Or Password";
            } else if (error.message.includes("missing-password")) {
                errorDisplay.innerHTML = "Password missing";
            }
        });
});

// User authentication status observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        const loginContainer = document.querySelector(".Login_Con");
        loginContainer.style.display = "none";
        errorDisplay.innerHTML = user.uid;
        document.title = 'Home';

        const group = '01';
        const pageLang = 'en';
        localStorage.setItem("alt", false);
        
        SetUp_profile(user.email.split("@")[0] || localStorage.getItem("User_Name"), user.email)
        
        loader(false);
        loadMessages();

        const altDone = localStorage.getItem("alt");
        if (!altDone) {
            alert("The App Is Under Development. If you log out, you won't be able to sign in again until we fix the bug.");
            localStorage.setItem("alt", true);
        }

        // Update the browser URL with user information
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?id=${user.uid}&name=${user.email.split("@")[0]}`;
window.history.pushState({ path: newUrl }, "", newUrl);

    } else {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Google sign-in popup
function googlePopUp() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(user);
        })
        .catch((error) => {
            console.error("Google sign-in error:", error.message);
        });
}

// Logout function
async function logout() {
    signOut(auth)
        .then(() => window.location.reload())
        .catch((error) => alert("Error signing out:", error));
}

// load massage 

// Function to load and display chat messages
function loadMessages() {
    const chatMessages = document.querySelector(".chat_area");
    if (!chatMessages) {
        console.error("Chat container not found");
        return;
    }

    // Reference to the 'messages' node in the Firebase database
    const messagesRef = ref(database, 'messages');

    // Listen for new messages added to the database
    onChildAdded(messagesRef, (snapshot) => {
        const messageData = snapshot.val();
        if (messageData) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message'); // Optional: Add a class for styling
            messageElement.innerHTML = `<span class="User">@${messageData.user.split("@")[0]}<span class="Time">
             ${messageData.timestamp}
            </span></span>: ${messageData.message}</div>`;
            
            
            chatMessages.appendChild(messageElement);

            // Auto-scroll to the bottom of the chat container
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
}

// Set up event listener for the send button
document.querySelector('#SendBtn').addEventListener('click', sendMessage);

// sound functions

function playSendSound() {
    const sound = document.getElementById('sendSound');
    sound.play();
}


function ErrorSound() {
  const sound = document.getElementById('ErrorSound');
  sound.play();
}


// Send message function
function sendMessage() {
    const message = document.querySelector("#Sender").value;
    const user = auth.currentUser;

var min = new Date().getMinutes();
var hr = new Date().getHours();
var mode;

if (hr > 12) {
  mode = "pm"
} else {
  mode = "am"
}

if (hr > 12) {
    hr = `${hr - 12}`;
  } else if (hr < 12){
    hr = `${hr}`;
  }

if (hr < 10) {
  hr = `0${hr}`;
}

if (min < 10) {
  min = `0${min}`;
}
var time = `${hr}:${min}${mode}`;



    if (message && user) {
        const messageRef = push(ref(database, 'messages'));
        set(messageRef, {
            userid: user.uid,
            user: user.email,
            message: message,
            timestamp: time
        });
        document.querySelector("#Sender").value = '';
    }


if (document.querySelector("#Sender").value = "") {
  ErrorSound();
} else {
  playSendSound()
}
    
}





// display active users 

function trackUserPresence() {
  const user = auth.currentUser;
  if (user) {
    const userStatusRef = ref(database, `activeUsers/${user.uid}`);

    // Set the user's status to online
    set(userStatusRef, true);

    // When the user disconnects (closes the browser or loses connection), remove them from active users
    onDisconnect(userStatusRef).remove();

    // Listen for changes to the active users list
    const activeUsersRef = ref(database, 'activeUsers');
    onValue(activeUsersRef, (snapshot) => {
      const activeUsers = snapshot.val();
      const activeCount = activeUsers ? Object.keys(activeUsers).length : 0;
      document.getElementById('activeUsersCount').textContent = `${activeCount}`;
    });
  }
}

// Run the presence tracking after authentication
onAuthStateChanged(auth, (user) => {
  if (user) {
    trackUserPresence();
  }
});




// Event listeners for Google login, logout, and sending messages
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.querySelector(".Login");
  const googleBtn = document.querySelector(".Login_user");
  const logoutBtn = document.querySelector(".google");
  const sendBtn = document.querySelector('#SeandBtn');


  if (googleBtn) {
    googleBtn.addEventListener('click', googlePopUp);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
  }
});

