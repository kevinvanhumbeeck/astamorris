let basket = [];

function addToBasket(type) {
    let item = {};
    let btnId
    if (type === 'A') {
        item.name = 'Astamorris T-Shirt';
        item.size = document.getElementById('sizeA').value;
        item.color = document.getElementById('colorA').value;
        item.amount = parseInt(document.getElementById('amountA').value, 10);
        item.price = 30;
        btnId = 'addA';
    } else if (type === 'B') {
        item.name = 'Astamorris Sweater';
        item.size = document.getElementById('sizeB').value;
        item.color = document.getElementById('colorB').value;
        item.amount = parseInt(document.getElementById('amountB').value, 10);
        item.price = 30;
        btnId = 'addB';
    }
    basket.push(item);
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.textContent = 'Toegevoegd!';
    btn.style.backgroundColor = '#dbcba9';
    btn.style.color = '#1a1613';
    btn.style.transform = 'scale(1.2)';
    btn.style.transition = 'all 0.75s';

    setTimeout(() => {
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.style.transform = '';
    }, 900);
    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Voeg toe';
    }, 1200);
    updateBasketDisplay();
    updateHiddenBasket();
}

function updateBasketDisplay() {
    const basketDiv = document.getElementById('basket');
    basketDiv.innerHTML = '';
    if (basket.length === 0) {
        basketDiv.innerHTML = '<em>Geen producten toegevoegd.</em>';
        return;
    }
    let total = 0;
    let html = '<ul>';
    basket.forEach((item, idx) => {
        let itemTotal = item.price * item.amount;
        total += itemTotal;
        html += `<li>
            ${item.amount} x ${item.name}${item.size && item.color ? ` (${item.size}, ${item.color})` : ''} - € ${itemTotal.toFixed(2)}
            <button type="button" onclick="removeBasketItem(${idx})" style="margin-left:8px;font-size:12px;">Verwijder</button>
        </li>`;
    });
    html += '</ul>';
    html += `<strong>Totaal: € ${total.toFixed(2)}</strong>`;
    document.getElementById('basketTotal').value = total.toFixed(2);
    basketDiv.innerHTML = html;
}

function removeBasketItem(idx) {
    basket.splice(idx, 1);
    updateBasketDisplay();
    updateHiddenBasket();
}

function updateHiddenBasket() {
    document.getElementById('basketItems').value = JSON.stringify(basket);
}

window.onload = function() {
    updateBasketDisplay();
    toggleAddressFields();
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.product button').forEach((btn, idx) => {
        btn.onclick = function() {
            addToBasket(idx === 0 ? 'A' : 'B');
        };
    });
    updateBasketDisplay();
    updateHiddenBasket();
});

function addShippingToBasket() {
    // Check if shipping is already in basket
    const exists = basket.some(item => item.name === 'Verzending');
    if (!exists) {
        basket.push({
            name: 'Verzending',
            amount: 1,
            price: 6.95
        });
        updateBasketDisplay();
        updateHiddenBasket();
    }
}

function toggleAddressFields() {
    var shipping = document.getElementById('shipping').value;
    var addressFields = [
        'street', 'number', 'postalcode', 'city'
    ];
    addressFields.forEach(function(id) {
        var label = document.querySelector('label[for="' + id + '"]');
        var input = document.getElementById(id);
        if (shipping === 'ja') {
            label.style.display = '';
            input.style.display = '';
            input.required = true;
        } else {
            label.style.display = 'none';
            input.style.display = 'none';
            input.required = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('shipping').addEventListener('change', function() {
        if (this.value === 'ja') {
            addShippingToBasket();
        } else {
            // Remove shipping from basket if exists
            basket = basket.filter(item => item.name !== 'Verzending');
            updateBasketDisplay();
            updateHiddenBasket();
        }
    });

    document.getElementById('colorA').addEventListener('change', function() {
        const img = document.getElementById('tshirtImg');
        const color = this.value;
        img.src = 'img/tshirt_' + color + '.png';
    });

    document.getElementById('colorB').addEventListener('change', function() {
        const img = document.getElementById('sweaterImg');
        const color = this.value;
        img.src = 'img/sweater_' + color + '.png';
    });
});