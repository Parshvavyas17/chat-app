const users = [];

const addUsers = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if(!username || !room) {
        return {
            error: 'Fill all the fields'
        }
    }
    const existingUser = users.find((user) => (user.room === room && user.username === username));
    if(existingUser) {
        return {
            error: 'Username already exists'
        }
    }
    const user = { id, username, room };
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
}

addUsers({
    id: 7,
    username: 'Parshva',
    room: '3 BHK'
});

addUsers({
    id: 17,
    username: 'Parshva',
    room: '2 BHK'
});

addUsers({
    id: 27,
    username: 'Hanie',
    room: '3 BHK'
});

module.exports = {
    addUsers,
    removeUser,
    getUser,
    getUsersInRoom
}
