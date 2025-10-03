const form = document.getElementById('booking-form');
const resultMsg = document.getElementById('result-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultMsg.style.display = 'none';

  if (!document.getElementById('agree').checked) {
    showResult('You must agree to the rental terms.', true);
    return;
  }

  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    date: document.getElementById('date').value,
    start_time: document.getElementById('start_time').value,
    end_time: document.getElementById('end_time').value,
    address: document.getElementById('address').value.trim(),
    zip: document.getElementById('zip').value.trim(),
    moonbounce: getSelectedOptions('moonbounce'),
    waterslide: getSelectedOptions('waterslide'),
    combo: getSelectedOptions('combo'),
    obstacle: getSelectedOptions('obstacle'),
    addons: getSelectedOptions('addons'),
    concessions: getSelectedOptions('concessions'),
    notes: document.getElementById('notes').value.trim(),
    payment: document.getElementById('payment').value,
    signature: document.getElementById('signature').value.trim(),
    agreed: true
  };

  const allItems = [].concat(payload.moonbounce, payload.waterslide, payload.combo, payload.obstacle, payload.addons, payload.concessions);
  const itemsTotal = calcItemsTotal(allItems);
  const deliveryFee = Number(window.deliveryFee || 0);
  payload.items_total = itemsTotal;
  payload.delivery_fee = deliveryFee;
  payload.grand_total = itemsTotal + deliveryFee;

  try {
    const res = await fetch('/your-backend-endpoint', { // replace with your own server URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok) {
      form.reset();
      document.getElementById('delivery-result').textContent = "";
      window.deliveryFee = 0;

      showResult(`Booking received! Reference: ${data.id}. A confirmation email has been sent to ${payload.email}.`, false, true);

    } else {
      showResult(data.error || 'Failed to submit booking. Try again later.', true);
    }

  } catch (err) {
    showResult('Error sending booking. Check your connection or try again later.', true);
    console.error(err);
  }
});

function showResult(msg, isError = false, isSuccess = false) {
  resultMsg.style.display = 'block';
  resultMsg.textContent = msg;
  resultMsg.className = isError ? 'error' : (isSuccess ? 'success' : '');
}