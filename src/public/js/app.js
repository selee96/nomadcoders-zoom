const socket = io();

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");
const room  = document.getElementById("room");
const nameForm = room.querySelector("#name");
const msgForm = room.querySelector("#msg");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_nessage", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();

    nameForm.hidden = true;
    msgForm.hidden = false;

    const nameInput = nameForm.querySelector("input");
    const nameValue = nameInput.value;
    const h5 = room.querySelector("h5");

    h5.innerText = `You are ${nameValue}`;
    socket.emit("nickname", nameValue);

    msgForm.addEventListener("submit", handleMessageSubmit);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    msgForm.hidden = true;

    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const welcomInput = welcomeForm.querySelector("input");
    socket.emit("enter_room", welcomInput.value, showRoom);
    roomName = welcomInput.value;
    welcomInput.value = "";
}

welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left.`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});
