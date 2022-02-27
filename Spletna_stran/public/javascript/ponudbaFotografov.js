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
            profil.style = "display: none;";
        }
    }
};

function odjavi() {
    sessionStorage.clear('prijavljen');
    window.location.href = 'prijava.html';
}

function naloziFotografe() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var iskalniNiz = url.searchParams.get("iskalniNiz");
    document.getElementById('iskalni').value = iskalniNiz;

    if (iskalniNiz == null || iskalniNiz == "") {

        fetch("../fotografi/", {
                method: "GET"
            })
            .then((odgovor) => {
                return odgovor.json();
            })
            .then((fotografi) => {
                if (fotografi[0] == null) {
                    document.getElementById("niZadetkov").style.display = "block";
                }
                let tabela = document.getElementById("tabelaFotografov");
                const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));

                for (let i = 0; i < fotografi.length; i++) {
                    let vrstica = tabela.insertRow();
                    let polje1 = vrstica.insertCell();
                    polje1.innerHTML = `<th><b>${fotografi[i].naziv}</b></th>`
                    let polje2 = vrstica.insertCell();
                    polje2.innerHTML = `<th>${fotografi[i].kraj}</th>`
                    let polje3 = vrstica.insertCell();
                    polje3.innerHTML = `<th>${fotografi[i].vrsta}</th>`

                    if (prijavljen != null) {
                        td = vrstica.insertCell(-1);
                        td.innerHTML = `<b><a href="fotograf.html?id_fotografa=${fotografi[i].id}">Več</a></b>`
                    } else {
                        document.getElementById('gumb').style = "display: none;";
                    }
                }
            });

    } else {

        fetch(`../iskanje/${iskalniNiz}`, {
                method: "GET"
            })
            .then((odgovor) => {
                return odgovor.json();
            })
            .then((fotografi) => {
                if (fotografi[0] == null) {
                    document.getElementById("niZadetkov").style.display = "block";
                }
                let tabela = document.getElementById("tabelaFotografov");
                const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));

                for (let i = 0; i < fotografi.length; i++) {
                    let vrstica = tabela.insertRow();
                    let polje1 = vrstica.insertCell();
                    polje1.innerHTML = `<th><b>${fotografi[i].naziv}</b></th>`
                    let polje2 = vrstica.insertCell();
                    polje2.innerHTML = `<th>${fotografi[i].kraj}</th>`
                    let polje3 = vrstica.insertCell();
                    polje3.innerHTML = `<th>${fotografi[i].vrsta}</th>`

                    if (prijavljen != null) {
                        td = vrstica.insertCell(-1);
                        td.innerHTML = `<b><a href="fotograf.html?id_fotografa=${fotografi[i].id}">Več</a></b>`
                    } else {
                        document.getElementById('gumb').style = "display: none;";
                    }
                }
            });
    }
};

function naloziFiltriranje() {

    fetch("../lokacija", {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((lokacija) => {
            let seznamLokacija = document.getElementById("seznamLokacija");
            let option = document.createElement("option");
            option.setAttribute("value", "*");
            option.appendChild(document.createTextNode(""));
            seznamLokacija.appendChild(option);
            for (let i = 0; i < lokacija.length; i++) {
                option = document.createElement("option");
                for (const lastnost in lokacija[i]) {
                    if (lastnost !== 'id') {
                        option.setAttribute("value", lokacija[i].kraj);
                        option.appendChild(document.createTextNode(lokacija[i].kraj));
                    }
                }
                seznamLokacija.appendChild(option);
            }
        });

    fetch("../vrstafotografiranja", {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((vrsta) => {
            let seznamVrsta = document.getElementById("seznamVrstaFotografiranja");
            let option = document.createElement("option");
            option.setAttribute("value", "*");
            option.appendChild(document.createTextNode(""));
            seznamVrsta.appendChild(option);
            for (let i = 0; i < vrsta.length; i++) {
                option = document.createElement("option");
                for (const lastnost in vrsta[i]) {
                    if (lastnost !== 'id') {
                        option.setAttribute("value", vrsta[i].vrsta);
                        option.appendChild(document.createTextNode(vrsta[i].vrsta));
                    }
                }
                seznamVrsta.appendChild(option);
            }
        });
};

function filtiriranje() {

    let lokacija = document.getElementById("seznamLokacija").value;
    let vrsta = document.getElementById("seznamVrstaFotografiranja").value;
    let iskalniNiz = document.getElementById("iskalni").value;

    if (iskalniNiz == "" || iskalniNiz == null) {
        iskalniNiz = "*";
    }
    fetch(`../iskanje/${iskalniNiz}/${lokacija}/${vrsta}`, {
            method: "GET"
        })
        .then((odgovor) => {
            return odgovor.json();
        })
        .then((fotografi) => {
            if (fotografi[0] == null) {
                document.getElementById("niZadetkov").style.display = "block";
            }
            let tabela = document.getElementById("tabelaFotografov");
            tabela.innerHTML = "";
            const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));

            for (let i = 0; i < fotografi.length; i++) {
                let vrstica = tabela.insertRow();
                let polje1 = vrstica.insertCell();
                polje1.innerHTML = `<th><b>${fotografi[i].naziv}</b></th>`
                let polje2 = vrstica.insertCell();
                polje2.innerHTML = `<th>${fotografi[i].kraj}</th>`
                let polje3 = vrstica.insertCell();
                polje3.innerHTML = `<th>${fotografi[i].vrsta}</th>`

                if (prijavljen != null) {
                    td = vrstica.insertCell(-1);
                    td.innerHTML = `<b><a href="fotograf.html?id_fotografa=${fotografi[i].id}">Več</a></b>`
                } else {
                    document.getElementById('gumb').style = "display: none;";
                }
            }
        });
};

function noviIskalniNiz() {
    let inputIskalni = document.getElementById('iskalni').value;
    window.location.href = `./ponudbaFotografov.html?iskalniNiz=${inputIskalni}`;
}