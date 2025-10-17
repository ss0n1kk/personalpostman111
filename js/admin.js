document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    const ordersList = document.getElementById('ordersList');
    const partnersList = document.getElementById('partnersList');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            window.location.href = 'index.html';
        });
    }

    // Загрузка реальных заказов из базы
    loadOrders();
    loadPartnerApplications();

    // Автообновление каждые 10 секунд
    setInterval(loadOrders, 10000);
    setInterval(loadPartnerApplications, 10000);

    async function loadOrders() {
        try {
            const response = await fetch('php/get_orders.php');
            const data = await response.json();
            
            if (data.success) {
                displayOrders(data.orders);
            } else {
                ordersList.innerHTML = '<p>Ошибка загрузки заказов</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            ordersList.innerHTML = '<p>Ошибка соединения</p>';
        }
    }

    async function loadPartnerApplications() {
        try {
            const response = await fetch('php/get_partners.php');
            const data = await response.json();
            
            if (data.success) {
                displayPartnerApplications(data.partners);
            } else {
                partnersList.innerHTML = '<p>Ошибка загрузки заявок</p>';
            }
        } catch (error) {
            console.error('Error:', error);
            partnersList.innerHTML = '<p>Ошибка соединения</p>';
        }
    }

    function displayOrders(orders) {
        if (!ordersList) return;

        if (orders.length === 0) {
            ordersList.innerHTML = '<p>Нет заказов</p>';
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <h4>Заказ #${order.id} <small>(${order.created_at})</small></h4>
                <p><strong>📞 Телефон:</strong> ${order.phone}</p>
                <p><strong>👤 Отправитель:</strong> ${order.customer_name}</p>
                <p><strong>📍 Откуда:</strong> ${order.from_address}</p>
                <p><strong>👤 Получатель:</strong> ${order.recipient_name}</p>
                <p><strong>📍 Куда:</strong> ${order.to_address}</p>
                <p><strong>⚖️ Вес:</strong> ${order.package_weight} кг</p>
                <p><strong>📅 Дата доставки:</strong> ${order.delivery_date}</p>
                <p><strong>📝 Примечания:</strong> ${order.notes || 'нет'}</p>
                <p><strong>📊 Статус:</strong> 
                    <span class="order-status status-${order.status}">
                        ${getStatusText(order.status)}
                    </span>
                </p>
                <div style="margin-top: 1rem;">
                    <button onclick="updateOrderStatus(${order.id}, 'approved')" class="btn">✅ Одобрить</button>
                    <button onclick="updateOrderStatus(${order.id}, 'rejected')" class="btn btn-secondary">❌ Отклонить</button>
                    <button onclick="updateOrderStatus(${order.id}, 'pending')" class="btn">⏳ В ожидание</button>
                </div>
            </div>
        `).join('');
    }

    function displayPartnerApplications(partners) {
        if (!partnersList) return;

        if (partners.length === 0) {
            partnersList.innerHTML = '<p>Нет партнёрских заявок</p>';
            return;
        }

        partnersList.innerHTML = partners.map(partner => `
            <div class="order-item">
                <h4>Партнёрская заявка #${partner.id}</h4>
                <p><strong>🏢 Организация:</strong> ${partner.organization}</p>
                <p><strong>👤 Контактное лицо:</strong> ${partner.name}</p>
                <p><strong>📞 Телефон:</strong> ${partner.phone}</p>
                <p><strong>📄 Сообщение:</strong> ${partner.message || 'нет'}</p>
                <p><strong>📊 Статус:</strong> 
                    <span class="order-status status-${partner.status}">
                        ${getStatusText(partner.status)}
                    </span>
                </p>
                <div style="margin-top: 1rem;">
                    <button onclick="updatePartnerStatus(${partner.id}, 'approved')" class="btn">✅ Одобрить</button>
                    <button onclick="updatePartnerStatus(${partner.id}, 'rejected')" class="btn btn-secondary">❌ Отклонить</button>
                </div>
            </div>
        `).join('');
    }

    function getStatusText(status) {
        const statusMap = {
            'pending': '⏳ На рассмотрении',
            'approved': '✅ Одобрено', 
            'rejected': '❌ Отклонено'
        };
        return statusMap[status] || status;
    }
});

// Глобальные функции для кнопок
async function updateOrderStatus(orderId, status) {
    if (!confirm(`Изменить статус заказа #${orderId} на "${status}"?`)) return;
    
    try {
        const response = await fetch('php/update_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({orderId, status})
        });
        
        const data = await response.json();
        if (data.success) {
            alert(`✅ Статус заказа #${orderId} изменен!`);
            location.reload();
        } else {
            alert('❌ Ошибка: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Ошибка соединения');
    }
}

async function updatePartnerStatus(partnerId, status) {
    if (!confirm(`Изменить статус заявки #${partnerId} на "${status}"?`)) return;
    
    try {
        const response = await fetch('php/update_partner.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({partnerId, status})
        });
        
        const data = await response.json();
        if (data.success) {
            alert(`✅ Статус заявки #${partnerId} изменен!`);
            location.reload();
        } else {
            alert('❌ Ошибка: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Ошибка соединения');
    }
}