var express = require('express');
var app = express();

const path = require('path');
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());
const cors = require('cors');
app.use(cors());

const bcrypt = require('bcryptjs');

// -------------- PODATKOVNA BAZA - POVEZAVA -------------
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'smvg',
        database: 'fotografske_storitve',
        timezone: 'CEST',
        dateStrings: true
    }
});

const bookshelf = require('bookshelf')(knex);
const fileUpload = require('express-fileupload');
app.use(fileUpload());

var Img = bookshelf.Model.extend({
    tableName: 'img',
    idAttribute: 'id'
})

var Stranka = bookshelf.Model.extend({
    tableName: 'stranke',
    idAttribute: 'id'
})

var Lokacija = bookshelf.Model.extend({
    tableName: 'lokacija',
    idAttribute: 'id'
})

var Vrsta_fotografiranja = bookshelf.Model.extend({
    tableName: 'vrste_fotografij',
    idAttribute: 'id'
})

var Fotograf = bookshelf.Model.extend({
    tableName: 'fotografi',
    idAttribute: 'id'
})

var Narocila = bookshelf.Model.extend({
    tableName: 'narocila',
    idAttribute: 'id'
})

var OceneKomentarji = bookshelf.Model.extend({
    tableName: 'ocene_komentarji',
    idAttribute: 'id'
})


// ==== STRANKE ====

//seznam strank
app.get('/stranke', async(req, res, next) => {
    try {
        let stranke = await new Stranka().fetchAll();
        res.json(stranke.toJSON());
    } catch (error) {
        res.status(500).json(error);
    }
});

//preverja prijavo - stranka in fotograf
app.post('/preveriPrijavo', async function(req, res) {
    try {
        if (req.body.email != null && req.body.geslo != null) {
            let obstojec = {
                email: req.body.email,
                geslo: req.body.geslo,
            };
            let stranke = await new Stranka().where('email', obstojec.email).fetch();
            pravilnoGeslo = bcrypt.compareSync(obstojec.geslo, stranke.toJSON().geslo)

            if (pravilnoGeslo) {
                res.json({ status: 'OK', stranke: stranke.toJSON() })

            } else {
                res.send({ status: 'Napačno geslo' })
            }
        }
    } catch (error) {
        if (req.body.email != null && req.body.geslo != null) {
            try {
                let obstojec = {
                    email: req.body.email,
                    geslo: req.body.geslo,
                };
                let fotograf = await new Fotograf().where('email', obstojec.email).fetch();
                pravilnoGeslo = bcrypt.compareSync(obstojec.geslo, fotograf.toJSON().geslo)

                if (pravilnoGeslo) {
                    res.json({ status: 'OK', fotograf: fotograf.toJSON() })
                } else {
                    res.send({ status: 'Napačno geslo' })
                }
            } catch (error) {
                res.send({ status: 'Uporabnik s tem email-om ne obstaja' })
            }
        }
    }
});


//registracija stranke
app.post('/dodajStranko', async(req, res, next) => {
    try {
        let nov = {
            ime: req.body.ime,
            email: req.body.email,
            geslo: req.body.geslo,
        };
        nov.geslo = bcrypt.hashSync(nov.geslo, 12);

        let stranka = await new Stranka().save(nov);
        res.redirect('./html/uspesnaRegistracija.html')
    } catch (error) {
        res.status(500).json(error);
    }
});


// ==== FOTOGRAFI ====

//seznam fotografov
app.get('/fotografi', async(req, res, next) => {
    try {
        knex
            .select('fotografi.id', 'naziv', 'kraj', 'vrsta', 'opis', 'cena')
            .from('lokacija')
            .innerJoin('fotografi', 'lokacija.id', 'fotografi.id_lokacija')
            .innerJoin('vrste_fotografij', 'fotografi.id_vrste_fotografij', 'vrste_fotografij.id')
            .then(rows => {
                // rows.forEach(row => (row.id, row.naziv, row.kraj, row.vrsta, row.opis, row.cena))
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});

//registracija fotografa
app.post('/dodajFotografa', async(req, res, next) => {
    try {
        //datoteka = Buffer.from(req.files.profilna.data);
        let fotograf = {
            email: req.body.email,
            naziv: req.body.naziv,
            geslo: req.body.geslo,
            id_lokacija: req.body.id_lokacija,
            id_vrste_fotografij: req.body.id_vrste_fotografij,
            opis: req.body.opis,
            cena: req.body.cena,
            //profilna: datoteka
        }
        console.log(fotograf);
        fotograf.geslo = bcrypt.hashSync(fotograf.geslo, 12);
        await new Fotograf().save(fotograf);
        res.redirect('./html/uspesnaRegistracija.html')
    } catch (error) {
        res.status(500).json(error);
    }
});


//urejanje profila - fotograf
app.post('/spremeniFotografa/:id', async(req, res, next) => {
    try {
        id_fotografa = req.params.id;

        if (req.files == null) {
            await knex('fotografi').where({ id: id_fotografa }).update({
                naziv: req.body.naziv,
                id_lokacija: req.body.lokacija,
                id_vrste_fotografij: req.body.kategorija,
                opis: req.body.opis,
                cena: req.body.cena
            });
        } else {
            await knex('fotografi').where({ id: id_fotografa }).update({
                naziv: req.body.naziv,
                id_lokacija: req.body.lokacija,
                id_vrste_fotografij: req.body.kategorija,
                opis: req.body.opis,
                cena: req.body.cena,
                profilna: Buffer.from(req.files.profile.data)
            });
        }
        res.redirect(`../html/fotograf.html?id_fotografa=${id_fotografa}`)
    } catch (error) {
        res.status(500).json(error);
    }
});


//brisanje profila - fotograf
app.get('/izbrisiFotografa/:id', async(req, res, next) => {
    try {
        let id_fotografa = req.params.id;
        await new Fotograf({ id: id_fotografa }).destroy();
        res.redirect(`../html/prijava.html`);
    } catch (error) {
        res.status(500).json(error);
    }
});

//pregled profila fotografa (get metoda)
app.get('/fotograf/:id', async(req, res, next) => {
    try {
        knex
            .select('fotografi.id', 'naziv', 'kraj', 'vrsta', 'opis', 'cena', 'profilna')
            .from('lokacija')
            .innerJoin('fotografi', 'lokacija.id', 'fotografi.id_lokacija')
            .innerJoin('vrste_fotografij', 'fotografi.id_vrste_fotografij', 'vrste_fotografij.id')
            .where('fotografi.id', req.params.id)
            .then(rows => {
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});


app.get('/fotograf/img/:id', async(req, res, next) => {
    try {
        knex
            .select('profilna')
            .from('fotografi')
            .where('fotografi.id', req.params.id)
            .then(rows => {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' })
                res.end(rows[0].profilna);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});

// ==== IMG ======

app.post('/addImg', async(req, res, next) => {
    try {
        let img = {
            image: Buffer.from(req.files.image.data),
            id_fotografi: req.body.id_fotografi
        }
        let result = await new Img().save(img);
        res.redirect(`./html/fotograf.html?id_fotografa=${req.body.id_fotografi}`)
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/images/:idfotografa', async(req, res, next) => {
    try {
        knex
            .select('id')
            .from('img')
            .where('id_fotografi', req.params.idfotografa)
            .orderBy('id', "desc")
            .then(rows => {
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
})

app.get('/img/:id', async(req, res, next) => {
    try {
        knex
            .select('image')
            .from('img')
            .where('id', req.params.id)
            .then(rows => {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' })
                res.end(rows[0].image);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});
app.get('/izbrisisliko/:id/fotograf/:fotografid', async(req, res, next) => {
    try {
        let id_slika = req.params.id;
        await new Img({ id: id_slika }).destroy();
        res.redirect(`../../../html/fotograf.html?id_fotografa=${req.params.fotografid}`)
    } catch (error) {
        res.status(500).json(error);
    }
});


// ==== NAROCILA ====

//naročanje fotografskih storitev (post)
app.post('/oddajanjeNarocil', async(req, res, next) => {
    try {
        let narociloSprejeto = false;
        await knex('narocila')
            .select()
            .where({
                id_fotografi: req.body.id_fotografa,
                datum: req.body.datum
            })
            .then(function(rows) {
                if (rows.length === 0) {
                    narociloSprejeto = true;
                    return knex('narocila').insert({
                        'id_fotografi': req.body.id_fotografa,
                        'id_stranke': req.body.id_stranke,
                        'lokacija': req.body.lokacija,
                        'datum': req.body.datum,
                        'kategorija': req.body.kategorija
                    })
                } else {

                }
            })
            .catch(function(ex) {
                // you can find errors here.
            })
        if (narociloSprejeto) {
            res.redirect('./html/seznamNarocil.html');
        } else {
            res.json('ZASEDEN DATUM');
        }

    } catch (error) {
        res.status(500).json(error);
    }
});



//prelged naročil -stranka (get) - tukaj je potrebno dodati,
//da se prikazejo narocila prijavljene stranke (ne vseh narocil)
app.get('/narocila/:idstranke', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'stranke.ime', 'lokacija', 'datum', 'kategorija', 'cena', 'komentar', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .then(rows => {
                rows.forEach(row => (row.id, row.ime, row.lokacija, row.datum, row.kategorija, row.cena, row.komentar, row.status))
                res.json(rows);
            })

    } catch (error) {
        res.status(500).json(error);
    }
});

//preverjanje vseh datumov fotografa preko IDja, katere je fotograf zaseden (narocanje.js)
app.get('/narocilaFotografa/:idfotograf', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'id_stranke', 'stranke.ime', 'id_fotografi', 'fotografi.naziv',
                'lokacija', 'datum', 'komentar', 'kategorija', 'narocila.cena', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .innerJoin('fotografi', 'narocila.id_fotografi', 'fotografi.id')
            .where('fotografi.id', req.params.idfotograf)
            .then(rows => {
                rows.forEach(row => console.log(row.id, row.ime, row.lokacija, row.datum, row.kategorija, row.cena, row.komentar, row.status))
                res.json(rows);
            })

    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/narocilaStranke/:idStranke', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'id_stranke', 'stranke.ime', 'id_fotografi', 'fotografi.naziv',
                'lokacija', 'datum', 'komentar', 'kategorija', 'narocila.cena', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .innerJoin('fotografi', 'narocila.id_fotografi', 'fotografi.id')
            .where('stranke.id', req.params.idStranke)
            .then(rows => {
                rows.forEach(row => console.log(row.id, row.ime, row.lokacija, row.datum, row.kategorija, row.cena, row.komentar, row.status))
                res.json(rows);
            })

    } catch (error) {
        res.status(500).json(error);
    }
});

//izpis vseh narocil od stranke (seznamNarocil.js)
app.get('/narocilaStrankeAliFotografa/:id', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'id_stranke', 'stranke.ime', 'id_fotografi', 'fotografi.naziv',
                'lokacija', 'datum', 'komentar', 'kategorija', 'narocila.cena', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .innerJoin('fotografi', 'narocila.id_fotografi', 'fotografi.id')
            .where('fotografi.id', req.params.id)
            .orWhere('stranke.id', req.params.id)
            .then(rows => {
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});

//preklic naročil -stranka (delete)
app.get('/izbrisiNarocilo/:id', async(req, res, next) => {
    try {
        let id_narocilo = req.params.id;
        await new Narocila({ id: id_narocilo }).destroy();
        res.redirect('../html/seznamNarocil.html')
    } catch (error) {
        res.status(500).json(error);
    }
});



//možnost pregleda naročil - fotograf (get)- tukaj je potrebno dodati,
//da se prikazejo narocila prijavljenega fotografa (ne vseh narocil)
app.get('/narocila/:id', async(req, res, next) => {
    try {
        let narocila = await new Narocila().fetchAll();
        res.json(narocila.toJSON());
    } catch (error) {
        res.status(500).json(error);
    }
});


//preverjanje vseh datumov fotografa preko IDja, katere je fotograf zaseden (narocanje.js)

app.get('/narocilaFotografa/:idfotograf', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'id_stranke', 'stranke.ime', 'id_fotografi', 'fotografi.naziv',
                'lokacija', 'datum', 'komentar', 'kategorija', 'narocila.cena', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .innerJoin('fotografi', 'narocila.id_fotografi', 'fotografi.id')
            .where('fotografi.id', req.params.idfotograf)
            .then(rows => {
                rows.forEach(row => console.log(row.id, row.ime, row.lokacija, row.datum, row.kategorija, row.cena, row.komentar, row.status))
                res.json(rows);
            })

    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/narocilaStranke/:idStranke', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'id_stranke', 'stranke.ime', 'id_fotografi', 'fotografi.naziv',
                'lokacija', 'datum', 'komentar', 'kategorija', 'narocila.cena', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .innerJoin('fotografi', 'narocila.id_fotografi', 'fotografi.id')
            .where('stranke.id', req.params.idStranke)
            .then(rows => {
                rows.forEach(row => console.log(row.id, row.ime, row.lokacija, row.datum, row.kategorija, row.cena, row.komentar, row.status))
                res.json(rows);
            })

    } catch (error) {
        res.status(500).json(error);
    }
});
//izpis vseh narocil od stranke (seznamNarocil.js)

app.get('/narocilaStrankeAliFotografa/:id', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'id_stranke', 'stranke.ime', 'id_fotografi', 'fotografi.naziv',
                'lokacija', 'datum', 'komentar', 'kategorija', 'narocila.cena', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .innerJoin('fotografi', 'narocila.id_fotografi', 'fotografi.id')
            .where('fotografi.id', req.params.id)
            .orWhere('stranke.id', req.params.id)
            .then(rows => {
                rows.forEach(row => console.log(row.id, row.ime, row.lokacija, row.datum, row.kategorija, row.cena, row.komentar, row.status))
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});


//možnost pregleda naročil - fotograf (get)
//potrjevanje/zaključevanje naročil -fotograf (put metoda)
app.post('/potrjevanjenarocil/:id', async(req, res, next) => {
    let id_narocila = req.params.id;
    await knex('narocila').where({ id: id_narocila }).update({
        cena: req.body.cena,
        status: req.body.status,
        komentar: req.body.komentar,
    });
    res.json(await knex('narocila').where({ id: id_narocila }));
});

app.get('/urejanjenarocil/:id', async(req, res, next) => {
    try {
        knex
            .select('narocila.id', 'stranke.ime', 'lokacija', 'datum', 'kategorija', 'cena', 'komentar', 'status')
            .from('narocila')
            .innerJoin('stranke', 'narocila.id_stranke', 'stranke.id')
            .where('narocila.id', req.params.id)
            .then(rows => {
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/urejanjenarocil', async(req, res, next) => {
    await knex('narocila').where({ 'id': req.body.id_narocila }).update({
        lokacija: req.body.lokacija,
        datum: req.body.datum,
        status: req.body.status,
        cena: req.body.cena,
        komentar: req.body.komentar,
        linkdoslik: req.body.linkdoslik
    });
    res.redirect('./html/seznamNarocil.html')
});

//==================OCENE IN KOMENTARJI================

app.get('/oceneKomentarji/:id_fotografa', async(req, res, next) => {
    try {
        knex
            .select('ocene_komentarji.id', 'fotografi.naziv', 'stranke.ime', 'ocene_komentarji.komentar', 'ocene_komentarji.ocena', 'ocene_komentarji.datum')
            .from('stranke')
            .innerJoin('ocene_komentarji', 'stranke.id', 'ocene_komentarji.id_stranke')
            .innerJoin('fotografi', 'ocene_komentarji.id_fotografi', 'fotografi.id')
            .where('fotografi.id', req.params.id_fotografa)
            .then(rows => {
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});

app.post('/oceneKomentarji', async(req, res, next) => {
    try {
        const komentar = req.body;
        console.log(komentar.komentar);
        //const komentar1 = JSON.parse(komentar);
        const k = await new OceneKomentarji().save(komentar);
        console.log(k);
        res.json(k);
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/lokacija', async(req, res, next) => {
    try {
        let lokacija = await new Lokacija().fetchAll();
        res.json(lokacija.toJSON());
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/vrstafotografiranja', async(req, res, next) => {
    try {
        let vrste_fotografij = await new Vrsta_fotografiranja().fetchAll();
        res.json(vrste_fotografij.toJSON());
    } catch (error) {
        res.status(500).json(error);
    }
});

//filtriranje
app.get('/filtriranje/:lokacija/:vrsta', async(req, res, next) => {
    try {
        knex
            .select('fotografi.id', 'naziv', 'kraj', 'vrsta', 'opis', 'cena')
            .from('lokacija')
            .innerJoin('fotografi', 'lokacija.id', 'fotografi.id_lokacija')
            .innerJoin('vrste_fotografij', 'fotografi.id_vrste_fotografij', 'vrste_fotografij.id')
            .where('lokacija.kraj', req.params.lokacija)
            .andWhere('vrste_fotografij.vrsta', req.params.vrsta)
            .then(rows => {
                // rows.forEach(row => (row.id, row.naziv, row.kraj, row.vrsta, row.opis, row.cena))
                res.json(rows);
            })
    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/iskanje/:iskalniNiz', async(req, res, next) => {
    try {
        console.log(req.params.iskalniNiz);
        knex
            .select('fotografi.naziv', 'lokacija.kraj', 'vrste_fotografij.vrsta', 'fotografi.opis', 'fotografi.cena')
            .from('fotografi')
            .innerJoin('lokacija', 'lokacija.id', 'fotografi.id_lokacija')
            .innerJoin('vrste_fotografij', 'fotografi.id_vrste_fotografij', 'vrste_fotografij.id')
            .whereRaw(` lokacija.kraj like '%${req.params.iskalniNiz}%' 
                        or vrste_fotografij.vrsta like '%${req.params.iskalniNiz}%'
                        or fotografi.naziv like '%${req.params.iskalniNiz}%'`)
            .then(rows => {
                res.json(rows);
            });

    } catch (error) {
        res.status(500).json(error);
    }
});

app.get('/iskanje/:iskalniNiz/:lokacija/:vrsta', async(req, res, next) => {
    try {
        var whereQuery = "";
        if (req.params.iskalniNiz != '*') {
            whereQuery += `fotografi.naziv like '%${req.params.iskalniNiz}%'`
        }
        if (req.params.lokacija != '*') {
            if (whereQuery != '') { whereQuery += " and " }
            whereQuery += `lokacija.kraj like '%${req.params.lokacija}%'`
        }
        if (req.params.vrsta != '*') {
            if (whereQuery != '') { whereQuery += " and " }
            whereQuery += `vrste_fotografij.vrsta like '%${req.params.vrsta}%'`
        }
        console.log(whereQuery);
        knex
            .select('fotografi.naziv', 'lokacija.kraj', 'vrste_fotografij.vrsta', 'fotografi.opis', 'fotografi.cena')
            .from('fotografi')
            .innerJoin('lokacija', 'lokacija.id', 'fotografi.id_lokacija')
            .innerJoin('vrste_fotografij', 'fotografi.id_vrste_fotografij', 'vrste_fotografij.id')
            .whereRaw(whereQuery)
            .then(rows => {
                res.json(rows);
            });

    } catch (error) {
        res.status(500).json(error);
    }
});

app.listen(port, () => {
    console.log(`Spletna aplikacija je na http://localhost:${port}/html`)
});