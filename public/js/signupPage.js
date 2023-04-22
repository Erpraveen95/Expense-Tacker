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
        //console.log(userDetails)
        const res = await axios.post("https://13.233.250.3:3000/signup", userDetails)
        updateDom(res.data.res, "success")
        console.log('details savesuccess', res.request.status)
        if (res.request.status === 201) {
            setTimeout(() => {
                window.location.href = "../../views/html/loginPage.html"
            }, 2000)
        }
    } catch (err) {
        console.log(err.response.data.error.errors[0].message, "this is error")
        // console.log("error resopnse", res)
        updateDom(err.response.data.error.errors[0].message, "error")
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

