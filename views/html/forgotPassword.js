const form = document.getElementById("forgotPassword")
const email = document.getElementById("email")

form.addEventListener("submit", resetPassword)


async function resetPassword(e) {
    try {
        e.preventDefault();
        const inputEmail = {
            email: email.value
        }
        const response = await axios.post("https://expensetracker-co-in.onrender.com/password/forgotpassword", inputEmail)
    } catch (err) {
        console.log(err)
    }
}