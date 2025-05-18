<template>
    <div class="admin-consultations">
      <div class="header">
        <h2>Управление заявками</h2>
      </div>
  
      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
      <table v-else class="consultations-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Сообщение</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="consultation in consultations.data" :key="consultation.id">
            <td>{{ consultation.name }}</td>
            <td>
              {{ consultation.email }}
            </td>
            <td>{{ consultation.phone }}</td>
            <td class="message-cell">{{ consultation.message }}</td>
            <td>
              <select 
                v-model="consultation.status_id"
                @change="updateStatus(consultation.id, consultation.status_id)"
                class="status-select"
              >
                <option value="1">Новая</option>
                <option value="2">В обработке</option>
                <option value="3">Обработана</option>
                <option value="4">Отменена</option>
              </select>
            </td>
            <td>{{ formatDate(consultation.created_at) }}</td>
            <td class="actions">
              <button
                @click="showDeleteConfirmation(consultation.id)"
                class="delete-btn"
                :disabled="deleteLoading[consultation.id]"
              >
                {{ deleteLoading[consultation.id] ? 'Удаление...' : 'Удалить' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Модальное окно подтверждения удаления -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Подтверждение удаления</h3>
          <p>{{ deleteMessage }}</p>
          
          <div class="modal-actions">
            <button @click="proceedWithDelete" class="confirm-btn">Удалить</button>
            <button @click="cancelDelete" class="cancel-btn">Отмена</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const consultations = ref({ data: [] });
  const loading = ref(true);
  const deleteLoading = ref({});
  const errorMessage = ref('');
  
  const showDeleteModal = ref(false);
  const deleteMessage = ref('');
  const deleteConsultationId = ref(null);
  
  const fetchConsultations = async () => {
    try {
      loading.value = true;
      const response = await axios.get('http://localhost:3000/api/consultations');
      consultations.value = response.data;
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
      errorMessage.value = 'Не удалось загрузить список заявок';
    } finally {
      loading.value = false;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };
  
const updateStatus = async (id, statusId) => {
  // Сохраняем предыдущее значение для отката
  const prevStatus = consultations.value.data.find(c => c.id === id)?.status_id;
  
  try {
    // Оптимистичное обновление UI
    consultations.value.data = consultations.value.data.map(c => 
      c.id === id ? {...c, status_id: statusId} : c
    );

    const response = await axios.patch(
      `http://localhost:3000/api/consultations/${id}/status`,
      { status_id: statusId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Ошибка обновления статуса');
    }
  } catch (error) {
    console.error("Полная ошибка обновления:", {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    // Откат изменений в UI
    consultations.value.data = consultations.value.data.map(c => 
      c.id === id ? {...c, status_id: prevStatus} : c
    );

    errorMessage.value = error.response?.data?.error || 
                        error.message || 
                        'Ошибка обновления статуса';
  }
};
  
  const showDeleteConfirmation = (id) => {
    deleteConsultationId.value = id;
    deleteMessage.value = 'Вы уверены, что хотите удалить эту заявку?';
    showDeleteModal.value = true;
  };
  
  const proceedWithDelete = async () => {
    if (!deleteConsultationId.value) return;
  
    const id = deleteConsultationId.value;
    try {
      deleteLoading.value[id] = true;
      await axios.delete(`http://localhost:3000/api/consultations/${id}`);
      consultations.value.data = consultations.value.data.filter(c => c.id !== id);
    } catch (error) {
      console.error('Ошибка при удалении заявки:', error);
      errorMessage.value = 'Не удалось удалить заявку';
    } finally {
      deleteLoading.value[id] = false;
      showDeleteModal.value = false;
      deleteConsultationId.value = null;
    }
  };
  
  const cancelDelete = () => {
    showDeleteModal.value = false;
    deleteConsultationId.value = null;
  };
  
  onMounted(() => {
    fetchConsultations();
  });
  </script>
  
  <style scoped>
  .admin-consultations {
    padding: 1rem;
    overflow-x: auto;
  }
  
  .header {
    margin-bottom: 1.5rem;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
  }
  
  .error-message {
    color: #f44336;
    text-align: center;
    margin: 1rem 0;
  }
  
  .consultations-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .consultations-table th, 
  .consultations-table td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .consultations-table th {
    background-color: #f5f5f5;
    font-weight: 600;
    position: sticky;
    top: 0;
  }
  
  .message-cell {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .status-select {
    padding: 0.3rem;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
  
  .delete-btn {
    background-color: #f44336;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.3s;
  }
  
  .delete-btn:hover {
    opacity: 0.9;
  }
  
  .delete-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    text-align: left;
    max-width: 500px;
    width: 100%;
  }
  
  .modal-actions {
    margin-top: 1.5rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .confirm-btn {
    background-color: #f44336;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .cancel-btn {
    background-color: #ccc;
    color: black;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .confirm-btn:hover {
    background-color: #d32f2f;
  }
  
  .cancel-btn:hover {
    background-color: #bbb;
  }
  
  @media (max-width: 768px) {
    .consultations-table {
      display: block;
    }
    
    .consultations-table thead {
      display: none;
    }
    
    .consultations-table tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
    }
    
    .consultations-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100% !important;
      text-align: right;
      padding-left: 50%;
      position: relative;
      border-bottom: 1px solid #eee;
    }
    
    .consultations-table td::before {
      content: attr(data-label);
      position: absolute;
      left: 0;
      width: 45%;
      padding-left: 1rem;
      font-weight: bold;
      text-align: left;
    }
    
    .actions {
      justify-content: flex-end;
    }
  }
  </style>