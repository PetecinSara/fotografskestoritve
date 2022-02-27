var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'smvg',
        database: 'fotografske_storitve'
    }
});

const bcrypt = require('bcryptjs');
async function napolniBazo() {

    await knex.schema.dropTableIfExists('ocene_komentarji')
        .catch((err) => { console.log(err); throw err });

    await knex.schema.dropTableIfExists('narocila')
        .catch((err) => { console.log(err); throw err });

    await knex.schema.dropTableIfExists('img')
        .catch((err) => { console.log(err); throw err });

    await knex.schema.dropTableIfExists('fotografi')
        .catch((err) => { console.log(err); throw err });

    await knex.schema.dropTableIfExists('vrste_fotografij')
        .catch((err) => { console.log(err); throw err });

    await knex.schema.dropTableIfExists('lokacija')
        .catch((err) => { console.log(err); throw err });

    await knex.schema.dropTableIfExists('stranke')
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('stranke', (table) => {
            table.increments('id');
            table.string('ime').notNullable();
            table.string('email').notNullable();
            table.string('geslo').notNullable();
        }).then(() => console.log("Stranke tabela narejena."))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('lokacija', (table) => {
            table.increments('id');
            table.string('kraj');
        }).then(() => console.log("Lokacija tabela narejena."))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('vrste_fotografij', (table) => {
            table.increments('id');
            table.string('vrsta');
        }).then(() => console.log("Vrste_fotografij tabela narejena."))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('fotografi', (table) => {
            table.increments('id');
            table.string('naziv');
            table.string('email').notNullable();
            table.string('geslo').notNullable();
            table.integer('id_lokacija').unsigned().references('id').inTable('lokacija');
            table.integer('id_vrste_fotografij').unsigned().references('id').inTable('vrste_fotografij');
            table.string('opis');
            table.integer('cena');
            table.binary('profilna');
        }).then(() => console.log("Fotografi tabela narejena."))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('img', (table) => {
            table.increments('id');
            table.binary('image');
            table.integer('id_fotografi').unsigned().references('id').inTable('fotografi').onDelete('CASCADE');
        }).then(() => console.log("Img tabela narejena."))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('narocila', (table) => {
            table.increments('id');
            table.integer('id_fotografi').unsigned().references('id').inTable('fotografi');
            table.integer('id_stranke').unsigned().references('id').inTable('stranke');
            table.string('lokacija').notNullable();
            table.date('datum').notNullable();
            table.string('kategorija').notNullable();
            table.integer('cena').defaultTo(0);
            table.string('status').defaultTo('V čakanju');
            table.string('komentar').defaultTo('');
            table.string('linkdoslik').defaultTo('');
        }).then(() => console.log("Narocila tabela narejena."))
        .catch((err) => { console.log(err); throw err });

    await knex.schema.createTable('ocene_komentarji', (table) => {
            table.increments('id');
            table.integer('id_fotografi').unsigned().references('id').inTable('fotografi');
            table.integer('id_stranke').unsigned().references('id').inTable('stranke');
            table.string('komentar');
            table.decimal('ocena');
            table.timestamp('datum').defaultTo(knex.fn.now())
        }).then(() => console.log("Ocena_komentaji tabela narejena."))
        .catch((err) => { console.log(err); throw err });

    const stranke = [
        { ime: 'sara', email: 'sara@gmail.com', geslo: bcrypt.hashSync("sara123") },
        { ime: 'matic', email: 'matic@gmail.com', geslo: bcrypt.hashSync("matic123") }
    ]

    const lokacija = [
        { kraj: 'Celje' },
        { kraj: 'Maribor' },
        { kraj: 'Ljubljana' },
        { kraj: 'Kočevje' },
        { kraj: 'Ptuj' },
        { kraj: 'Slovenska Bistrica' },
        { kraj: 'Velenje' },
        { kraj: 'Kranj' }
    ]

    const vrste_fotografij = [
        { vrsta: 'Poročno slikanje' },
        { vrsta: 'Portretno slikanje' },
        { vrsta: 'Slikanje nepremičnin' },
        { vrsta: 'Družinsko slikanje' },
        { vrsta: 'Slikanje predmetov' }
    ]

    const fotografi = [
        { naziv: 'Klemen Noner', email: 'klemen@gmail.com', geslo: bcrypt.hashSync('klemen123'), id_lokacija: 1, id_vrste_fotografij: 1, opis: 'Profesionalni fotograf z več kot 10 let izkušnj.', cena: 50, profilna: '' },
        { naziv: 'Matej Bosevski s.p.', email: 'matej@gmail.com', geslo: bcrypt.hashSync('matej123'), id_lokacija: 2, id_vrste_fotografij: 2, opis: 'Profesionalni fotograf z več kot 10 let izkušnj.', cena: 100, profilna: '' },
        { naziv: 'Franc Kranjc', email: 'fanc1@gmail.com', geslo: bcrypt.hashSync('foto242'), id_lokacija: 4, id_vrste_fotografij: 4, opis: 'Amaterski fotograf', cena: 58, profilna: '' },
        { naziv: 'Andrej Zupančič s.p.', email: 'andre345@gmail.com', geslo: bcrypt.hashSync('qwertz'), id_lokacija: 3, id_vrste_fotografij: 5, opis: 'Fotografiram v prostem času', cena: 35, profilna: '' },
        { naziv: 'Marko Kovač', email: 'marko@gmail.com', geslo: bcrypt.hashSync('osiefhs08fhs'), id_lokacija: 2, id_vrste_fotografij: 1, opis: 'Profesionalni fotograf', cena: 75, profilna: '' },
        { naziv: 'Maja Kos', email: 'majak@gmail.com', geslo: bcrypt.hashSync('gsiubIUBI7'), id_lokacija: 1, id_vrste_fotografij: 2, opis: 'Amaterski fotograf', cena: 44, profilna: '' },
        { naziv: 'Irena Vidmar s.p.', email: 'irenav@gmail.com', geslo: bcrypt.hashSync('seubso8'), id_lokacija: 5, id_vrste_fotografij: 3, opis: 'Fotografiram v prostem času', cena: 474, profilna: '' },
        { naziv: 'Ivan Božič', email: 'ivanb@gmail.com', geslo: bcrypt.hashSync('<čosgn<seg0'), id_lokacija: 6, id_vrste_fotografij: 4, opis: 'Poklicni fotograf', cena: 35, profilna: '' },
        { naziv: 'Ana Mlakar', email: 'anam@gmail.com', geslo: bcrypt.hashSync('skčrjgsos9'), id_lokacija: 7, id_vrste_fotografij: 5, opis: 'Fotografiram v prostem času', cena: 26, profilna: '' },
        { naziv: 'Jože Kralj s.p.', email: 'jozek@gmail.com', geslo: bcrypt.hashSync('slegnseg3'), id_lokacija: 8, id_vrste_fotografij: 5, opis: 'Študent-fotograf', cena: 353, profilna: '' },
        { naziv: 'Eva Golob', email: 'evag@gmail.com', geslo: bcrypt.hashSync('uuaopap3'), id_lokacija: 2, id_vrste_fotografij: 4, opis: 'Profesionalni fotograf', cena: 545, profilna: '' },
        { naziv: 'Barbara Horvat s.p.', email: 'barbarah@gmail.com', geslo: bcrypt.hashSync('segrgsef4'), id_lokacija: 3, id_vrste_fotografij: 1, opis: 'Študent-fotograf', cena: 21, profilna: '' },
        { naziv: 'Matej Potočnik', email: 'matejp@gmail.com', geslo: bcrypt.hashSync('dtzdukmsn4'), id_lokacija: 4, id_vrste_fotografij: 3, opis: 'Študent-fotograf', cena: 33, profilna: '' },
        { naziv: 'Aleš Bizjak', email: 'alesb@gmail.com', geslo: bcrypt.hashSync('seghsj9'), id_lokacija: 5, id_vrste_fotografij: 4, opis: 'Fotografiram v prostem času', cena: 67, profilna: '' },
        { naziv: 'Tina Kastelic', email: 'tinaka@gmail.com', geslo: bcrypt.hashSync('<sghdytjzfbt12'), id_lokacija: 1, id_vrste_fotografij: 3, opis: 'Profesionalni fotograf', cena: 533, profilna: '' },
        { naziv: 'Tanja Oblak', email: 'tanjao@gmail.com', geslo: bcrypt.hashSync('segrhtjnfbfd4'), id_lokacija: 6, id_vrste_fotografij: 5, opis: 'Poklicni fotograf', cena: 444, profilna: '' },
        { naziv: 'Jožica Kavčič', email: 'jozicak@gmail.com', geslo: bcrypt.hashSync('sthzdtnbftz8'), id_lokacija: 5, id_vrste_fotografij: 2, opis: 'Študent-fotograf', cena: 32, profilna: '' },
        { naziv: 'Boštjan Rozman', email: 'bostjanr@gmail.com', geslo: bcrypt.hashSync('sg<htsrnbf6'), id_lokacija: 8, id_vrste_fotografij: 1, opis: 'Poklicni fotograf', cena: 657, profilna: '' },
        { naziv: 'Matjaž Košir', email: 'matjazk@gmail.com', geslo: bcrypt.hashSync('segrdhsntrbhrz7'), id_lokacija: 7, id_vrste_fotografij: 5, opis: 'Profesionalni fotograf', cena: 533, profilna: '' },
        { naziv: 'Martin Petrič', email: 'martinp@gmail.com', geslo: bcrypt.hashSync('<sgrvvadrgd1'), id_lokacija: 5, id_vrste_fotografij: 3, opis: 'Poklicni fotograf', cena: 2222, profilna: '' },
        { naziv: 'Vesna Medved', email: 'vesnam@gmail.com', geslo: bcrypt.hashSync('<srdbrbbt4'), id_lokacija: 3, id_vrste_fotografij: 5, opis: 'Fotografiram v prostem času', cena: 87, profilna: '' },
        { naziv: 'Katarina Zajc s.p.', email: 'katarinaz@gmail.com', geslo: bcrypt.hashSync('srhsrsyhs5'), id_lokacija: 3, id_vrste_fotografij: 1, opis: 'Poklicni fotograf', cena: 3332, profilna: '' },
        { naziv: 'Alenka Koren', email: 'alenkak@gmail.com', geslo: bcrypt.hashSync('sg<y4gyd3'), id_lokacija: 7, id_vrste_fotografij: 2, opis: 'Amaterski fotograf', cena: 124, profilna: '' },
        { naziv: 'Milena Petek s.p.', email: 'milenap@gmail.com', geslo: bcrypt.hashSync('<rhyjzkd5'), id_lokacija: 4, id_vrste_fotografij: 2, opis: 'Profesionalni fotograf', cena: 2221, profilna: '' },
        { naziv: 'Jan Kuhar', email: 'jank@gmail.com', geslo: bcrypt.hashSync('dhstrhy'), id_lokacija: 3, id_vrste_fotografij: 4, opis: 'Študent-fotograf', cena: 14, profilna: '' },
        { naziv: 'Majda Uršič', email: 'majdau@gmail.com', geslo: bcrypt.hashSync('hrsthr443345'), id_lokacija: 7, id_vrste_fotografij: 3, opis: 'Profesionalni fotograf', cena: 3351, profilna: '' },
        { naziv: 'Urška Sever', email: 'urskas@gmail.com', geslo: bcrypt.hashSync('64758436dg'), id_lokacija: 8, id_vrste_fotografij: 4, opis: 'Študent-fotograf', cena: 22, profilna: '' },
        { naziv: 'Dejan Babič', email: 'dejanb@gmail.com', geslo: bcrypt.hashSync('gert6r54et5ged'), id_lokacija: 2, id_vrste_fotografij: 1, opis: 'Študent-fotograf', cena: 27, profilna: '' },
        { naziv: 'Boris Breznik', email: 'bbreznik@gmail.com', geslo: bcrypt.hashSync('gw4ezh6tj43'), id_lokacija: 4, id_vrste_fotografij: 1, opis: 'Amaterski fotograf', cena: 153, profilna: '' },
        { naziv: 'Žiga Vidic', email: 'zigavi@gmail.com', geslo: bcrypt.hashSync('wg4e5h6r4'), id_lokacija: 2, id_vrste_fotografij: 5, opis: 'Poklicni fotograf', cena: 443, profilna: '' },
        { naziv: 'Studio Fotka', email: 'info@fotka.si', geslo: bcrypt.hashSync('fotka1234532'), id_lokacija: 5, id_vrste_fotografij: 1, opis: 'Profesionalni fotografski studio', cena: 5777, profilna: '' },
        { naziv: 'Studio Slikaj', email: 'info@slikaj.si', geslo: bcrypt.hashSync('slikaj1234'), id_lokacija: 5, id_vrste_fotografij: 3, opis: 'Fotografski studio za vsakega', cena: 325, profilna: '' },
        { naziv: 'Studio Art', email: 'info@art.si', geslo: bcrypt.hashSync('art1234543'), id_lokacija: 7, id_vrste_fotografij: 4, opis: 'Fotografski studio za vsakega', cena: 433, profilna: '' },
        { naziv: 'Studio Nove Vizije', email: 'info@novevizije.si', geslo: bcrypt.hashSync('novevizije1234'), id_lokacija: 7, id_vrste_fotografij: 3, opis: 'Profesionalni fotografski studio', cena: 6000, profilna: '' },
        { naziv: 'Atelje Leča', email: 'info@leca.si', geslo: bcrypt.hashSync('leca1234'), id_lokacija: 2, id_vrste_fotografij: 2, opis: 'Profesionalni fotografski studio', cena: 4000, profilna: '' },
        { naziv: 'Fokus Foto d.o.o.', email: 'info@foto.si', geslo: bcrypt.hashSync('foto1234'), id_lokacija: 8, id_vrste_fotografij: 1, opis: 'Fotografski studio za vsakega', cena: 342, profilna: '' },
        { naziv: 'Ujeti Momenti s.p.', email: 'info@momenti.si', geslo: bcrypt.hashSync('momenti1234'), id_lokacija: 2, id_vrste_fotografij: 5, opis: 'Profesionalni fotografski studio', cena: 2999, profilna: '' },
        { naziv: 'Naravni utrinki. d.o.o.', email: 'info@utrinki.si', geslo: bcrypt.hashSync('utrinki1234'), id_lokacija: 1, id_vrste_fotografij: 4, opis: 'Profesionalni fotografski studio', cena: 1888, profilna: '' },
        { naziv: 'Posebni trenutki d.o.o.', email: 'info@trenutki.si', geslo: bcrypt.hashSync('trenutki1234'), id_lokacija: 4, id_vrste_fotografij: 1, opis: 'Fotografski studio za vsakega', cena: 356, profilna: '' },
        { naziv: 'Poročni spomini d.o.o.', email: 'info@porocnispomini.si', geslo: bcrypt.hashSync('porocnispomini1234'), id_lokacija: 6, id_vrste_fotografij: 3, opis: 'Fotografski studio za vsakega', cena: 299, profilna: '' },
        { naziv: 'Ostrina d.o.o.', email: 'info@ostrina.si', geslo: bcrypt.hashSync('ostina1234'), id_lokacija: 7, id_vrste_fotografij: 3, opis: 'Fotografski studio za vsakega', cena: 996, profilna: '' },
        { naziv: 'Ljubezen do fotografije d.o.o.', email: 'info@ljubezenfoto.si', geslo: bcrypt.hashSync('ljubfoto1234'), id_lokacija: 3, id_vrste_fotografij: 2, opis: 'Fotografski studio za vsakega', cena: 564, profilna: '' },
        { naziv: 'Ujeti trenutki d.o.o.', email: 'info@ujetitrenutki.si', geslo: bcrypt.hashSync('ujtre1234'), id_lokacija: 5, id_vrste_fotografij: 5, opis: 'Profesionalni fotografski studio', cena: 4000, profilna: '' },
        { naziv: 'Foto Celje d.o.o.', email: 'info@fotoce.si', geslo: bcrypt.hashSync('fotoce1234'), id_lokacija: 1, id_vrste_fotografij: 1, opis: 'Fotografski studio za vsakega', cena: 533, profilna: '' },
        { naziv: 'Družinske fotografije d.o.o.', email: 'info@druzinskefoto.si', geslo: bcrypt.hashSync('druzfot1234'), id_lokacija: 7, id_vrste_fotografij: 3, opis: 'Fotografski studio za vsakega', cena: 100, profilna: '' },
        { naziv: 'Prvi trenutki d.o.o.', email: 'info@prvitrenutki.si', geslo: bcrypt.hashSync('prvitre1234'), id_lokacija: 4, id_vrste_fotografij: 2, opis: 'Fotografski studio za vsakega', cena: 200, profilna: '' },
        { naziv: 'Foto Maribor d.o.o.', email: 'info@fotomb.si', geslo: bcrypt.hashSync('fotomb1234'), id_lokacija: 2, id_vrste_fotografij: 5, opis: 'Profesionalni fotografski studio', cena: 4000, profilna: '' },
        { naziv: 'Foto Ljubljana d.o.o.', email: 'info@fotolj.si', geslo: bcrypt.hashSync('fotolj1234'), id_lokacija: 3, id_vrste_fotografij: 1, opis: 'Profesionalni fotografski studio', cena: 10000, profilna: '' },
        { naziv: 'Foto Ptuj d.o.o.', email: 'info@fotopt.si', geslo: bcrypt.hashSync('fotopt1234'), id_lokacija: 5, id_vrste_fotografij: 3, opis: 'Profesionalni fotografski studio', cena: 2500, profilna: '' },
        { naziv: 'Foto Slovenska Bistrica d.o.o.', email: 'info@fotosb.si', geslo: bcrypt.hashSync('fotosb1234'), id_lokacija: 6, id_vrste_fotografij: 1, opis: 'Profesionalni fotografski studio', cena: 6000, profilna: '' },

    ]

    const narocila = [
        { id_fotografi: 1, id_stranke: 1, lokacija: 'Maribor', datum: '2021-05-25', kategorija: 'Poročno slikanje', cena: 0.0, status: 'V čakanju', komentar: '', linkdoslik: '' },
        { id_fotografi: 2, id_stranke: 2, lokacija: 'Ljubljana', datum: '2021-05-25', kategorija: 'Poročno slikanje', cena: 0.0, status: 'V čakanju', komentar: '', linkdoslik: '' }
    ]

    const ocene_komentarji = [
        { id_fotografi: 1, id_stranke: 1, komentar: 'Dober odnos s stranko', ocena: 8, datum: '2020-06-02' },
        { id_fotografi: 1, id_stranke: 2, komentar: 'Sploh ni upošteval mojih idej', ocena: 1, datum: '2021-05-16' }
    ]

    await knex('stranke').insert(stranke)
        .then(() => console.log("Stranke vstavljeni."))
        .catch((err) => { console.log(err); throw err });

    await knex('lokacija').insert(lokacija)
        .then(() => console.log("lokacija vstavljena."))
        .catch((err) => { console.log(err); throw err });

    await knex('vrste_fotografij').insert(vrste_fotografij)
        .then(() => console.log("vrste_fotografij so vstavljeni."))
        .catch((err) => { console.log(err); throw err });

    await knex('fotografi').insert(fotografi)
        .then(() => console.log("Fotografi vstavljeni."))
        .catch((err) => { console.log(err); throw err });

    await knex('narocila').insert(narocila)
        .then(() => console.log("Narocila vstavljena."))
        .catch((err) => { console.log(err); throw err });

    await knex('ocene_komentarji').insert(ocene_komentarji)
        .then(() => console.log("Ocene in komentarji so vstavljeni."))
        .catch((err) => { console.log(err); throw err });

    knex.destroy();
}
napolniBazo();