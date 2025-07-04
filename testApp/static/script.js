// script.js
document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('input');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const messageSection = document.getElementById('message-section');

    // Function to add a message to the chat display
    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.id = sender; // 'user' or 'bot'
        messageDiv.innerHTML = `<span>${message}</span>`;
        messageSection.appendChild(messageDiv);
        messageSection.scrollTop = messageSection.scrollHeight; // Scroll to bottom
    }

    // Function to send message to the backend
    async function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === '') return;

        addMessage('user', userMessage);
        inputField.value = ''; // Clear input field

        try {
            // Send message to FastAPI backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `message=${encodeURIComponent(userMessage)}`
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage('bot', data.response);

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('bot', 'Oops! Something went wrong. Please try again.');
        }
    }

    // Event listener for the send button
    sendMessageButton.addEventListener('click', sendMessage);

    // Event listener for the Enter key in the input field
    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
