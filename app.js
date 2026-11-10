/* LOGIKA: keranjang, favorit, pencarian, filter, checkout WhatsApp.
   Dimuat setelah produk.js, jadi bisa memakai WARUNG dan PRODUK. */
// ============ STATE & PENYIMPANAN ============
var state = {view:"home", detailId:null, q:"", kat:"Semua", fav:[], cart:{}, nama:"", catatan:"", ask:false, ordered:false};
function load(k,def){try{var v=localStorage.getItem(k);return v?JSON.parse(v):def}catch(e){return def}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
state.fav = load("wd_fav",[]); state.cart = load("wd_cart",{});
// Buka/tutup mengikuti jam WIB (UTC+7), dibaca dari WARUNG.bukaPukul dan WARUNG.tutupPukul
function menit(s){var h=s.split(":");return (+h[0])*60+(+h[1])}
function sedangBuka(){
  var d=new Date(), m=((d.getUTCHours()+7)%24)*60+d.getUTCMinutes();
  return m>=menit(WARUNG.bukaPukul)&&m<menit(WARUNG.tutupPukul);
}
var rp = function(n){return "Rp"+n.toLocaleString("id-ID")};
var byId = function(id){return PRODUK.find(function(p){return p.id===id})};
function cartCount(){return Object.keys(state.cart).reduce(function(s,k){return s+state.cart[k]},0)}
function cartTotal(){return Object.keys(state.cart).reduce(function(s,k){return s+state.cart[k]*byId(+k).harga},0)}
var toastT;
function toast(m){var t=document.getElementById("toast");t.textContent=m;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},1800)}

// ============ AKSI ============
function addCart(id,d){var k=String(id);var n=(state.cart[k]||0)+d;if(n<=0)delete state.cart[k];else state.cart[k]=n;save("wd_cart",state.cart)}
function toggleFav(id){var i=state.fav.indexOf(id);if(i>=0){state.fav.splice(i,1);toast("Dihapus dari favorit")}else{state.fav.push(id);toast("Ditambah ke favorit")}save("wd_fav",state.fav)}
function go(v,id){state.view=v;if(id)state.detailId=id;render();window.scrollTo(0,0)}

// ============ TAMPILAN ============
function card(p){
  var f=state.fav.indexOf(p.id)>=0, n=state.cart[String(p.id)]||0;
  var aksi=n
    ?'<div class="qty"><button data-add="'+p.id+'" data-d="-1" aria-label="Kurangi '+p.nama+'">−</button><span>'+n+'</span><button data-add="'+p.id+'" data-d="1" aria-label="Tambah '+p.nama+'">+</button></div>'
    :'<button class="btn add" data-add="'+p.id+'" aria-label="Tambah '+p.nama+' ke keranjang">Tambah</button>';
  return '<article class="item"><div class="item-main"><span class="cat">'+p.kategori+'</span>'+
  '<button class="name" data-detail="'+p.id+'">'+p.nama+'</button><p class="desc">'+p.desc+'</p><span class="price">'+rp(p.harga)+'</span></div>'+
  '<div class="item-side"><button class="heart" data-fav="'+p.id+'" aria-pressed="'+f+'" aria-label="Favorit '+p.nama+'">'+(f?"♥":"♡")+'</button>'+aksi+'</div></article>';
}
function grid(list,emptyMsg){return list.length?'<div class="list">'+list.map(card).join("")+'</div>':'<div class="empty">'+emptyMsg+'</div>'}
function filtered(){
  var q=state.q.trim().toLowerCase();
  return PRODUK.filter(function(p){return (state.kat==="Semua"||p.kategori===state.kat)&&(!q||p.nama.toLowerCase().indexOf(q)>=0||p.kategori.toLowerCase().indexOf(q)>=0)});
}
function chips(){return '<div class="chips" role="group" aria-label="Filter kategori">'+KATEGORI.map(function(k){return '<button class="chip" data-kat="'+k+'" aria-pressed="'+(state.kat===k)+'">'+k+'</button>'}).join("")+'</div>'}

function vHome(){
  var buka=sedangBuka();
  return '<section class="info-card"><h1>Mau makan apa hari ini?</h1>'+
  '<div class="status"><span class="pill '+(buka?'on':'off')+'">'+(buka?'Buka':'Tutup')+'</span><span>'+WARUNG.jam+'</span></div>'+
  '<p class="note" style="margin:6px 0 0">'+WARUNG.alamat+'. '+(buka?'Pesanan diambil langsung di warung.':'Sedang tutup, kamu tetap bisa menyusun pesanan.')+'</p></section>'+
  '<button class="searchfake" data-go="produk" data-focus="1">Cari menu, misal: soto</button>'+
  '<section><div class="sec-h"><h2>Kategori</h2></div>'+chips().replace(/data-kat/g,'data-homekat')+'</section>'+
  '<section><div class="sec-h"><h2>Menu pilihan</h2><button class="link" data-go="produk">Lihat semua</button></div>'+grid(PRODUK.slice(0,8))+'</section>';
}
function vProduk(){
  var list=filtered();
  return '<h1 style="font-size:28px">Semua menu</h1><div class="tools"><label class="note" for="q" style="position:absolute;left:-9999px">Cari menu</label>'+
  '<input class="search" id="q" type="search" placeholder="Cari menu, misal: soto" value="'+state.q.replace(/"/g,"&quot;")+'">'+chips()+'</div>'+
  '<div id="list">'+grid(list,'Menu tidak ditemukan. Coba kata lain atau pilih kategori Semua.')+'</div>';
}
function vDetail(){
  var p=byId(state.detailId);if(!p)return vProduk();
  var f=state.fav.indexOf(p.id)>=0;
  var mirip=PRODUK.filter(function(x){return x.kategori===p.kategori&&x.id!==p.id}).slice(0,4);
  return '<button class="link" data-go="produk">← Kembali ke menu</button><div class="detail"><div style="display:grid;gap:12px">'+
  '<span class="note" style="text-transform:uppercase;letter-spacing:.06em">'+p.kategori+'</span><h1>'+p.nama+'</h1><div class="price">'+rp(p.harga)+'</div><p style="margin:0">'+p.desc+'</p>'+
  '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn green" data-add="'+p.id+'" style="flex:1">+ Masukkan keranjang</button><button class="btn line" data-fav="'+p.id+'" aria-pressed="'+f+'">'+(f?"♥ Favorit":"♡ Favorit")+'</button></div></div></div>'+
  (mirip.length?'<section><div class="sec-h"><h2>Menu serupa</h2></div>'+grid(mirip)+'</section>':'');
}
function vFav(){
  var list=state.fav.map(byId).filter(Boolean);
  return '<h1 style="font-size:28px;margin-bottom:12px">Favorit</h1>'+grid(list,'Belum ada favorit. Tekan ikon hati pada menu untuk menyimpannya di sini.');
}
function vCart(){
  var ids=Object.keys(state.cart);
  if(!ids.length)return '<h1 style="font-size:28px;margin-bottom:12px">Keranjang</h1><div class="empty">Keranjang masih kosong.<br><br><button class="btn" data-go="produk">Pilih menu</button></div>';
  var rows=ids.map(function(k){var p=byId(+k),n=state.cart[k];
    return '<div class="row"><div class="t"><b>'+p.nama+'</b><span class="price">'+rp(p.harga*n)+'</span></div>'+
    '<div class="qty"><button data-add="'+p.id+'" data-d="-1" aria-label="Kurangi '+p.nama+'">−</button><span>'+n+'</span><button data-add="'+p.id+'" data-d="1" aria-label="Tambah '+p.nama+'">+</button></div></div>'}).join("");
  return '<h1 style="font-size:28px;margin-bottom:12px">Keranjang</h1>'+rows+
  '<div class="total"><span>Total</span><span class="price" id="tot">'+rp(cartTotal())+'</span></div>'+
  (state.ask?'<div class="form" style="border:2px solid var(--accent);margin:8px 0 0"><b>'+(state.ordered?'Sudah kirim pesanan lewat WhatsApp?':'Kosongkan semua isi keranjang?')+'</b><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-clear="1">Ya, kosongkan</button><button class="btn line" data-keep="1">'+(state.ordered?'Belum, tetap simpan':'Batal')+'</button></div></div>':'<button class="link" data-ask="1">Kosongkan keranjang</button>')+
  '<div class="form"><label for="nama">Nama kamu</label><input id="nama" placeholder="Contoh: Budi" value="'+state.nama.replace(/"/g,"&quot;")+'">'+
  '<label for="cat">Catatan pesanan</label><textarea id="cat" rows="3" placeholder="Contoh: kurang pedas, diambil jam 12">'+state.catatan.replace(/</g,"&lt;")+'</textarea>'+
  '<a class="btn wa block" id="waBtn" href="'+waLink()+'" target="_blank" rel="noopener">Pesan lewat WhatsApp</a>'+
  '<p class="note" style="margin:0">Pesanan terkirim saat kamu menekan Kirim di WhatsApp. Pesanan tidak diantar. Ambil langsung di warung dan bayar di tempat.</p></div>';
}
function waLink(){
  var ids=Object.keys(state.cart);
  var t="Halo "+WARUNG.nama+", saya mau pesan:\n";
  ids.forEach(function(k){var p=byId(+k),n=state.cart[k];t+="- "+n+"x "+p.nama+" ("+rp(p.harga*n)+")\n"});
  t+="\nTotal: "+rp(cartTotal());
  if(state.nama.trim())t+="\nNama: "+state.nama.trim();
  if(state.catatan.trim())t+="\nCatatan: "+state.catatan.trim();
  return "https://wa.me/"+WARUNG.nomorWA+"?text="+encodeURIComponent(t);
}
function linkPeta(){
  return WARUNG.peta||("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(WARUNG.nama+", "+WARUNG.alamat));
}
function vAbout(){
  return '<div class="about"><h1 style="font-size:28px;margin-bottom:12px">Tentang kami</h1><p>'+WARUNG.nama+' melayani warga sekitar, pelanggan tetap, mahasiswa, dan pekerja di sekitar lokasi. Pesan lebih dulu dari rumah atau kantor, makanan kami siapkan sesuai pesananmu dan kamu ambil langsung di warung.</p>'+
  '<div class="facts"><div class="fact"><b>Jam buka</b>'+WARUNG.jam+'</div><div class="fact"><b>Alamat</b>'+WARUNG.alamat+'</div><div class="fact"><b>Pengambilan</b>'+WARUNG.area+'</div><div class="fact"><b>WhatsApp</b>+'+WARUNG.nomorWA+'</div></div>'+
  '<a class="btn green" href="'+linkPeta()+'" target="_blank" rel="noopener" style="margin-top:16px">Buka di Google Maps</a></div>';
}

var NAV=[["home","Beranda","⌂"],["produk","Menu","▦"],["fav","Favorit","♡"],["cart","Keranjang","🛒"],["about","Tentang","ⓘ"]];
function renderNav(){
  var cur=state.view==="detail"?"produk":state.view;
  document.getElementById("topnav").innerHTML=NAV.map(function(n){return '<button data-go="'+n[0]+'" aria-current="'+(cur===n[0])+'">'+n[1]+(n[0]==="cart"&&cartCount()?'<span class="badge">'+cartCount()+'</span>':'')+(n[0]==="fav"&&state.fav.length?'<span class="badge">'+state.fav.length+'</span>':'')+'</button>'}).join("");
  var b=NAV;
  var cb=document.getElementById("cartbar"), jml=cartCount();
  if(jml&&state.view!=="cart"){cb.hidden=false;cb.innerHTML='<span>'+jml+' item · '+rp(cartTotal())+'</span><b>Lihat keranjang →</b>'}else{cb.hidden=true}
  document.getElementById("btabs").innerHTML=b.map(function(n){var c=n[0]==="cart"?cartCount():n[0]==="fav"?state.fav.length:0;
    return '<button class="btab" data-go="'+n[0]+'" aria-current="'+(cur===n[0])+'"><b>'+n[2]+(c?'<span class="badge">'+c+'</span>':'')+'</b><span>'+n[1]+'</span></button>'}).join("");
}
function render(){
  var v={home:vHome,produk:vProduk,detail:vDetail,fav:vFav,cart:vCart,about:vAbout}[state.view]();
  document.getElementById("view").innerHTML=v;renderNav();
}

// ============ EVENT ============
// ============ TEMA TERANG / GELAP ============
var IKON_BULAN='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
var IKON_MATAHARI='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
function temaSekarang(){return document.documentElement.getAttribute("data-theme")==="dark"?"dark":"light"}
function ikonTema(){
  var b=document.getElementById("themeBtn");if(!b)return;
  var gelap=temaSekarang()==="dark";
  b.innerHTML=gelap?IKON_MATAHARI:IKON_BULAN;
  b.setAttribute("aria-label",gelap?"Ganti ke mode terang":"Ganti ke mode gelap");
}
document.addEventListener("click",function(e){
  if(e.target.closest("#themeBtn")){
    var t=temaSekarang()==="dark"?"light":"dark";
    document.documentElement.setAttribute("data-theme",t);
    try{localStorage.setItem("wd_theme",t)}catch(err){}
    ikonTema();return;
  }
  if(e.target.closest("#waBtn")){setTimeout(function(){state.ordered=true;state.ask=true;render()},500);return}
  var t=e.target.closest("[data-go],[data-detail],[data-fav],[data-add],[data-kat],[data-homekat],[data-ask],[data-clear],[data-keep]");if(!t)return;
  if(t.dataset.go){go(t.dataset.go);if(t.dataset.focus){var q=document.getElementById("q");if(q)q.focus()}}
  else if(t.dataset.detail){go("detail",+t.dataset.detail)}
  else if(t.dataset.fav){toggleFav(+t.dataset.fav);var y=window.scrollY;render();window.scrollTo(0,y)}
  else if(t.dataset.add){var d=t.dataset.d?+t.dataset.d:1;addCart(+t.dataset.add,d);
    var y2=window.scrollY;render();window.scrollTo(0,y2);if(state.view==="detail")toast("Masuk keranjang")}
  else if(t.dataset.ask){state.ask=true;state.ordered=false;render()}
  else if(t.dataset.keep){state.ask=false;state.ordered=false;render()}
  else if(t.dataset.clear){state.cart={};save("wd_cart",state.cart);state.catatan="";state.ask=false;state.ordered=false;toast("Keranjang dikosongkan");render()}
  else if(t.dataset.kat){state.kat=t.dataset.kat;render()}
  else if(t.dataset.homekat){state.kat=t.dataset.homekat;go("produk")}
});
document.addEventListener("input",function(e){
  if(e.target.id==="q"){state.q=e.target.value;document.getElementById("list").innerHTML=grid(filtered(),'Menu tidak ditemukan. Coba kata lain atau pilih kategori Semua.')}
  if(e.target.id==="nama"){state.nama=e.target.value;document.getElementById("waBtn").href=waLink()}
  if(e.target.id==="cat"){state.catatan=e.target.value;document.getElementById("waBtn").href=waLink()}
});
document.getElementById("brandName").textContent=WARUNG.nama;
ikonTema();
render();
