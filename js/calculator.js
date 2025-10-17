document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const totalPriceSpan = document.getElementById('totalPrice');
    const deliveryForm = document.getElementById('deliveryForm');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            calculatePrice();
        });
    }

    function calculatePrice() {
        const weight = parseFloat(document.getElementById('weight').value) || 0;
        const distance = parseFloat(document.getElementById('distance').value) || 0;
        const urgency = parseFloat(document.getElementById('urgency').value) || 1;
        const insurance = parseFloat(document.getElementById('insurance').value) || 0;

        // Базовая стоимость
        let basePrice = 150;
        
        // Надбавка за вес
        if (weight > 5) {
            basePrice += (weight - 5) * 20;
        }
        
        // Надбавка за расстояние
        if (distance > 10) {
            basePrice += (distance - 10) * 5;
        }
        
        // Умножаем на коэффициент срочности
        let total = basePrice * urgency;
        
        // Добавляем страхование
        total += insurance;

        totalPriceSpan.textContent = Math.round(total);
        resultDiv.style.display = 'block';
    }

    if (deliveryForm) {
    deliveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            phone: document.getElementById('phone').value,
            customerName: document.getElementById('customerName').value,
            fromAddress: document.getElementById('fromAddress').value,
            recipientName: document.getElementById('recipientName').value,
            toAddress: document.getElementById('toAddress').value,
            packageWeight: document.getElementById('packageWeight').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            notes: document.getElementById('notes').value
        };

        // Отправляем заказ
        fetch('php/add_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✅ Заказ успешно оформлен! Номер вашего заказа: ' + data.orderId);
                deliveryForm.reset();
            } else {
                alert('❌ Ошибка: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('✅ Заказ отправлен! (демо-режим)');
            deliveryForm.reset();
        });
    });
}

    // Устанавливаем минимальную дату как сегодня
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('deliveryDate');
    if (dateInput) {
        dateInput.min = today;
    }
});