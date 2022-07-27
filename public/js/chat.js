const socket = io();

const messageForm = document.querySelector('#message-form');
const messageFormInput = messageForm.querySelector('input');
const messageFormButton = messageForm.querySelector('button');
const sendLocation = document.querySelector('#send-location');
const messages = document.querySelector('#messages');
const sidebar = document.querySelector('#sidebar');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    // New Message Element
    const newMessage = messages.lastElementChild;

    // Height of the New Message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    // Visible Height
    const visibleHeight = messages.offsetHeight;

    // Height of the messages container
    const containerHeight = messages.scrollHeight;

    // How far scrolled
    const scrolledOffset = messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrolledOffset) {
        messages.scrollTop = messages.scrollHeight;
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        location: location.location,
        createdAt: moment(location.createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', (data) => {
    console.log(data);
    const html = Mustache.render(sidebarTemplate, {
        room: data.room,
        users: data.users
    });
    sidebar.innerHTML = html;
});

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    messageFormButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        messageFormButton.removeAttribute('disabled');
        messageFormInput.value = '';
        messageFormInput.focus();
        if(error) {
            return console.log(error);
        }
        console.log('Message delivered!');
    });
});

sendLocation.addEventListener('click', (e) => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }
    sendLocation.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            sendLocation.removeAttribute('disabled');
            console.log('Location Shared!');
        });
    });
});

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error);
        location.href ='/';
    }
});
