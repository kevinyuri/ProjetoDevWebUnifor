async function fetchData() {
    const response = await fetch(
      "https://uniforusuariosproject.azurewebsites.net/v1/usuarios"
    );
    const data = await response.json();
    return data;
}

function criarUsuario(){
    document.getElementById('userModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
}

async function handle() {
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const username = document.getElementById('username').value;
    const senha = document.getElementById('senha').value;

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
        senha
    };

    try {
        await createUser(userData);
        closeModal();
        Swal.fire({
            title: "Usuário criado!",
            text: "O usuário foi criado com sucesso.",
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

async function deleteUser(id) {
    debugger;
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
                return `<button onclick="editRow(${row.id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Editar</button>
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