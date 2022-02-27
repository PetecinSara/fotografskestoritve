function pageLoad() {
    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    console.log(prijavljen);

    if (prijavljen == null) {
        document.getElementById('jePrijavljen').style = "display: none;";
        document.getElementById('prijavljeni').style = "display: none;";
        document.getElementById('seznamNarocil').style = "display: none;";
        document.getElementById('profil').style = "display: none;";
    }
    if (prijavljen != null) {
        let uporabnik = document.getElementById('uporabnik');
        let profil = document.getElementById('profil');
        document.getElementById('prijava').style = "display: none;";
        document.getElementById('registracija').style = "display: none;";

        if (prijavljen.fotograf != null) {
            uporabnik.innerHTML = prijavljen.fotograf.naziv;
            profil.href += prijavljen.fotograf.id;
        }
        if (prijavljen.stranke != null) {
            uporabnik.innerHTML = prijavljen.stranke.ime;
            document.getElementById('mojprofil').style = "display: none;";
        }
    }
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_fotografa");
    document.getElementById("id_fotografi").value = id;

    fetch(`../images/${id}`, {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((slike) => {

            const imgPlaceholder = document.getElementById('imgPlaceholder');

            slike.forEach(slika => {
                imgPlaceholder.innerHTML +=
                    `<div id="slike"><img src="../img/${slika.id}" class="profilImg">
                    </div><a href="../izbrisisliko/${slika.id}/fotograf/${id}" style="display:none" class="delBtn">X</a>`
            });
        });
};

function onImageUpload() {
    const myImage = document.getElementById('image');
    try {
        fetch('/addImg', {
            method: 'POST',
            body: myImage.files[0]
        });
    } catch (e) {
        console.log(e);
    }

}

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
}

function izpisFotografa() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_fotografa");
    console.log("id_fotografa: " + id);

    document.getElementById("gumbIzbrisi").href = `../izbrisiFotografa/${id}`

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    console.log(prijavljen);
    if (prijavljen == null) {
        window.location.href = 'prijava.html';
        return;
    }
    if (prijavljen.fotograf != null) {
        const narocilo = document.getElementById('narocilo1');
        narocilo.style = "display: none;";
        if (prijavljen.fotograf.id != id) {
            const uredi = document.getElementById('uredi');
            uredi.style = "display: none;";
        }
    }
    if (prijavljen.stranke != null) {
        const uredi = document.getElementById('uredi');
        uredi.style = "display: none;";
    }
    fetch(`../fotograf/${id}`, {
            method: 'GET'
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((fotograf) => {
            for (let i = 0; i < fotograf.length; i++) {
                for (const lastnost in fotograf[i]) {
                    if (lastnost !== 'id') {
                        let naziv = document.getElementById("naziv");
                        naziv.innerHTML = fotograf[i].naziv;

                        let lokacija = document.getElementById("lokacija");
                        lokacija.innerHTML = fotograf[i].kraj;

                        let kategorija = document.getElementById("kategorija");
                        kategorija.innerHTML = fotograf[i].vrsta;

                        let opis = document.getElementById("opis");
                        opis.innerHTML = fotograf[i].opis;

                        let cena = document.getElementById("cena");
                        cena.innerHTML = fotograf[i].cena;

                        let img_slika = document.getElementById("avatar");
                        img_slika.src = `http://localhost:3000/fotograf/img/${id}`;

                        let narocilo = document.getElementById('narocilo');
                        narocilo.setAttribute("href", `narocanje.html?id_fotografa=${fotograf[i].id}&kategorija=${fotograf[i].vrsta}&lokacija=${fotograf[i].kraj}`);

                        if (prijavljen.fotograf != null && prijavljen.fotograf.id == id) {
                            let gumbIzbrisi = document.getElementById('gumbIzbrisi')
                            gumbIzbrisi.style.display = 'block';
                        }
                    }

                }
            }
        });
};

function urediFotografa() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_fotografa");

    console.log("id_fotografa: " + id);
    let zac;

    let naziv = document.getElementById('naziv');
    zac = naziv.innerHTML;
    naziv.outerHTML = "<input type='text' id='naziv' class='form-control' name='naziv'/>";
    let nazivInput = document.getElementById('naziv');
    nazivInput.setAttribute('value', zac);

    let opis = document.getElementById("opis");
    zac = opis.innerHTML;
    console.log("ZAC: " + zac);
    opis.outerHTML = "<textarea class='form-control' id='opis' rows='5' name='opis'>" + opis.innerHTML + "</textarea>";

    let lokacija = document.getElementById("lokacija");
    let kraj = lokacija.textContent;
    lokacija.innerHTML = `<select name='lokacija' form='profilForm' id='loksel'>
    <option value='1'>Celje</option>
    <option value='2'>Maribor</option>
    <option value='3'>Ljubljana</option>
    <option value='4'>Kočevje</option>
    <option value='5'>Ptuj</option>
    <option value='6'>Slovenska Bistrica</option>
    <option value='7'>Velenje</option>
    <option value='8'>Kranj</option>
    </select>`;
    console.log("ZAC: " + lokacija.innerHTML);

    let cena = document.getElementById("cena");
    zac = cena.innerHTML;
    console.log("ZAC: " + zac);
    cena.outerHTML = "<input type='text' id='cena' class='form-control' name='cena'>";
    let cenaInput = document.getElementById('cena');
    cenaInput.setAttribute('value', zac);

    let kategorija = document.getElementById("kategorija");
    categ = kategorija.textContent;
    kategorija.innerHTML = `<select name='kategorija' form='profilForm' id='kateg'>
    <option value='1'>Poročno slikanje</option>
    <option value='2'>Portretno slikanje</option>
    <option value='3'>Slikanje nepremičnin</option>
    <option value='4'>Družinsko slikanje</option>
    <option value='5'>Slikanje predmetov</option>
    </select>`;

    let slika = document.getElementById("slika");
    slika.style.display = 'block';
    document.getElementById('dodajSliko').style.display = 'block'

    var delGumbi = document.querySelectorAll(".delBtn");
    for (i = 0; i < delGumbi.length; i++) {
        delGumbi[i].style.display = 'block';
    }

    var slikeDel = document.querySelectorAll(".profilImg");
    for (i = 0; i < slikeDel.length; i++) {
        slikeDel[i].className = 'profilImgEdit';
    }

    let div = document.getElementById("formReplace");
    div.outerHTML = "<form action='../spremeniFotografa/" + id + "' method='POST' id='profilForm' enctype='multipart/form-data'>" + div.innerHTML + "<form>"

    let loksel = document.getElementById("loksel");
    for (var i = 0; i < 8; i++) {
        if (loksel.options[i].text == kraj)
            loksel.options[i].selected = true;
    }

    let kateg = document.getElementById("kateg");
    for (var i = 0; i < 5; i++) {
        if (kateg.options[i].text == categ)
            kateg.options[i].selected = true;
    }

    let gumbUredi = document.getElementById("gumbUredi");
    gumbUredi.type = "submit";
    gumbUredi.innerHTML = "SHRANI";
    gumbUredi.removeAttribute("onclick");
};

function objava() {
    event.preventDefault();
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id_fotografa = url.searchParams.get("id_fotografa");

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    id_stranke = null;
    if (prijavljen.fotograf != null) {
        id_stranke = parseInt(prijavljen.fotograf.id);
    }
    if (prijavljen.stranke != null) {
        id_stranke = parseInt(prijavljen.stranke.id);
    }

    let komentar = document.getElementById("komentar").value;
    let ocena = document.getElementById("ocena").value;
    let data = {
        "id_fotografi": parseInt(id_fotografa),
        "id_stranke": id_stranke,
        "komentar": komentar,
        "ocena": ocena
    }
    console.log(data);

    fetch('http://localhost:3000/oceneKomentarji', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((odgovor) => {
            window.location.reload();
            return true;
        })
};

function naloziKomentarje() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id_fotografa = url.searchParams.get("id_fotografa");

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));

    const input = document.getElementById("id_fotografa");
    input.value = id_fotografa;

    const name = document.getElementById("name");
    const email = document.getElementById("email");


    if (prijavljen.fotograf != null) {
        name.value = prijavljen.fotograf.naziv;
        email.value = prijavljen.fotograf.email;
    }

    if (prijavljen.stranke != null) {
        name.value = prijavljen.stranke.ime;
        email.value = prijavljen.stranke.email;
    }


    fetch("/oceneKomentarji/" + id_fotografa, {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((komentarji) => {
            let seznam = document.getElementById("komentarji1");
            for (let i = 0; i < komentarji.length; i++) {
                let list = document.createElement("li");
                for (const lastnost in komentarji[i]) {
                    if (lastnost !== 'id') {
                        list.innerHTML = `
                            <article>
                                <header>
                                    <address>Od <a>${komentarji[i].ime || komentarji[i].naziv}</a></address>
                                    <time>${komentarji[i].datum}</time>
                                    <p><b>Ocena: </b>${komentarji[i].ocena}</p>
                                </header>
                                <div class="comcont">
                                    <p>${komentarji[i].komentar}</p>
                                </div>
                            </article>`;
                    }
                }
                seznam.appendChild(list);
            }

        })
};