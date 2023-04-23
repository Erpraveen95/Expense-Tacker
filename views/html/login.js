
//login  page  logic
const formLogin = document.getElementById("formLogin")
const emailLogin = document.getElementById("emailLogin")
const passwordLogin = document.getElementById("passwordLogin")
const msg = document.getElementById("msg-new")

formLogin.addEventListener("submit", onLogin)

async function onLogin(e) {
    try {
        e.preventDefault()
        const loginData = {
            email: emailLogin.value,
            password: passwordLogin.value
        }
        const response = await axios.post("http://13.233.250.3:3000/login", loginData)
        updateDom(response.data.res)
        if (response.request.status === 200) {
            localStorage.setItem("token", response.data.token)
            window.location.href = "main.html"
        }
    } catch (err) {
        console.log(err.response.data.res)
        updateDom(err.response.data.res)
        const forgotPasswordLink = document.createElement("a")
        forgotPasswordLink.href = "forgotPassword.html";
        forgotPasswordLink.textContent = "Forgot Password";
        document.body.appendChild(forgotPasswordLink);
    }
}

function updateDom(user) {
    const item = document.createElement("li")
    item.textContent = user
    msg.appendChild(item)
    setTimeout(() => {
        msg.innerHTML = ""
    }, 5000)
}