const form = document.getElementById('productForm');
const list = document.getElementById('list');
const msg = document.getElementById('msg');
const saveBtn = document.getElementById('saveBtn');
const searchBox = document.getElementById('search');
const categoryBox = document.getElementById('filterCategory');

let products = [];   // server-la irundhu vara products inge irukkum

// HTML-la safe-a kaatta (hacking thadukka)
function esc(text) {
  const div = document.createElement('div');
  div.textContent = text == null ? '' : text;
  return div.innerHTML;
}

// ---------- Products load panni cards-a kaattu ----------
async function loadProducts() {
  const params = new URLSearchParams({
    search: searchBox.value.trim(),
    category: categoryBox.value
  });

  try {
    const res = await fetch('/api/products?' + params);
    products = await res.json();
  } catch (err) {
    list.innerHTML = '<p class="text-danger">Server-a connect panna mudiyala.</p>';
    return;
  }

  if (!products.length) {
    list.innerHTML = '<p class="text-muted">Products innum add aagala.</p>';
    return;
  }

  list.innerHTML = products.map((p, i) => `
    <div class="col-sm-6 col-lg-4 mb-4">
      <div class="card product-card shadow-sm h-100">
        ${p.image
          ? `<img src="${esc(p.image)}" class="card-img-top" alt="${esc(p.name)}">`
          : `<div class="no-image">♻</div>`}
        <div class="card-body">
          <h5 class="card-title mb-1">${esc(p.name)}</h5>
          <span class="badge bg-success-subtle text-success-emphasis">${esc(p.category)}</span>
          <p class="text-muted small mt-2 mb-1">${esc(p.quantity)} · 📍 ${esc(p.location)}</p>
          <p class="price mb-2">₹${esc(p.price)}</p>
          <button class="btn btn-outline-success btn-sm w-100" onclick="showDetails(${i})">View Details</button>
        </div>
      </div>
    </div>`).join('');
}

// ---------- Details popup + Contact seller ----------
function showDetails(i) {
  const p = products[i];
  document.getElementById('detailBody').innerHTML = `
    ${p.image ? `<img src="${esc(p.image)}" class="modal-img" alt="">` : ''}
    <div class="modal-body">
      <h4>${esc(p.name)}</h4>
      <span class="badge bg-success">${esc(p.category)}</span>
      <p class="price mt-2 mb-1">₹${esc(p.price)}</p>
      <p class="mb-1"><b>Quantity:</b> ${esc(p.quantity)}</p>
      <p class="mb-1"><b>Location:</b> ${esc(p.location)}</p>
      <p class="mb-1"><b>Description:</b> ${esc(p.description) || '-'}</p>
      <p class="mb-1"><b>Seller:</b> ${esc(p.sellerName)}</p>
      <p class="mb-3"><b>Contact:</b> ${esc(p.contact)}</p>
      <div class="d-flex gap-2">
        <a href="tel:${esc(p.contact)}" class="btn btn-success flex-fill">📞 Call Seller</a>
        <a href="https://wa.me/91${esc(p.contact)}" target="_blank" class="btn btn-outline-success flex-fill">WhatsApp</a>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>`;
  new bootstrap.Modal(document.getElementById('detailModal')).show();
}

// ---------- Product save panna ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  saveBtn.disabled = true;
  msg.className = 'ms-3 text-muted';
  msg.textContent = 'Saving...';

  try {
    const res = await fetch('/api/products', { method: 'POST', body: new FormData(form) });
    const data = await res.json();

    if (res.ok) {
      form.reset();
      msg.className = 'ms-3 text-success';
      msg.textContent = '✔ Product listed!';
      loadProducts();
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    } else {
      msg.className = 'ms-3 text-danger';
      msg.textContent = data.error || 'Save aagala';
    }
  } catch (err) {
    msg.className = 'ms-3 text-danger';
    msg.textContent = 'Server-a connect panna mudiyala';
  }
  saveBtn.disabled = false;
});

// Search / filter maarina udane refresh
searchBox.addEventListener('input', loadProducts);
categoryBox.addEventListener('change', loadProducts);

loadProducts();
