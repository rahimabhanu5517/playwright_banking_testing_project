function generateRandomUsername() {
    return `user_${Math.random().toString(36).substring(2, 10)}`;
}

module.exports = { generateRandomUsername };
