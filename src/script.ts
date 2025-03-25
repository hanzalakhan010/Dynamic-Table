let host = 'https://miniature-enigma-jqq964595v53p5qj-5555.app.github.dev'

type User = {
    id: number,
    name: string,
    email: string,
    city: string
}

let users: User[] = []
let selectedUsers: User[] = []


const loadAllUsers = async () => {
    try {
        let response = await fetch(`${host}/users`)
        let data = await response.json()
        if (data) {
            users = data
            selectedUsers = data
        }
    }
    catch {
        console.log('Network Error')
    }
}

const search = () => {
    let searchText = (document.getElementById('searchInput') as HTMLInputElement).value
    if (searchText) {
        selectedUsers = users.filter((user) => user.name.includes(searchText))
        if (selectedUsers) {
            renderSelectedUsers()
        }
        else {
            let statusTag = document.getElementById('status')
            if (statusTag) {
                statusTag.innerText = 'No match Found'

            }
        }
    }
    else {
        selectedUsers = users
        renderSelectedUsers()
    }
}

const deleteUser = async (id: string) => {
    // selectedUsers = selectedUsers.filter((user) => user.id !== id)
    console.log(id)
    let response = await fetch(`${host}/users/${id}`, {
        method: 'delete'
    })
    let data = await response.json()
    if (response.ok) {

        selectedUsers = selectedUsers.filter(user => user.id !== id)
    }
    renderSelectedUsers()
}

const edit = (id: string) => {
    let name_td = document.getElementById(`${id}-name`)
    let email_td = document.getElementById(`${id}-email`)
    let city_td = document.getElementById(`${id}-city`)
    let editBtn = (document.getElementById(`${id}-editBtn`) as HTMLButtonElement)
    if (name_td && email_td && editBtn) {
        name_td?.setAttribute('contentEditable', 'true')
        email_td?.setAttribute('contentEditable', "true")
        city_td?.setAttribute('contentEditable', "true")
        editBtn.textContent = 'Save'
        editBtn.onclick = () => saveEdit(id)
    }
}
const saveEdit = async (id: string) => {
    let response = await fetch(`${host}/users/${id}`, {
        method: "put",
        body: JSON.stringify({
            id,
            name: document.getElementById(`${id}-name`)?.innerText,
            email: document.getElementById(`${id}-email`)?.innerText,
            city: document.getElementById(`${id}-city`)?.innerText
        })
    })
    if (response.ok) {
        let editBtn = (document.getElementById(`${id}-editBtn`) as HTMLButtonElement)
        let name_td = document.getElementById(`${id}-name`)
        let email_td = document.getElementById(`${id}-email`)
        let city_td = document.getElementById(`${id}-city`)
        if (name_td && email_td && editBtn) {
            name_td?.setAttribute('contentEditable', 'false')
            email_td?.setAttribute('contentEditable', "false")
            city_td?.setAttribute('contentEditable', "false")
        }
        editBtn.textContent = 'Edit'
        editBtn.onclick = () => edit(id)
    }

}

const renderSelectedUsers = () => {
    let tbody = document.getElementById('tbody')
    if (tbody) {
        tbody.innerHTML = ''
    }
    if (selectedUsers) {
        selectedUsers.forEach((user) => {
            tbody?.insertAdjacentHTML('beforeend', `
                <tr >
                    <td id = ${user.id}-name>${user.name}</td>
                    <td id = ${user.id}-email>${user.email}</td>
                    <td id = ${user.id}-city>${user.city}</td>
                    <td><button onclick = "edit('${user.id}')" id = ${user.id}-editBtn>Edit</button></td>
                    <td><button onclick = "deleteUser('${user.id}')">Delete</button></td>
                </tr>
                `)
        })
    }
}


loadAllUsers().then(() => {
    renderSelectedUsers()
}
)

document.getElementById('search-btn')?.addEventListener('click', (event) => {
    event.preventDefault()
    search()
})