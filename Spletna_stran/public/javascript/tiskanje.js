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
    var id = url.searchParams.get("id_narocila");

    fetch(`../urejanjenarocil/${id}`, {
            method: 'GET'
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((narocilo) => {
            let tabela1 = document.getElementById("tabela1");
            for (let i = 0; i < narocilo.length; i++) {
                let vrstica1 = tabela1.insertRow();
                let vrstica2 = tabela2.insertRow();
                for (const lastnost in narocilo[i]) {
                    vrstica1.innerHTML = `
                    <table>
                        <tr>
                            <td>${narocilo[i].ime}</td>
                            <td>${narocilo[i].lokacija}</td>
                            <td>${narocilo[i].datum}</td>
                            <td>${narocilo[i].kategorija}</td>
                        </tr>`

                    vrstica2.innerHTML = `
                    <tr>
                    <td style="text-align: center;">
                    ${narocilo[i].status}
                    </td>
                    <td colspan="2">${narocilo[i].komentar}</td>
                    <td>${narocilo[i].cena}</td>
                    </tr>
                    </table>

                  

                    `

                }
            }
        });
};

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
}