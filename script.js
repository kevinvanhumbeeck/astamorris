let basket = [];
const SHIPPING_NAME = 'Verzending';
const STORAGE_KEY = 'astamorris_basket_v1';

function saveBasket() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
    } catch(e) {
        // ignore storage errors
    }
}

function loadBasket() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                basket = parsed.filter(i => i && typeof i === 'object' && 'name' in i);
            }
        }
    } catch(e) { /* ignore */ }
}

function clearBasketStorage() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
}

function addToBasket(type) {
    let item = {};
    let btnId
    if (type === 'A') {
        item.name = 'T-Shirt';
        item.size = document.getElementById('sizeA').value;
        item.color = document.getElementById('colorA').value;
        item.amount = parseInt(document.getElementById('amountA').value, 10);
        item.price = 30;
        btnId = 'addA';
    } else if (type === 'B') {
        item.name = 'Sweater';
        item.size = document.getElementById('sizeB').value;
        item.color = document.getElementById('colorB').value;
        item.amount = parseInt(document.getElementById('amountB').value, 10);
        item.price = 45;
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
    saveBasket();
}

function updateBasketDisplay() {
    const displayDiv = document.getElementById('basketItemsDisplay');
    if (!displayDiv) return;
    const realItems = basket.filter(i => i.name !== SHIPPING_NAME);
    const hasReal = realItems.length > 0;
    let total = 0;
    let html = '';
    if (hasReal) {
        html += '<ul>';
        basket.forEach((item, idx) => {
            if (item.name === SHIPPING_NAME && !hasReal) return; // hide shipping if no real items
            const itemTotal = item.price * item.amount;
            total += itemTotal;
            const isShipping = item.name === SHIPPING_NAME;
            const qtyControls = !isShipping ? ` <span class="qty-wrap"><button type="button" class="qty-btn" onclick="decrementItem(${idx})">-</button><span class="qty-val">${item.amount}</span><button type="button" class="qty-btn" onclick="incrementItem(${idx})">+</button></span>` : `${item.amount}`;
            html += `<li>${qtyControls} x ${item.name}${item.size && item.color ? ` (${item.size}, ${item.color})` : ''} - € ${itemTotal.toFixed(2)} ${!isShipping ? `<button type="button" onclick="removeBasketItem(${idx})" class="remove-btn">Verwijder</button>` : ''}</li>`;
        });
        html += '</ul>';
    }
    if (!hasReal) {
        html += '<em id="basketEmptyMsg">Geen producten toegevoegd.</em>';
        total = 0; // ignore shipping cost when alone
    }
    html += `<strong style="display:block;margin-top:6px;">Totaal: € ${total.toFixed(2)}</strong>`;
    document.getElementById('basketTotal').value = total.toFixed(2);
    displayDiv.innerHTML = html;
    updateSubmitState();
}

function removeBasketItem(idx) {
    basket.splice(idx, 1);
    updateBasketDisplay();
    updateHiddenBasket();
    saveBasket();
}

function updateHiddenBasket() {
    const realItems = basket.filter(i => i.name !== SHIPPING_NAME);
    let serialized = [];
    if (realItems.length > 0) {
        serialized = basket; // include shipping if present
    }
    const hidden = document.getElementById('basketItems');
    if (hidden) hidden.value = JSON.stringify(serialized);
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
    const exists = basket.some(item => item.name === SHIPPING_NAME);
    if (!exists) {
        basket.push({ name: SHIPPING_NAME, amount: 1, price: 6.95 });
        updateBasketDisplay();
        updateHiddenBasket();
        saveBasket();
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
            basket = basket.filter(item => item.name !== SHIPPING_NAME);
            updateBasketDisplay();
            updateHiddenBasket();
            saveBasket();
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
    // Prevent form submission without real items
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const realItems = basket.filter(i => i.name !== SHIPPING_NAME);
            if (realItems.length === 0) {
                e.preventDefault();
                let emptyEl = document.getElementById('basketEmptyMsg');
                if (!emptyEl) {
                    updateBasketDisplay();
                    emptyEl = document.getElementById('basketEmptyMsg');
                }
                if (emptyEl) {
                    emptyEl.classList.remove('flash-error');
                    void emptyEl.offsetWidth; // reflow
                    emptyEl.classList.add('flash-error');
                }
            } else {
                // Successful submission: clear storage (server still receives hidden inputs)
                clearBasketStorage();
            }
        });
    }
    // Load basket from storage on startup after elements exist
    loadBasket();
    // Ensure shipping selection reflects basket
    const shippingSelect = document.getElementById('shipping');
    if (shippingSelect) {
        const hasShipping = basket.some(i => i.name === SHIPPING_NAME);
        shippingSelect.value = hasShipping ? 'ja' : 'nee';
    }
    updateBasketDisplay();
    updateHiddenBasket();
});

function incrementItem(idx) {
    if (!basket[idx]) return;
    basket[idx].amount += 1;
    updateBasketDisplay();
    updateHiddenBasket();
    saveBasket();
}

function decrementItem(idx) {
    if (!basket[idx]) return;
    basket[idx].amount -= 1;
    if (basket[idx].amount <= 0) {
        basket.splice(idx, 1);
    }
    updateBasketDisplay();
    updateHiddenBasket();
    saveBasket();
}

function updateSubmitState() {
    const btn = document.getElementById('submitOrder');
    const hint = document.getElementById('submitHint');
    if (!btn) return;
    const hasReal = basket.some(i => i.name !== SHIPPING_NAME);
    btn.disabled = !hasReal;
    if (hint) {
        hint.style.display = hasReal ? 'none' : 'block';
    }
}