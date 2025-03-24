
const socket = io("https://search-app-backend-opal.vercel.app", {
  auth: { token: localStorage.getItem("token") },
  // info: {name:"migo", age:24}
});

socket.on("connect", () => {
  console.log("Connected to backend successfully!");
});

const onlineUsers = [];
const userList = document.getElementById("user-list");
const messageBox = document.getElementById("message-box");
const sendButton = document.getElementById("send-button");
const logoutButton = document.getElementById("logout-button");
const chatWindow = document.getElementById("chat-window");
const usernameDisplay = document.getElementById("username-display");
const iconlogout = document.getElementById("icon-logout");
const btnonline = document.getElementById("online");
const sidebar = document.getElementById("sidebar");


let user = localStorage.getItem("username");
let token = localStorage.getItem("token");


// socket.auth = { email, password };
// socket.connect();

if (!user) {
  window.location.href = "../chat.html";
} else {
  usernameDisplay.textContent = user;
}

// Send btn event
sendButton.addEventListener("click", () => {
  const message = messageBox.value;

  if (message.trim()) {
    // socket.emit("message", { sender: user, text: message });
    const p = document.createElement("p");
    p.textContent = `you: ${message}`;
    chatWindow.appendChild(p);
    const userID = document.querySelector("h4").id;
    socket.emit("private-message", {
      message,
      to: userID,
    });
    messageBox.value = "";
  }
});

// * ==========> listen all online users 
socket.on("users", (onlineUsers) => {
  userList.innerHTML = "";
  onlineUsers.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.username;
    li.id = `${user.socketId}`;

    li.addEventListener("click", () => {
      chatWindow.innerHTML = "";
      const h4 = document.createElement("h4");
      h4.textContent = `${user.username}`;
      h4.id = `${user.socketId}`;
      chatWindow.appendChild(h4);
    });

    userList.appendChild(li);
  });
});

// msg for online user login
socket.on("user_connected", (user) => {
  alert(`User ${user.username} is online now!`);
});

// * ==========> listen all disconnected users 
socket.on("user_disconnected", (user) => {
  const userElement = document.getElementById(`${user.socketId}`);
  if (userElement) {
    userElement.remove();
  }
  alert(`User ${user.username} is offline now!`);
});

//* ==========> listen error
socket.on("connect_error", (err) => {
  console.log({ err });
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

// * listen private msg
socket.on("private-message", ({ message, from }) => {
  const p = document.createElement("p");
  p.textContent = `${from}: ${message}`;
  chatWindow.appendChild(p);
});

// * set local storage 
document.getElementById('logoutButton').addEventListener("click", () => {
  const usertoken = localStorage.getItem("token");
  // emit event "disconnect"
  socket.disconnect(); // disconnect socket from backend
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  console.log('redirect to index ')
  window.location.href = "../index.html";
});

iconlogout.addEventListener("click", () => {
  const usertoken = localStorage.getItem("token");
  // emit event "disconnect"
  socket.disconnect(); // disconnect socket from backend
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "../index.html";
});

btnonline.addEventListener("click", () => {
  console.log('show hide btn')
  if (sidebar.classList.contains('hide')) {
    sidebar.classList.remove('hide')
    sidebar.classList.add('show')
  } else {
    sidebar.classList.remove('show')
    sidebar.classList.add('hide')
  }
});
