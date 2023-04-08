
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
        const response = await axios.post("http://localhost:3000/login", loginData)
        console.log(response.request.status)
        updateDom(response.data.res)
        if (response.request.status === 200) {
            localStorage.setItem("token", response.data.token)
            window.location.href = "../../views/html/main.html"
        }
    } catch (err) {
        console.log(err.response.data.res)
        updateDom(err.response.data.res)
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