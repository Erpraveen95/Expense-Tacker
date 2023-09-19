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
const pagination = document.getElementById("pagination")
const logOut = document.getElementById("logout-btn")

//premium
const razorpaySubmit = document.getElementById("buy-premium")
const leaderboard = document.getElementById("leaderboard")
const leaderboardUl = document.getElementById("ul-leaderboard")

const url = new URL('https://expensetracker-co-in.onrender.com')

document.getElementById("rows-per-page").onchange = (e) => {
    localStorage.setItem("rowsPerPage", e.target.value);
};
form.addEventListener("submit", onSubmit);
razorpaySubmit.addEventListener("click", buyPremium)

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token")
        const rows = localStorage.getItem("rowsPerPage")
        const res = await axios
            .get(`${url}/getExpense/?page=1`,
                { headers: { "Authorization": token, Rows: rows } })
        username.textContent = `Welcome ${res.data.username}`
        if (res.data.isPremiumUser === true) {
            showPremiumUserFeatures()
        }
        showPagination(res.data)
        for (let i = 0; i < res.data.fetchExpense.length; i++) {

            updateDom(res.data.fetchExpense[i]);
        }

    } catch (err) {
        console.log(err);
    }
});
//pagination

function showPagination(response) {

    pagination.innerHTML = ""
    if (response.hasPreviousPage) {
        const btn2 = document.createElement('button')
        btn2.innerHTML = response.previousPage
        pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button')
    btn1.innerHTML = response.currentPage
    pagination.appendChild(btn1)
    if (response.hasNextPage) {
        const btn3 = document.createElement('button')
        btn3.innerHTML = response.nextPage
        pagination.appendChild(btn3)
    }
}
document.querySelector("#pagination").onclick = async (e) => {
    const page = e.target.innerHTML;
    let token = localStorage.getItem("token");

    let rows = localStorage.getItem("rowsPerPage");
    if (rows == null) {
        rows = 3;
    }
    let res = await axios.get(
        `${url}/getExpense/?page=${page}`,
        {
            headers: { "Authorization": token, Rows: rows },
        }
    );
    showPagination(res.data);
    userList.innerHTML = ""
    for (let i = 0; i < res.data.fetchExpense.length; i++) {
        updateDom(res.data.fetchExpense[i]);
    }
};
//premium features
function showPremiumUserFeatures() {
    razorpaySubmit.style.display = "none";
    const obj = document.createElement("span")
    obj.classList.add("premium")
    obj.textContent = "Premium User"
    usernameDiv.appendChild(obj)
    displayLeaderboard();
    displayTable();
    download();
    showFileHistory()
}

async function onSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
        const id = localStorage.getItem('editId');
        const userDetails = {
            description: text.value,
            amount: amount.value,
            category: category.value
        };
        if (id) {
            try {
                const response = await axios.put(
                    `${url}/editExpense/${id}`,
                    userDetails,
                    { headers: { 'Authorization': token } }
                );
                localStorage.removeItem('editId');
                text.value = "";
                amount.value = "";
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        } else {
            if (
                !id &&
                text.value &&
                amount.value &&
                category.value
            ) {
                try {
                    const user = await axios.post(
                        `${url}/addExpense`,
                        userDetails, { headers: { Authorization: token } }
                    );

                    console.log("details saved success");
                    updateDom(user.data.dataFromBack, { newEntry: true });

                    text.value = "";
                    amount.value = "";
                } catch (err) {
                    console.log(err);
                }
            } else {
                alert('Please fill all fields');
            }
        }
    } else {
        alert('Please login to add expense');
        window.location.href = 'login.html';
    }
}
// update dom
function updateDom(user, newEntry) {
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
    item.id = `${user._id}`;
    item.innerHTML = `${user.description}<span id="${user._id}">₹${user.amount} ${user.category}</span>
                    <button onclick=deleteUser('${user._id}') class="delete-btn">X</button>
                    <button onclick=editDetails('${user._id}')
                    class="delete-btn">Edit</button>`;
    if (newEntry) {
        userList.insertBefore(item, userList.firstChild)
    } else {
        userList.appendChild(item);
    }
    total();
}

async function deleteUser(id) {
    try {
        const token = localStorage.getItem("token")
        await axios.delete(`${url}/delete/${id}`, { headers: { Authorization: token } });
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
        const res = await axios.get(`${url}/getAllExpense`,
            { headers: { "Authorization": token } });

        res.data.fetchExpense.forEach((i) => {
            totalExpense += parseInt(i.amount);
            if (i.amount > 0) {
                positive += parseInt(i.amount);
            } else {
                negative += parseInt(i.amount);
            }
        });

        balance.textContent = `₹${totalExpense}/-`;
        money_minus.textContent = `₹${negative}/-`;
        money_plus.textContent = `₹${positive}/-`;
    } catch (err) {
        (err) => console.log(err);
    }
}
async function editDetails(id) {
    try {
        localStorage.setItem('editId', id)
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${url}/getOneExpense/${id}`,
            { headers: { 'Authorization': token } }
        );
        text.value = response.data.response.description;
        amount.value = response.data.response.amount;
        category.value = response.data.response.category
    } catch (err) {
        console.log(err)
    }
}

async function buyPremium(e) {
    const token = localStorage.getItem("token")
    const response = await axios.get(`${url}/purchase/premiummembership/`,
        { headers: { "Authorization": token } })
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const payment = await axios.post(`${url}/purchase/updatetransactionstatus/`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Authorization": token } })

            alert("you are a premium user now!!")
            razorpaySubmit.style.display = "none";
            showPremiumUserFeatures()
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open()
    e.preventDefault();
    rzp1.on("payment.failed", async function (response) {
        const token = localStorage.getItem("token")
        const payment = await axios.post(`${url}/purchase/updatetransactionstatus/`, {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
        }, { headers: { "Authorization": token } })
        alert("Something Went Wrong")
    })
}
function displayLeaderboard() {
    leaderboard.style.display = "block";
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.classList.add("leaderboardButton")
    inputElement.value = "Show Leaderboard"
    inputElement.onclick = async () => {
        const token = localStorage.getItem("token")
        const userLeaderboardArray = await axios.get(`${url}/premium/showleaderboard`,
            { headers: { Authorization: token } })
        leaderboardUl.innerHTML = ""
        userLeaderboardArray.data.leaderboardData.forEach(user => {
            const li = document.createElement("li")
            li.innerHTML = `${user.name} : ${user.totalExpense || "0"}`
            leaderboardUl.appendChild(li)
        })
    }
    leaderboard.appendChild(inputElement)
}
//display table of expenses 

function displayTable() {
    document.getElementById("table-div").style.display = "block"
    const tableForm = document.getElementById("table-form")
    tableForm.addEventListener("submit", display)
    async function display(e) {
        e.preventDefault();
        const token = localStorage.getItem("token")
        const getTableData = await axios.get(`${url}/premium/showtable`,
            { headers: { Authorization: token } })
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
//downloads expense data of user

function download() {
    const button = document.createElement("button")
    button.textContent = "download"
    button.classList.add("download")
    leaderboard.appendChild(button)
    button.addEventListener('click', () => {
        const token = localStorage.getItem("token")
        axios.get(`${url}/user/download`, { headers: { Authorization: token } })
            .then((response) => {
                if (response.status === 201) {
                    var a = document.createElement("a");
                    a.href = response.data.url;
                    a.download = 'myexpense.csv';
                    a.click();
                    showFileHistory()
                } else {
                    throw new Error(response.data.message)
                }
            })
            .catch((err) => {
                console.log(err)
            });
    })
}
//shows download file history

async function showFileHistory() {
    try {
        const token = localStorage.getItem("token")
        const allFiles = await axios.get(`${url}/premium/getfilehistory`,
            { headers: { Authorization: token } })
        if (allFiles) {
            document.getElementById("file-history").style.display = "block";
            allFiles.data.files.forEach(file => {
                const li = document.createElement("li")
                li.innerHTML = `<a href=${file.fileUrl}>${file.fileName}</a>`
                document.getElementById("file-history-ul").appendChild(li)
            })
        } else {
            const item = document.createElement(li)
            li.textContent = ("no file download history")
            document.getElementById("file-history-ul").appendChild(item)
        }
    } catch (err) {
        console.log(err)
    }
}
//logout 
logOut.addEventListener("click", () => {
    localStorage.removeItem("token")
    window.location.href = "loginPage.html"
})