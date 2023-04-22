const form = document.getElementById("form")
const emailInput = document.getElementById("email")
const phoneInput = document.getElementById('phone')
const nameInput = document.getElementById('name')
const msg = document.getElementById('msg')

form.addEventListener("submit", onSubmit)

async function onSubmit(e) {
    console.log("inside on submit")
    try {
        e.preventDefault()
        const userDetails = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        }
        console.log(userDetails)
        const res = await axios.post("https://13.233.250.3:3000/login", userDetails)

        console.log('details savesuccess', res)
    } catch (err) {
        console.log(err)
    }
}
function updataDom(user) {
    const item = document.createElement('li')
    item.innerHTML = `<li>${user}</li>`
    msg.appendChild(item)
}