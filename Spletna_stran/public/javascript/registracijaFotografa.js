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
        console.log(prijavljen.stranke.ime);
        let profil = document.getElementById('profil');

        if (prijavljen.fotograf != null) {
            uporabnik.innerHTML = prijavljen.fotograf.naziv;
            profil.href += prijavljen.fotograf.id;
        }
        if (prijavljen.stranke != null) {
            uporabnik.innerHTML = prijavljen.stranke.ime;
        }
    }

    fetch("../vrstafotografiranja", {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((vrsta) => {
            let seznamVrsta = document.getElementById("seznamVrsta");
            for (let i = 0; i < vrsta.length; i++) {
                let option = document.createElement("option");
                for (const lastnost in vrsta[i]) {
                    if (lastnost !== 'id') {
                        option.setAttribute("value", i + 1);
                        option.appendChild(document.createTextNode(vrsta[i].vrsta));
                    }
                }
                seznamVrsta.appendChild(option);
            }
        });
    fetch("../lokacija", {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((lokacija) => {
            let seznamLokacija = document.getElementById("seznamLokacija");
            for (let i = 0; i < lokacija.length; i++) {
                let option = document.createElement("option");
                for (const lastnost in lokacija[i]) {
                    if (lastnost !== 'id') {
                        option.setAttribute("value", i + 1);
                        option.appendChild(document.createTextNode(lokacija[i].kraj));
                    }
                }
                seznamLokacija.appendChild(option);
            }
        });
};

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
};

function registracija() {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let geslo = document.getElementById("geslo").value;
    let naziv = document.getElementById("naziv").value;
    let seznamVrsta = parseInt(document.getElementById("seznamVrsta").value);
    let seznamLokacija = parseInt(document.getElementById("seznamLokacija").value);
    let opis = document.getElementById("opis").value;
    let cena = document.getElementById("cena").value;
    const profilna = document.getElementById("profilna");

    //čreva kode, ki so potrebna za pošiljanje slike, vendar ne dela :(
    profilna.addEventListener('change', () => {
        uploadFile(input.files[0]);
    });
    const slika = new FormData();
    const uploadFile = (file) => {
        slika.append('profilna', file);
    }

    let fotograf = {
        "email": email,
        "naziv": naziv,
        "geslo": geslo,
        "id_lokacija": seznamLokacija,
        "id_vrste_fotografij": seznamVrsta,
        "opis": opis,
        "cena": cena
    }

    console.log(fotograf);

    fetch('../dodajFotografa', {
        method: 'POST',
        body: JSON.stringify(fotograf),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((odgovor) => {
        return odgovor.json();
    })
};