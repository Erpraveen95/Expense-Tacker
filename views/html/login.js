
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const form = document.getElementById('login-form')
const msg = document.getElementById("msg-new")
const response = document.getElementById("response")
const url = new URL("https://expensetracker-co-in.onrender.com")

const token = localStorage.getItem("token")
if (token) {
    window.location.href = "main.html"
}
form.addEventListener("submit", login)

async function login(e) {
    try {
        e.preventDefault();

        const loginCredentials = {
            email: emailInput.value,
            password: passwordInput.value
        }
        const serverResponse = await axios.post(`${url}/login`, loginCredentials)
        updateDom(serverResponse.data.res)
        if (serverResponse.request.status === 200) {
            localStorage.setItem("token", serverResponse.data.token)
            //setTimeout(() => {
            window.location.href = "main.html"
            //}, 2000)
        }
    } catch (error) {
        console.log(error.response.data.res)
        const forgotPasswordLink = document.createElement("a")
        forgotPasswordLink.href = "forgotPassword.html";
        forgotPasswordLink.textContent = "Forgot Password";
        response.appendChild(forgotPasswordLink);
        updateDom(error.response.data.res)
    }
}
function updateDom(user) {
    msg.innerHTML = ""
    const item = document.createElement("li")
    item.textContent = user
    msg.appendChild(item)
}