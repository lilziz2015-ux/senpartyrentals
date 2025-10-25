const form = document.getElementById('booking-form');
const resultMsg = document.getElementById('result-msg');

function getSelectedOptions(id) {
  const sel = document.getElementById(id);
  return sel ? Array.from(sel.selectedOptions).map(o => o.value) : [];
}

function calcItemsTotal(items) {
  const priceMap = {
    "Modular Moonbounce":200,"SpongeBob Moonbounce":200,"Castle Fun House":220,"Magic Castle w/ Hoop":230,"Princess Castle":220,
    "Giant Flip-Flop Splash":450,"Castle Splash Combo":480,"Dino Splash Adventure":450,"Wild Rapid":500,"Big Wave Slide":500,"Tropical Thunder (Wet/Dry)":480,"Dunk Tank":200,
    "Castle Combo":550,"High Sky Combo":600,"Jerrassic Combo":580,
    "Black Opps":650,"30 ft Backyard":800,"Extreme Obstacle":800,
    "Generator":100,"Table":10,"6' Banquet Chair":2,
    "Popcorn Machine":75,"Snow Cone Machine":75
  };
  return items.reduce((sum, i) => sum + (priceMap[i] || 0), 0);
}

function showResult(msg, isError = false, isSuccess = false) {
  resultMsg.style.display = 'block';
  resultMsg.textContent = msg;
  resultMsg.className = isError ? 'error' : (isSuccess ? 'success' : '');
}

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
    const res = await fetch('https://script.google.com/macros/s/AKfycbzQ3G-hJSi-3sCYZ6f-QLey8-ZQYHYGviHoE52pASTZE8WH32yYo5eKx2avsdUBw5TtfQ/exec', {
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

      // Save booking data and redirect to thank-you page
      sessionStorage.setItem('bookingData', JSON.stringify(payload));
      window.location.href = 'thankyou.html';

    } else {
      showResult(data.error || 'Failed to submit booking. Try again later.', true);
    }

  } catch (err) {
    showResult('Error sending booking. Check your connection or try again later.', true);
    console.error(err);
  }
});