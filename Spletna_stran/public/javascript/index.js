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

};

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
}

function iskanje() {
    let iskalniNiz = document.getElementById("iskalniNiz").value;
    document.getElementById("searchForm").action.value += iskalniNiz;
}