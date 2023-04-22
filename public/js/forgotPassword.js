const form = document.getElementById("forgotPassword")
const email = document.getElementById("email")

form.addEventListener("submit", resetPassword)


async function resetPassword(e) {
    try {
        console.log("hii")
        e.preventDefault();
        const inputEmail = {
            email: email.value
        }
        const response = await axios.post("http://13.233.250.3:3000/password/forgotpassword", inputEmail)
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}