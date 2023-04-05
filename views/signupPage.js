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
        const res = await axios.post("http://localhost:3000/login", userDetails)
        updateDom(res.data.res, "success")
        console.log('details savesuccess', res.data.res)
    } catch (err) {
        console.log(err.response.data.err, "this is error")
        // console.log("error resopnse", res)
        updateDom(err.response.data.err, "error")
    }
}
function updateDom(user, string) {
    msg.innerHTML = ""
    const item = document.createElement('li')
    if (string === "success") {
        item.classList.add("success")
    } else {
        item.classList.add("error")
    }
    item.innerHTML = `<li>${user}</li>`
    item.innerHTML.style =
        msg.appendChild(item)
}