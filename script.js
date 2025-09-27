// Booking form behavior: POST to /webhook/custom-booking if available, otherwise open mail client as fallback.
(function(){
  const sendBtn = document.getElementById('send');
  const mailBtn = document.getElementById('mailto');
  const status = document.getElementById('status');

  function gather() {
    return {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      address: document.getElementById('address').value.trim(),
      items: document.getElementById('items').value.trim(),
      notes: document.getElementById('notes').value.trim()
    };
  }

  function bodyText(d){
    return [
      'New booking request - Sen Moon Bounce',
      '',
      'Name: ' + d.name,
      'Email: ' + d.email,
      'Phone: ' + d.phone,
      'Date/Time: ' + d.date + ' ' + d.time,
      'Address: ' + d.address,
      'Items: ' + d.items,
      'Notes: ' + d.notes,
      '',
      'Sent from senmoonbounce.com'
    ].join('\\n');
  }

  sendBtn.addEventListener('click', async function(){
    const data = gather();
    if(!data.name || !data.email || !data.phone || !data.date || !data.time) {
      status.textContent = 'Please fill name, email, phone, date and time.';
      status.style.color = 'crimson';
      return;
    }
    status.textContent = 'Sending...';
    status.style.color = 'black';

    // Try to send to server endpoint
    try {
      const resp = await fetch('/webhook/custom-booking', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if(resp.ok) {
        status.textContent = 'Booking sent! We will contact you soon.';
        status.style.color = 'green';
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      // fallback to mailto
      status.textContent = 'Unable to reach server — opening mail client.';
      status.style.color = 'orange';
      const subject = encodeURIComponent('Booking request from ' + data.name);
      const body = encodeURIComponent(bodyText(data));
      window.location.href = 'mailto:senmoonbounce@gmail.com?subject=' + subject + '&body=' + body;
    }
  });

  mailBtn.addEventListener('click', function(){
    const d = gather();
    const subject = encodeURIComponent('Booking request from ' + (d.name || 'Guest'));
    const body = encodeURIComponent(bodyText(d));
    window.location.href = 'mailto:senmoonbounce@gmail.com?subject=' + subject + '&body=' + body;
  });
})();