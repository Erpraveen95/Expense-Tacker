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

//premium
const razorpaySubmit = document.getElementById("buy-premium")
const leaderboard = document.getElementById("leaderboard")
const leaderboardUl = document.getElementById("ul-leaderboard")

document.getElementById("rows-per-page").onchange = (e) => {
    // console.log(e.target.value);
    localStorage.setItem("rowsPerPage", e.target.value);
};
form.addEventListener("submit", onSubmit);
razorpaySubmit.addEventListener("click", buyPremium)

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("token")
        const rows = localStorage.getItem("rowsPerPage")
        const res = await axios
            .get("https://13.233.250.3:3000/getExpense/?page=1",
                { headers: { "Autherization": token, Rows: rows } })
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
    // console.log(e.target);
    const page = e.target.innerHTML;
    let token = localStorage.getItem("token");

    let rows = localStorage.getItem("rowsPerPage");
    if (rows == null) {
        rows = 3;
    }
    let res = await axios.get(
        `https://13.233.250.3:3000/getExpense/?page=${page}`,
        {
            headers: { "Autherization": token, Rows: rows },
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
                "https://13.233.250.3:3000/addExpense",
                userDetails, { headers: { Autherization: token } }
            );

            console.log("details saved success");
            updateDom(user.data.dataFromBack[0], { newEntry: true });

            text.value = "";
            amount.value = "";
        }
    } catch (err) {
        console.log(err);
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
    item.id = `${user.id}`;
    item.innerHTML = `${user.description}<span id="${user.id}">₹${user.amount} ${user.category}</span>
                    <button onclick=deleteUser('${user.id}') class="delete-btn">X</button>
                    <button onclick=editDetails('${user.description}','${user.amount}','${user.id}')
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
        await axios.delete(`https://13.233.250.3:3000/delete/${id}`, { headers: { Autherization: token } });
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
        const res = await axios.get("https://13.233.250.3:3000/getAllExpense",
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
    const response = await axios.get("https://13.233.250.3:3000/purchase/premiummembership/",
        { headers: { "Autherization": token } })
    console.log(response)
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const payment = await axios.post("https://13.233.250.3:3000/purchase/updatetransactionstatus/", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, { headers: { "Autherization": token } })
            console.log(payment, "after success")

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
        console.log(response)
        const payment = await axios.post("https://13.233.250.3:3000/purchase/updatetransactionstatus/", {
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
        const userLeaderboardArray = await axios.get("https://13.233.250.3:3000/premium/showleaderboard",
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
//display table of expenses 

function displayTable() {
    document.getElementById("table-div").style.display = "block"
    const tableForm = document.getElementById("table-form")
    tableForm.addEventListener("submit", display)
    async function display(e) {
        e.preventDefault();
        const token = localStorage.getItem("token")
        const getTableData = await axios.get("https://13.233.250.3:3000/premium/showtable",
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
//downloads expense data of user

function download() {
    const button = document.createElement("button")
    button.textContent = "download"
    button.classList.add("download")
    leaderboard.appendChild(button)
    button.addEventListener('click', () => {
        const token = localStorage.getItem("token")
        axios.get('https://13.233.250.3:3000/user/download', { headers: { Autherization: token } })
            .then((response) => {
                console.log(response, "this is download resposne")
                if (response.status === 201) {
                    var a = document.createElement("a");
                    a.href = response.data.url;
                    a.download = 'myexpense.csv';
                    a.click();
                    console.log(response.data.url)
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
        const allFiles = await axios.get("https://13.233.250.3:3000/premium/getfilehistory",
            { headers: { Autherization: token } })
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
