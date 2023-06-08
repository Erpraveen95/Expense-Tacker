const form = document.getElementById("form")
const emailInput = document.getElementById("email")
const phoneInput = document.getElementById('phone')
const passwordInput = document.getElementById("password")
const nameInput = document.getElementById('name')
const msg = document.getElementById('msg')

form.addEventListener("submit", onSubmit)

async function onSubmit(e) {
    try {
        e.preventDefault()
        const userDetails = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            password: passwordInput.value
        }
        const res = await axios.post("https://expensetracker-co-in.onrender.com/signup", userDetails)
        updateDom(res.data.message, "success")
        if (res.request.status === 201) {
            setTimeout(() => {
                window.location.href = "loginPage.html"
            }, 2000)
            nameInput.value = ""
            emailInput.value = ""
            phoneInput.value = ""
            passwordInput.value = ""
        }
    } catch (error) {
        updateDom(error.response.data.message, "error")
    }
}
function updateDom(user, string) {
    const item = document.createElement('li')
    if (string === "success") {
        item.classList.add("success")
    } else {
        item.classList.add("error")
    }
    item.innerHTML = `<li>${user}</li>`
    msg.appendChild(item)
    setTimeout(() => {
        msg.innerHTML = ""
    }, 5000)
}

