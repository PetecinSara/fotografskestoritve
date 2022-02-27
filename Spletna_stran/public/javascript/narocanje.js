function pageLoad() {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var id_fotografa = url.searchParams.get("id_fotografa");
    var kategorija = url.searchParams.get("kategorija");
    var lokacija = url.searchParams.get("lokacija");

    console.log("id_fotografa: " + id_fotografa);

    const prijavljen = JSON.parse(sessionStorage.getItem('prijavljen'));
    console.log(prijavljen);

    const id_fotografaInput = document.getElementById("id_fotografa");
    id_fotografaInput.value = id_fotografa;

    if (prijavljen == null) {
        document.getElementById('jePrijavljen').style = "display: none;";
        document.getElementById('prijavljeni').style = "display: none;";
        document.getElementById('seznamNarocil').style = "display: none;";
        document.getElementById('profil').style = "display: none;";
    }
    if (prijavljen != null) {
        let uporabnik = document.getElementById('uporabnik');
        let ime = document.getElementById("ime");
        let idstranke = document.getElementById("id_stranke");
        let profil = document.getElementById('profil');
        document.getElementById('prijava').style = "display: none;";
        document.getElementById('registracija').style = "display: none;";
        document.getElementById('kategorija').value = kategorija;
        document.getElementById('lokacija').value = lokacija;
        let id_PrijavljeneOsebe;
        if (prijavljen.fotograf != null) {
            id_PrijavljeneOsebe = prijavljen.fotograf.id;
            uporabnik.innerHTML = prijavljen.fotograf.naziv;
            ime.innerHTML = prijavljen.fotograf.naziv.toUpperCase();
            idstranke.value = prijavljen.fotograf.id;
            profil.href += prijavljen.fotograf.id;
        }
        if (prijavljen.stranke != null) {
            id_PrijavljeneOsebe = prijavljen.stranke.id;
            uporabnik.innerHTML = prijavljen.stranke.ime;
            ime.innerHTML = prijavljen.stranke.ime.toUpperCase();
            console.log(prijavljen.stranke.id);
            idstranke.value = prijavljen.stranke.id;
            document.getElementById('mojprofil').style = "display: none;";
        }

        console.log("id_PrijavljeneOsebe(fotograf/strank): " + id_PrijavljeneOsebe);
        console.log("id_fotografa: " + id_fotografa);

        SelectedDates = fetch(`../narocilaFotografa/${id_fotografa}`, {
                method: 'GET'
            })
            .then((odgovor) => {
                return odgovor.json();
            })
            .then((narocila) => {
                var datumNarocil = new Array();
                for (let i = 0; i < narocila.length; i++) {
                    console.log(datumNarocil[i] = narocila[i].datum);
                    var parts = datumNarocil[i].split('-')
                        // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
                        // January - 0, February - 1, etc.
                    var datum = new Date(parts[0], parts[1] - 1, parts[2]);
                    datumi[datum] = datum;
                }
                console.log("datumi")
                return console.log(datumi);
            });
    };
};
var datumi = {};

function spremeniDatum() {
    datepicker = document.getElementById("datepicker")
    console.log(datepicker.value);
}

$(window).on('load', function() {

    var SelectedDates = datumi;
    setTimeout(() => {
        console.log("jQuery" + SelectedDates)

        $('#datepicker').datepicker({
            dayNamesMin: ["Ne", "Po", "To", "Sr", "Ce", "Pe", "So"],
            dateFormat: "yy-mm-dd",
            firstDay: 1,
            beforeShowDay: function(date) {
                var Highlight = SelectedDates[date];
                if (Highlight) {
                    return [true, "Highlighted", Highlight]; //Highlighted je css razred v narocanje.html
                } else {
                    return [true, '', ''];
                }
            }
        });

    }, 400);

});

function odjavi() {
    sessionStorage.clear();
    window.location.href = 'prijava.html';
}