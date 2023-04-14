
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category")
const form = document.querySelector("#form");
const userList = document.getElementById("list");
const username = document.getElementById("username")
const usernameDiv = document.getElementById("div-username")

//premium
const razorpaySubmit = document.getElementById("buy-premium")
const leaderboard = document.getElementById("leaderboard")
const leaderboardUl = document.getElementById("ul-leaderboard")


form.addEventListener("submit", onSubmit);
razorpaySubmit.addEventListener("click", buyPremium)

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token")
        const res = await axios
            .get("http://localhost:3000/getExpense",
                { headers: { "Autherization": token } })
        username.textContent = `Welcome ${res.data.username}`
        if (res.data.isPremiumUser === true) {
            razorpaySubmit.style.display = "none";
            const obj = document.createElement("span")
            obj.classList.add("premium")
            obj.textContent = "Premium User"
            usernameDiv.appendChild(obj)
            displayLeaderboard()
            displayTable()
        }
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
            const token = localStorage.getItem("token")
            const user = await axios.post(
                "http://localhost:3000/addExpense",
                userDetails, { headers: { Autherization: token } }
            );

            console.log("details saved success");
            updateDom(user.data.dataFromBack[0]);

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
        const token = localStorage.getItem("token")
        await axios.delete(`http://localhost:3000/delete/${id}`, { headers: { Autherization: token } });
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
        const token = localStorage.getItem("token")
        const res = await axios.get("http://localhost:3000/getExpense",
            { headers: { "Autherization": token } });

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

async function buyPremium(e) {
    //console.log("button pressed")
    const token = localStorage.getItem("token")
    const response = await axios.get("http://localhost:3000/purchase/premiummembership/",
        { headers: { "Autherization": token } })
    console.log(response)
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const payment = await axios.post("http://localhost:3000/purchase/updatetransactionstatus/", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Autherization": token } })
            console.log(payment, "after success")

            alert("you are a premium user now!!")
            razorpaySubmit.style.display = "none";
            const obj = document.createElement("span")
            obj.classList.add("premium")
            obj.textContent = "Premium User"
            usernameDiv.appendChild(obj)
            displayLeaderboard();
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open()
    e.preventDefault();
    rzp1.on("payment.failed", async function (response) {
        const token = localStorage.getItem("token")
        console.log(response)
        const payment = await axios.post("http://localhost:3000/purchase/updatetransactionstatus/", {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
        }, { headers: { "Autherization": token } })
        alert("Something Went Wrong")
    })
    //console.log(response, "this is buypremium response")
}
function displayLeaderboard() {
    leaderboard.style.display = "block";
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.classList.add("leaderboardButton")
    inputElement.value = "Show Leaderboard"
    inputElement.onclick = async () => {
        const token = localStorage.getItem("token")
        const userLeaderboardArray = await axios.get("http://localhost:3000/premium/showleaderboard",
            { headers: { Autherization: token } })
        console.log(userLeaderboardArray)
        leaderboardUl.innerHTML = ""
        userLeaderboardArray.data.leaderboardData.forEach(user => {
            const li = document.createElement("li")
            li.innerHTML = `${user.name} : ${user.totalExpense || "0"}`
            leaderboardUl.appendChild(li)
        })
    }
    leaderboard.appendChild(inputElement)
}
function displayTable() {
    document.getElementById("table-div").style.display = "block"
    const tableForm = document.getElementById("table-form")
    tableForm.addEventListener("submit", display)
    async function display(e) {
        e.preventDefault();
        const token = localStorage.getItem("token")
        const getTableData = await axios.get("http://localhost:3000/premium/showtable",
            { headers: { Autherization: token } })
        console.log(getTableData.data.res)
        const table = document.createElement('table');
        table.classList.add("my-table")

        // create table header row
        const headerRow = document.createElement('tr');
        Object.keys(getTableData.data.res[0]).forEach(key => {
            const headerCell = document.createElement('th');
            headerCell.textContent = key;
            headerRow.appendChild(headerCell);
        });
        table.appendChild(headerRow);

        // create table body rows
        getTableData.data.res.forEach(expense => {
            const row = document.createElement('tr');
            Object.values(expense).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });

        document.getElementById("table-div").appendChild(table);

    }
}

