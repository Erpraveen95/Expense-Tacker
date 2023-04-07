const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category")
const form = document.querySelector("#form");
const userList = document.getElementById("list");

form.addEventListener("submit", onSubmit);

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await axios
            .get("http://localhost:3000/getExpense")

        for (let i = 0; i < res.data.fetchExpense.length; i++) {
            updateDom(res.data.fetchExpense[i]);
        }

    } catch (err) {
        console.log(err);
    }
});

async function onSubmit(e) {
    try {
        e.preventDefault();
        if (amount.value === "" || text.value == "") {
            alert("please input field");
        } else {
            const userDetails = {
                description: text.value,
                amount: amount.value,
                category: category.value
            };
            //console.log(userDetails, "this is beign saved")
            const user = await axios.post(
                "http://localhost:3000/addExpense",
                userDetails
            );

            console.log("details saved success");
            updateDom(user.data.dataFromBack);

            text.value = "";
            amount.value = "";
        }
    } catch (err) {
        console.log(err);
    }
}
// update dom
function updateDom(user) {
    if (user.amount > 0) {
        let temp = money_plus.textContent;
        temp = parseInt(temp) + parseInt(user.amount);
        money_plus.textContent = `₹${temp}/-`;
        let oldBal = balance.textContent;
        oldBal = parseInt(oldBal) + parseInt(user.amount);
        balance.textContent = `₹${oldBal}/-`;
    } else {
        let temp = money_minus.textContent;
        temp = parseInt(temp) + parseInt(user.amount);
        money_minus.textContent = `₹${temp}/-`;
        let oldBal = balance.textContent;
        oldBal = parseInt(oldBal) - parseInt(user.amount);
        balance.textContent = `₹${oldBal}/-`;
    }

    const item = document.createElement("li");
    item.classList.add(`${user.amount}` < 0 ? "minus" : "plus");
    item.id = `${user.id}`;
    item.innerHTML = `${user.description}<span id="${user.id}">₹${user.amount} ${user.category}</span>
                    <button onclick=deleteUser('${user.id}') class="delete-btn">X</button>
                    <button onclick=editDetails('${user.description}','${user.amount}','${user.id}')
                    class="delete-btn">Edit</button>`;
    userList.appendChild(item);
    total();
}

async function deleteUser(id) {
    try {
        await axios.delete(`http://localhost:3000/delete/${id}`);
        console.log("data Succesfully deleted");
        removeUserFromScreen(id);
        total();
    } catch (err) {
        (err) => console.error(err);
    }
}
function removeUserFromScreen(id) {
    const item = document.getElementById(id); // get parent <li> elemen
    item.parentNode.removeChild(item);
}

async function total() {
    try {
        var totalExpense = 0;
        var positive = 0;
        var negative = 0;
        const res = await axios.get("http://localhost:3000/getExpense");

        res.data.fetchExpense.forEach((i) => {
            //console.log(i)
            totalExpense += parseInt(i.amount);
            if (i.amount > 0) {
                positive += parseInt(i.amount);
            } else {
                negative += parseInt(i.amount);
            }
        });

        balance.textContent = `₹${totalExpense}/-`;
        money_minus.textContent = `₹${negative}`;
        money_plus.textContent = `₹${positive}`;
    } catch (err) {
        (err) => console.log(err);
    }
}
function editDetails(description, amount, id) {
    document.getElementById("text").value = description;
    document.getElementById("amount").value = amount;
    deleteUser(id);
}
///temp