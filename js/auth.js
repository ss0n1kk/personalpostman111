document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('php/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password})
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Сохраняем информацию о пользователе
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('userEmail', data.email);
                    localStorage.setItem('userPhone', data.phone);
                    
                    // Перенаправляем в зависимости от роли
                    if (data.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'user.html';
                    }
                } else {
                    alert('Ошибка входа: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Демо-режим: проверяем локально
                if (username === 'admin' && password === 'admin123') {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('userId', '1');
                    localStorage.setItem('username', 'admin');
                    window.location.href = 'admin.html';
                } else {
                    alert('Неверный логин или пароль');
                }
            });
        });
    }

    // Проверка авторизации при загрузке защищенных страниц
    const protectedPages = ['admin.html', 'user.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const userRole = localStorage.getItem('userRole');
        
        if (!isLoggedIn) {
            window.location.href = 'login.html';
            return;
        }
        
        // Проверяем права доступа
        if (currentPage === 'admin.html' && userRole !== 'admin') {
            window.location.href = 'user.html';
        }
    }
});