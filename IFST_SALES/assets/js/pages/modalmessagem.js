// Função para exibir o modal com uma mensagem específica
function showMessageModal(message) {
  const modalBody = document.getElementById('messageModalBody');
  if (modalBody) {
    modalBody.textContent = message;

    const messageModalElement = document.getElementById('messageModal');
    if (messageModalElement) {
      const messageModal = new bootstrap.Modal(messageModalElement);
      messageModal.show();
    } else {
      console.error('Modal element not found.');
    }
  } else {
    console.error('Modal body element not found.');
  }
}

// Função para exibir o modal com uma mensagem de erro
function showErrorModal(error) {
  showMessageModal(`Erro: ${error}`);
}

// Função para exibir o modal com uma mensagem de sucesso
function showSuccessModal(message) {
  showMessageModal(`Sucesso: ${message}`);
}

// Função que será chamada ao fechar o modal
function handleCloseModal() {
  // Fechar todos os modais abertos
  closeAllOpenModals();
  window.location.reload();
}

// Função para lidar com a resposta da operação
function handleResponse(response) {
  // Fechar modais abertos
  closeAllOpenModals();

  if (response.ok) {
    showSuccessModal('Operação realizada com sucesso!');
  } else {
    response.json().then(error => {
      switch (error.type) {
        case 'ValidationError':
          showErrorModal(`Erro de validação: ${error.error}`);
          break;
        case 'UniqueConstraintError':
          showErrorModal(`Erro de unicidade: ${error.error}`);
          break;
        case 'NotFoundError':
          showErrorModal(`Erro: ${error.error}`);
          break;
        case 'ServerError':
          showErrorModal(`Erro no servidor: ${error.error}`);
          console.error('Detalhes do erro:', error.details);
          break;
        default:
          showErrorModal('Erro desconhecido');
      }
    }).catch(() => {
      showErrorModal('Erro desconhecido');
    });
  }
}

// Função para fechar todos os modais abertos
function closeAllOpenModals() {
  const openModals = document.querySelectorAll('.modal.show');
  openModals.forEach(modal => {
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) {
      bsModal.hide();
    }
  });
}
