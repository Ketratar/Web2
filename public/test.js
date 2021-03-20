//Something testable to check /public tree in server.js
function Magic() {
    console.log("Hello bratva");
}
//--------------------------------------------------------


//Getting ALL user something JSON data
async function GetAll() {
    //METHod GET
    const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // Is it success?
    if (response.ok === true) {
        const users = await response.json();
        let rows = document.querySelector("tbody");
        var usersarray = Object.keys(users);
        usersarray.forEach(user => {
            rows.append(row(users, user));
        });
    }
}

//Searching with age filter
async function searchage() {
    //I need this
    const form = document.forms["userForm"];
    const age = form.elements["age_search"].value;

    if (age == 0)
        GetAll();

    // METHod GET again
    const response = await fetch("/api/users/search/" + age, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const users = await response.json();
        let rows = document.querySelector("tbody");
        var usersarray = Object.keys(users);
        usersarray.forEach(user => { rows.append(row(users, user)); })
    }
}


//Getting user with id
async function GetId(id) {
    const response = await fetch("/api/users/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms["userForm"];
        form.elements["id"].value = user.id;
        form.elements["name"].value = user.name;
        form.elements["age"].value = user.age;
    }
}


//Creating user strange thing
async function Create(userName, userAge) {
    // Oh that's new METHod POST to create something
    const response = await fetch("api/users", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tbody").append(row(user));
    }
}

//Changing user strange thing
async function Edit(userId, userName, userAge) {
    // METHod PUT to Edt our something
    const response = await fetch("api/users", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: userId,
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + user.id + "']").replaceWith(row(user));
    }
}

//Removes something with id
async function Delete(id) {
    //DELETE METHod
    const response = await fetch("/api/users/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector("tr[data-rowid='" + user.id + "']").remove();
    }
}

//If button Reset pressed it'll clear all forms
function reset() {
    const form = document.forms["userForm"];
    form.reset();
    form.elements["id"].value = 0;
}

//Here we're creating rows for <tbody>
function row(users, user) {

    //Creating row
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", users[user].id);

    //Creating collumns
    const idTd = document.createElement("td");
    idTd.append(users[user].id);
    tr.append(idTd);

    const nameTd = document.createElement("td");
    nameTd.append(users[user].name);
    tr.append(nameTd);

    const ageTd = document.createElement("td");
    ageTd.append(users[user].age);
    tr.append(ageTd);

    //creating links
    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", users[user].id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Change");

    //Adding Event to click Change
    editLink.addEventListener("click", e => {

        e.preventDefault();
        //Thats debug thing
        //console.log(users[user].id);
        GetId(users[user].id);
        window.scrollTo(0, 0);
    });
    linksTd.append(editLink);

    //removing links
    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", users[user].id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Delete");

    //Adding Event to click Delete
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        Delete(users[user].id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    //Return out row
    return tr;
}
//Event for Reset button
document.getElementById('reset').addEventListener('click', function (e) {

    e.preventDefault();
    reset();
})

//if we're using filter for age, clearing rows, to get new table with filter on
function tableclear() {
    let rows = document.querySelector("tbody");
    //Smart way to delete rows ;D
    while (rows.rows[0])
        rows.deleteRow(0);
}

// Event for search button
document.getElementById('search').addEventListener('click', function (e) {
    e.preventDefault();
    //Clearing rows
    tableclear();
    //Searching filter
    searchage();
})

//If clicked Change or Save button, getting our data or put to JSON file
document.forms["userForm"].addEventListener("submit", e => {
    e.preventDefault();
    const form = document.forms["userForm"];
    const id = form.elements["id"].value;
    const name = form.elements["name"].value;
    const age = form.elements["age"].value;
    if (id == 0)
        Create(name, age);
    else
        Edit(id, name, age);

    //reloading page, to get all data
    window.location.reload();
});

//Default on page opening to get all data
GetAll();