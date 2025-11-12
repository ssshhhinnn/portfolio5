// main.js - handles simple interactions: year, search, form validation, gallery filter, lightbox, CRUD using localStorage
$(function(){
  // set year
  const y = new Date().getFullYear();
  $('#year,#year2,#year3,#year4,#year5').text(y);

  /* ----------------------------
     Live search (index.html)
     ---------------------------- */
  $('#liveSearch').on('input', function(){
    const q = $(this).val().toLowerCase();
    $('#searchResults .search-item').each(function(){
      $(this).toggle($(this).text().toLowerCase().includes(q));
    });
  });

  /* ----------------------------
     Contact form validation
     ---------------------------- */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function passwordStrength(pwd){
    if(pwd.length < 6) return 'Weak';
    if(/[A-Z]/.test(pwd) && /[0-9]/.test(pwd) && pwd.length >= 8) return 'Strong';
    return 'Medium';
  }
  $('#password').on('input', function(){
    $('#pwdIndicator').text(passwordStrength($(this).val()));
  });
  $('#contactForm').on('submit', function(e){
    e.preventDefault();
    let valid = true;
    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const pwd = $('#password').val();
    const pwd2 = $('#password2').val();
    const msg = $('#message').val().trim();

    if(!name) { valid=false; $('#name').addClass('is-invalid') } else $('#name').removeClass('is-invalid');
    if(!email || !emailRegex.test(email)){ valid=false; $('#email').addClass('is-invalid') } else $('#email').removeClass('is-invalid');
    if(!msg){ valid=false; $('#message').addClass('is-invalid') } else $('#message').removeClass('is-invalid');
    if(pwd !== pwd2 || !pwd){ valid=false; $('#password2').addClass('is-invalid') } else $('#password2').removeClass('is-invalid');

    if(!valid){
      // small visual feedback
      $(this).find('.btn').text('Fix errors');
      setTimeout(()=> $(this).find('.btn').text('Send'), 1400);
      return;
    }

    // simulate submission
    alert('Form is valid — demo submission.');
    $(this)[0].reset();
    $('#pwdIndicator').text('—');
  });

  /* ----------------------------
     Gallery filtering & lightbox
     ---------------------------- */
  $('.filter-btn').on('click', function(){
    const f = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    if(f === 'all') $('.gallery-item').fadeIn(250);
    else $('.gallery-item').each(function(){
      $(this).toggle($(this).data('cat') === f);
      if($(this).is(':visible')) $(this).fadeIn(200);
    });
  });

  $('.gallery-thumb').on('click', function(){
    const src = $(this).data('full') || $(this).attr('src');
    $('#lightboxImage').attr('src', src);
    const lb = new bootstrap.Modal(document.getElementById('lightboxModal'));
    lb.show();
  });

  /* ----------------------------
     Services CRUD (localStorage)
     ---------------------------- */
  const STORAGE_KEY = 'rb_services';
  function loadServices(){
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [
      {title:'Photo editing', price:'50'},
      {title:'Web design', price:'300'}
    ];
  }
  function saveServices(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }
  function renderServices(filter=''){
    const arr = loadServices();
    const tbody = $('#servicesTable tbody').empty();
    arr.forEach((s,i)=>{
      if(filter && !s.title.toLowerCase().includes(filter.toLowerCase())) return;
      const tr = $(`
        <tr data-index="${i}">
          <td>${i+1}</td>
          <td>${s.title}</td>
          <td>${s.price}</td>
          <td>
            <button class="btn btn-sm btn-secondary edit">Edit</button>
            <button class="btn btn-sm btn-danger delete">Delete</button>
          </td>
        </tr>
      `);
      tbody.append(tr);
    });
  }
  renderServices();

  $('#serviceFilter').on('input', function(){
    renderServices($(this).val());
  });

  $('#serviceForm').on('submit', function(e){
    e.preventDefault();
    const idx = $('#serviceIndex').val();
    const title = $('#serviceTitle').val().trim();
    const price = $('#servicePrice').val().trim();
    if(!title || !/^\d+$/.test(price)) return alert('Please fill valid data');

    const arr = loadServices();
    if(idx === ''){
      arr.push({title, price});
    } else {
      arr[parseInt(idx)] = {title, price};
    }
    saveServices(arr);
    renderServices($('#serviceFilter').val());
    $('#serviceModal').modal('hide');
    this.reset();
  });

  // delegate edit/delete
  $('#servicesTable').on('click', '.delete', function(){
    if(!confirm('Delete this service?')) return;
    const idx = $(this).closest('tr').data('index');
    const arr = loadServices();
    arr.splice(idx,1);
    saveServices(arr);
    // animation
    $(this).closest('tr').fadeOut(300, function(){ renderServices($('#serviceFilter').val()); });
  });

  $('#servicesTable').on('click', '.edit', function(){
    const idx = $(this).closest('tr').data('index');
    const arr = loadServices();
    const item = arr[idx];
    $('#serviceIndex').val(idx);
    $('#serviceTitle').val(item.title);
    $('#servicePrice').val(item.price);
    $('#serviceModal').modal('show');
  });

});
