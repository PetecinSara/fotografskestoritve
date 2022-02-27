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
        console.log(prijavljen.stranke.ime);

        if (prijavljen.fotograf != null) {
            uporabnik.innerHTML = prijavljen.fotograf.naziv;
            profil.href += prijavljen.fotograf.id;
        }
        if (prijavljen.stranke != null) {
            uporabnik.innerHTML = prijavljen.stranke.ime;
        }
    }
};

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
}

function prijaviUporabnika() {
    event.preventDefault();

    obrazec = document.getElementById('prijavniObrazec');
    const data = new URLSearchParams(new FormData(obrazec));
    fetch('http://localhost:3000/preveriPrijavo', { method: 'POST', body: data })
        .then((odgovor) => { return odgovor.json(); })
        .then((odgovor) => {
            console.log(odgovor);

            if (odgovor.status !== 'OK') {
                informacije = document.getElementById('informacije');
                informacije.innerHTML = odgovor.status;
                informacije.style = "display: inline-block;";
            } else {
                sessionStorage.setItem('prijavljen', JSON.stringify(odgovor));
                window.location.href = "ponudbaFotografov.html"
            }
        })
}