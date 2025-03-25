"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
let host = 'https://miniature-enigma-jqq964595v53p5qj-5555.app.github.dev';
let users = [];
let selectedUsers = [];
const loadAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fetch(`${host}/users`);
        let data = yield response.json();
        if (data) {
            users = data;
            selectedUsers = data;
        }
    }
    catch (_a) {
        console.log('Network Error');
    }
});
const search = () => {
    let searchText = document.getElementById('searchInput').value;
    if (searchText) {
        selectedUsers = users.filter((user) => user.name.includes(searchText));
        if (selectedUsers) {
            renderSelectedUsers();
        }
        else {
            let statusTag = document.getElementById('status');
            if (statusTag) {
                statusTag.innerText = 'No match Found';
            }
        }
    }
    else {
        selectedUsers = users;
        renderSelectedUsers();
    }
};
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // selectedUsers = selectedUsers.filter((user) => user.id !== id)
    console.log(id);
    let response = yield fetch(`${host}/users/${id}`, {
        method: 'delete'
    });
    let data = yield response.json();
    if (response.ok) {
        selectedUsers = selectedUsers.filter(user => user.id !== id);
    }
    renderSelectedUsers();
});
const edit = (id) => {
    let name_td = document.getElementById(`${id}-name`);
    let email_td = document.getElementById(`${id}-email`);
    let city_td = document.getElementById(`${id}-city`);
    let editBtn = document.getElementById(`${id}-editBtn`);
    if (name_td && email_td && editBtn) {
        name_td === null || name_td === void 0 ? void 0 : name_td.setAttribute('contentEditable', 'true');
        email_td === null || email_td === void 0 ? void 0 : email_td.setAttribute('contentEditable', "true");
        city_td === null || city_td === void 0 ? void 0 : city_td.setAttribute('contentEditable', "true");
        editBtn.textContent = 'Save';
        editBtn.onclick = () => saveEdit(id);
    }
};
const saveEdit = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let response = yield fetch(`${host}/users/${id}`, {
        method: "put",
        body: JSON.stringify({
            id,
            name: (_a = document.getElementById(`${id}-name`)) === null || _a === void 0 ? void 0 : _a.innerText,
            email: (_b = document.getElementById(`${id}-email`)) === null || _b === void 0 ? void 0 : _b.innerText,
            city: (_c = document.getElementById(`${id}-city`)) === null || _c === void 0 ? void 0 : _c.innerText
        })
    });
    if (response.ok) {
        let editBtn = document.getElementById(`${id}-editBtn`);
        let name_td = document.getElementById(`${id}-name`);
        let email_td = document.getElementById(`${id}-email`);
        let city_td = document.getElementById(`${id}-city`);
        if (name_td && email_td && editBtn) {
            name_td === null || name_td === void 0 ? void 0 : name_td.setAttribute('contentEditable', 'false');
            email_td === null || email_td === void 0 ? void 0 : email_td.setAttribute('contentEditable', "false");
            city_td === null || city_td === void 0 ? void 0 : city_td.setAttribute('contentEditable', "false");
        }
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => edit(id);
    }
});
const renderSelectedUsers = () => {
    let tbody = document.getElementById('tbody');
    if (tbody) {
        tbody.innerHTML = '';
    }
    if (selectedUsers) {
        selectedUsers.forEach((user) => {
            tbody === null || tbody === void 0 ? void 0 : tbody.insertAdjacentHTML('beforeend', `
                <tr >
                    <td id = ${user.id}-name>${user.name}</td>
                    <td id = ${user.id}-email>${user.email}</td>
                    <td id = ${user.id}-city>${user.city}</td>
                    <td><button onclick = "edit('${user.id}')" id = ${user.id}-editBtn>Edit</button></td>
                    <td><button onclick = "deleteUser('${user.id}')">Delete</button></td>
                </tr>
                `);
        });
    }
};
loadAllUsers().then(() => {
    renderSelectedUsers();
});
(_a = document.getElementById('search-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (event) => {
    event.preventDefault();
    search();
});
