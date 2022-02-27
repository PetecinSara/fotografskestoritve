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
        }
    }
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id = url.searchParams.get("id_narocila");

    fetch(`../urejanjenarocil/${id}`, {
            method: 'GET'
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((narocilo) => {
            console.log(narocilo[0]);
            const id_narocila = document.getElementById("id_narocila");
            const ime = document.getElementById("ime");
            const lokacija = document.getElementById("lokacija");
            const datum = document.getElementById("datum");
            const kategorija = document.getElementById("kategorija");
            const status = document.getElementById("status");
            const komentar = document.getElementById("komentar");
            const cena = document.getElementById("cena");
            const linkdoslik = document.getElementById("linkodslik");

            id_narocila.value = id;
            ime.value = narocilo[0].ime;
            lokacija.value = narocilo[0].lokacija;
            datum.value = narocilo[0].datum;
            kategorija.value = narocilo[0].kategorija;
            status.value = narocilo[0].status;
            komentar.value = narocilo[0].komentar;
            cena.value = narocilo[0].cena;
            linkdoslik.value = narocilo[0].linkodslik;
        });
};

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
};

function onFormSubmit(newValue) {
    const status = document.getElementById("status");
    status.value = newValue;
    if (status.value == 'Zaključeno') {

    }
    document.getElementById('narociloForm').submit();
}

function uredi() {
    event.preventDefault();
    var url_string = window.location.href;
    var url = new URL(url_string);
    var datum = url.searchParams.get("datum");
    var komentar = url.searchParams.get("komentar");
    var cena = url.searchParams.get("cena");

    let data = {
        "id_narocila": id_narocila,
        "datum": datum,
        "komentar": komentar,
        "cena": cena
    }
    console.log(data);

    fetch(`../urejanjenarocil`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((odgovor) => {
            return odgovor.json();
        }).then((comment) => {
            if (comment.status === 500) {
                console.log("Napaka");
            } else {
                console.log("Dela");
            }
        });
};