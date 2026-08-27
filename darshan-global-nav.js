(function(){
  const header=document.querySelector('.darshan-global-header');
  if(!header)return;
  const toggle=header.querySelector('.darshan-global-toggle');
  const links=header.querySelectorAll('.darshan-global-links a');
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  links.forEach(a=>{const href=(a.getAttribute('href')||'').split('#')[0].toLowerCase(); if(href && href===current)a.classList.add('active');});
  function close(){header.classList.remove('menu-open');toggle&&toggle.setAttribute('aria-expanded','false');}
  toggle&&toggle.addEventListener('click',()=>{const open=!header.classList.contains('menu-open');header.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));});
  links.forEach(a=>a.addEventListener('click',close));
  document.addEventListener('click',e=>{if(!header.contains(e.target))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
