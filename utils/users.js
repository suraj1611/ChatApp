const users = [];

// Join user to chat
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// User leave
function userLeave(id){
    const ind = users.findIndex(user => user.id === id);

    if(ind !== -1){
        return users.splice(ind,1)[0];
    }
}

// Get room of user
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};