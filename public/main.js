const socket = io.connect("http://localhost:4000");
const clientTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageTone = new Audio('/public_message-tone.mp3')
socket.on("clients-total",(data)=>{
    // console.log(data)
    clientTotal.innerText = `Total Clients : ${data}`;
})
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    sendMessage();
})
messageInput.addEventListener('focus',(e)=>{
    // e.preventDefault()
    socket.emit('feedback',{
        feedback: `✍️ ${nameInput.value} is Typing ...`
    })
})
messageInput.addEventListener('keypress',(e)=>{
    // e.preventDefault()
    socket.emit('feedback',{
        feedback: `✍️ ${nameInput.value} is Typing ...`
    })
})
messageInput.addEventListener('blur',(e)=>{
    // e.preventDefault();
    socket.emit('feedback',{
        feedback: ''
    })
})
function sendMessage(){
    if(messageInput.value == '') return;
//    console.log(messageInput.value);
   const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date().toLocaleDateString()
   }
   socket.emit("message",data)
   addMessage(true,data);
   messageInput.value = ''
}

socket.on("chat-message",(data)=>{
    messageTone.play();
    // console.log(data);
    addMessage(false,data);
});
function addMessage(isOwnMessage,data){
    clearFeedback();
    const element = `<li class="${isOwnMessage?"message-right":"message-left"}">
                <p class="message">
                    ${data.message}
                    <span>${data.name} • ${data.dateTime}</span>
                </p>
            </li>`
            messageContainer.innerHTML += element
            // console.log(element);
            scrollToBottom()
}

function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

socket.on("feedback",(data)=>{
    clearFeedback();
    const liElement = `<li class="message-feedback">
                <p class="feedback" id="feedback">${data.feedback}</p>
            </li>`
    messageContainer.innerHTML += liElement
});

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element =>{
        element.parentNode.removeChild(element);
    });
}