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
            document.getElementById('preklic').style = "display: none;";
        }
        if (prijavljen.stranke != null) {
            uporabnik.innerHTML = prijavljen.stranke.ime;
            document.getElementById('uredi').style = "display: none;";
            document.getElementById('mojprofil').style = "display: none;";
        }
    }
};

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
}

function naloziNarocila() {
    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    let id;
    let url;
    if (prijavljen.fotograf != null) {
        id = prijavljen.fotograf.id;
        url = "../narocilaFotografa/"
    }
    if (prijavljen.stranke != null) {;
        id = prijavljen.stranke.id;
        url = "../narocilaStranke/"
    }
    fetch(url + `${id}`, {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((narocila) => {

            const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
            let tabela = document.getElementById("tabelaNarocil");
            for (let i = 0; i < narocila.length; i++) {
                let vrstica = tabela.insertRow();
                for (const lastnost in narocila[i]) {
                    if (lastnost == 'datum' || lastnost == 'komentar' || lastnost == 'status' || lastnost == 'linkdoslik') {
                        let polje = vrstica.insertCell();
                        polje.innerHTML = narocila[i][lastnost];
                    }
                }

                td = vrstica.insertCell(-1);
                btn = document.createElement('a');
                btn.appendChild(document.createTextNode("Tisk"));
                btn.setAttribute("href", `tiskanje.html?id_narocila=${narocila[i].id}`);
                td.appendChild(btn);

                if (narocila[i].status == 'Zaključeno') {
                    td = vrstica.insertCell(-1);
                    a = document.createElement('a');
                    a.appendChild(document.createTextNode("Link do slik"));
                    a.setAttribute("onclick", `link()`);
                    td.appendChild(a);
                } else {
                    td = vrstica.insertCell(-1);
                }

                if (prijavljen.fotograf != null && id == narocila[i].id_fotografi) {
                    td = vrstica.insertCell(-1);
                    btn = document.createElement('a');
                    btn.appendChild(document.createTextNode("Uredi"));
                    btn.setAttribute("class", "btn");
                    btn.setAttribute("href", `urejanjeNarocil.html?id_narocila=${narocila[i].id}`);
                    td.appendChild(btn);
                } else {
                    td = vrstica.insertCell(-1);
                    btn = document.createElement('a');
                    btn.appendChild(document.createTextNode("X"));
                    btn.setAttribute("class", "btn");
                    btn.setAttribute("href", `/izbrisiNarocilo/${narocila[i].id}`);
                    td.appendChild(btn);
                }
            }
        });
};

function link() {
    window.open("https://we.tl/t-iNTyM9AvfW", "_blank");
}