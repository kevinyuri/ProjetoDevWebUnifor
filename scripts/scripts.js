let isUpdate = false;
async function fetchData() {
    const response = await fetch(
      "https://uniforusuariosproject.azurewebsites.net/v1/usuarios"
    );
    const data = await response.json();
    return data;
}

function criarUsuario(){
    document.getElementById('userModal').classList.remove('hidden');
    if (!isUpdate){
        document.getElementById('criarModal').innerText = 'Criar Conta'
    }
    else {
        document.getElementById('criarModal').innerText = 'Editar'
    }
}

function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
    isUpdate = false;
    document.getElementById('nome').value = '';
    document.getElementById('sobrenome').value = '';
    document.getElementById('username').value = '';
    document.getElementById('senha').value = '';
}

async function handle() {
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const username = document.getElementById('username').value;
    const senha = document.getElementById('senha').value;
    const idUser = document.getElementById('idUser').value;

    if (idUser){
        isUpdate = true;
    }

    if (!nome || !sobrenome || !username || !senha) {
        Swal.fire({
            title: "Erro",
            text: "Todos os campos são obrigatórios",
            icon: "error"
        });
        return;
    }

    const userData = {
        nome,
        sobrenome,
        username,
        senha,
        idUser
    };

    try {
        if (!isUpdate){
            await createUser(userData);
            closeModal();
            Swal.fire({
                title: "Usuário criado!",
                text: "O usuário foi criado com sucesso.",
                icon: "success"
            }).then(() => {
                location.reload();
            });
        }
        else {
            await updateUser(userData);
            closeModal();
            Swal.fire({
                title: "Usuário editado!",
                text: "O usuário foi editado com sucesso.",
                icon: "success"
            }).then(() => {
                location.reload();
            });
        }
        
    } catch (error) {
        Swal.fire({
            title: "Erro",
            text: error.message,
            icon: "error"
        });
    }
}

async function createUser(data) {
    
    try {
        const response = await fetch('https://uniforusuariosproject.azurewebsites.net/v1/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Erro ao criar usuário');
        }
        return response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updateUser(data) {
    const id = data.idUser;
    delete data.idUser;
    console.log(id);

    try {
        const response = await fetch(`https://uniforusuariosproject.azurewebsites.net/v1/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Erro ao editar usuário');
        }
        isUpdate = false;
        return
    } catch (error) {
        throw new Error(error.message);
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

async function deleteUser(id) {
    console.log(id);
    // Confirmar exclusão com SweetAlert2
    Swal.fire({
        title: 'Tem certeza?',
        text: "Você deseja realmente excluir este usuário?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`https://uniforusuariosproject.azurewebsites.net/v1/usuarios/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    throw new Error('Erro ao excluir usuário');
                }
                Swal.fire({
                    title: "Usuário excluído!",
                    text: "O usuário foi excluído com sucesso.",
                    icon: "success"
                }).then(() => {
                    location.reload();
                });
            } catch (error) {
                Swal.fire({
                    title: "Erro",
                    text: error.message,
                    icon: "error"
                });
            }
        }
    });
}

async function editUserModal(id) {
    try {
        isUpdate = true;
        criarUsuario();
        // Fetch user details by ID
        const response = await fetch(`https://uniforusuariosproject.azurewebsites.net/v1/usuarios/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar detalhes do usuário');
        }
        const user = await response.json();
        document.getElementById('nome').value = user.nome;
        document.getElementById('sobrenome').value = user.sobrenome;
        document.getElementById('username').value = user.userName;
        document.getElementById('senha').value = user.senha;
        document.getElementById('idUser').value = user.id;
        isUpdate = true;
    } catch (error) {
        Swal.fire({
            title: 'Erro',
            text: error.message,
            icon: 'error'
        });
    }
}

async function populateDataTable() {
    const data = await fetchData();
    const table = $("#example")
        .DataTable({
        data: data,
        columns: [
            { title: "Nome", data: "nome", className: "px-4 py-2" },
            { title: "Name", data: "sobrenome", className: "px-4 py-2" },
            { title: "Usuario", data: "userName", className: "px-4 py-2" },
            {
            title: "Ações",
            className: "px-4 py-2 m-auto flex justify-center",
            orderable: false, // This column won't be sortable
            searchable: false, // This column won't be included in searches
            render: function (data, type, row, meta) {
                return `<button onclick="editUserModal(${row.id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Editar</button>
                        <button onclick="deleteUser(${row.id})" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Excluir</button>`;
            },
            },
            // Add more columns as needed
        ],
        responsive: true,
        language: {
            search: "Buscar:",
            searchPlaceholder: "Buscar...",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "Nenhum registro encontrado",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoEmpty: "Sem registros disponíveis",
            infoFiltered: "(filtrado de _MAX_ registros totais)",
            paginate: {
            first: "Primeira",
            last: "Última",
            next: "Próxima",
            previous: "Anterior",
            },
        },
        })
        .columns.adjust()
        .responsive.recalc();
}



$(document).ready(function () {
populateDataTable();
});