import API from './api.js';

export const getAppointment = async () => {
    const response = await fetch(`${API}/agendamentos`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message|| data.error ||'Nenhum agendamento foi encontrado...')
    }

    return data.data || [];
};

export const createAppointment = async (formData) => {
    const response = await fetch(`${API}/agendamentos`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Não foi possível criar um agendamento.');
    }

    return data;
}

export const deleteAppointment = async(id) => {
    const response = await fetch(`${API}/agendamentos/${id}`, {
        method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Não foi possível deletar este agendamento');
    }

    return data;
}

export const updateAppointment = async(id, dados) => {
    const response = await fetch(`${API}/agendamentos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(dados),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Não foi possível editar este pedido!');
    }

    return data.data;
}