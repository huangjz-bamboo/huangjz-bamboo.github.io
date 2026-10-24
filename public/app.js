'use strict';
const orbitInfo = [ ['01 / RESEARCH','理解制度与技术如何影响人的健康与机会。'], ['02 / METHODS','在理论与数据之间，追问证据能够回答什么。'], ['03 / MAKING','从一个具体需求出发，把想法变成可用的工具。'] ];
document.querySelectorAll('[data-orbit]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-orbit]').forEach(item => { item.classList.toggle('selected',item===button); item.setAttribute('aria-pressed',String(item===button)); });
  const info=orbitInfo[Number(button.dataset.orbit)];
  document.getElementById('orbit-code').textContent=info[0]; document.getElementById('orbit-text').textContent=info[1];
}));
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active',item===button); item.setAttribute('aria-pressed',String(item===button)); });
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter; });
}));
const copy=document.createElement('button'); copy.className='copy-mail'; copy.textContent='复制邮箱'; copy.type='button'; document.getElementById('mail').closest('li').append(copy);
let toastTimer;
copy.addEventListener('click',async()=>{let message='邮箱已复制';try{await navigator.clipboard.writeText('2278253811@qq.com');}catch{message='请手动复制：2278253811@qq.com';}const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4000);});
const links=[...document.querySelectorAll('.site-header nav a')];
const sections=links.map(a=>document.querySelector(a.getAttribute('href')));
let pending=false;
function update(){const height=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(height>0?scrollY/height*100:0)+'%';let current=-1;let closest=-Infinity;sections.forEach((section,index)=>{const top=section.getBoundingClientRect().top;if(top<180&&top>closest){current=index;closest=top;}});links.forEach((link,index)=>{link.classList.toggle('cur',index===current);if(index===current)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});pending=false;}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();

const phoneCopy=document.querySelector('[data-copy-phone]');
phoneCopy.addEventListener('click',async()=>{let message='手机号已复制';try{await navigator.clipboard.writeText('18871099913');}catch{message='请手动复制：18871099913';}const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4000);});
const supportForm=document.getElementById('support-form');
const nameInput=document.getElementById('support-name');
nameInput.addEventListener('input',()=>nameInput.setCustomValidity(nameInput.value.trim()?'':'请填写姓名、昵称或“匿名访客”'));
supportForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!nameInput.value.trim()){nameInput.setCustomValidity('请填写姓名、昵称或“匿名访客”');nameInput.reportValidity();return;}
  const submit=supportForm.querySelector('[type=submit]');
  if(submit.disabled)return;
  const status=document.getElementById('support-status');
  submit.disabled=true;status.classList.remove('error');status.textContent='正在提交登记…';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
  try{
    const data=new URLSearchParams(new FormData(supportForm));data.set('name',nameInput.value.trim());
    const response=await fetch('/api/support',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','Accept':'application/json'},body:data.toString(),signal:controller.signal});
    if(!response.ok)throw new Error('HTTP '+response.status);
    status.textContent='登记已提交，谢谢你的支持！实际到账以微信记录为准。';supportForm.reset();
  }catch(error){status.classList.add('error');status.textContent='暂时无法确认登记是否成功，填写内容已保留。请稍后重试，或通过微信联系我核对。';}
  finally{clearTimeout(timeout);submit.disabled=false;}
});

const qrSpecs={contact:{src:'/assets/wechat-contact.jpg',crop:[80,248,728,728],title:'微信联系 · Bamboo',file:'黄京竺-微信好友二维码.png'},pay:{src:'/assets/wechat-pay.jpg',crop:[209,263,410,410],title:'随心打赏 · 微信支付',file:'黄京竺-微信收款二维码.png'}};
const qrDialog=document.getElementById('qr-dialog');let activeQr='contact';
function showQr(type){activeQr=type;document.getElementById('qr-dialog-title').textContent=qrSpecs[type].title;const code=document.querySelector('[data-qr="'+type+'"]').cloneNode(true);code.removeAttribute('href');code.removeAttribute('data-qr');code.removeAttribute('aria-label');document.getElementById('qr-dialog-code').replaceChildren(code);qrDialog.showModal();}
document.querySelectorAll('[data-qr]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();showQr(link.dataset.qr);}));
document.querySelectorAll('[data-enlarge]').forEach(button=>button.addEventListener('click',()=>showQr(button.dataset.enlarge)));
document.getElementById('qr-close').addEventListener('click',()=>qrDialog.close());
qrDialog.addEventListener('click',event=>{if(event.target===qrDialog){const box=qrDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)qrDialog.close();}});
async function saveQr(type){const spec=qrSpecs[type];try{const img=new Image();img.src=spec.src;await img.decode();const canvas=document.createElement('canvas');canvas.width=spec.crop[2];canvas.height=spec.crop[3];canvas.getContext('2d').drawImage(img,...spec.crop,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('No image');const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=spec.file;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);}catch{const toast=document.querySelector('.toast');toast.textContent='图片保存暂不可用，请放大二维码后截图保存。';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4000);}}
document.querySelectorAll('[data-download-qr]').forEach(button=>button.addEventListener('click',()=>saveQr(button.dataset.downloadQr)));
document.getElementById('qr-dialog-save').addEventListener('click',()=>saveQr(activeQr));
