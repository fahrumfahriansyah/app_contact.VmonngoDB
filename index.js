const express = require('express')
var methodOverride = require('method-override')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash')
const { contact } = require('./model/contact')
const { check, body, validationResult } = require('express-validator');
//! set up
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(express.static('public'))

require('./utils/data')

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
//! tutup

//! halaman utama
app.get('/', (req, res,) => {
    res.render('index', {
        judul: 'web index',
    })
})

app.get('/mahasiswa', (req, res) => {
    const mhs = [{
        nama: 'fahri',
        kelas: '12',
        umur: '19',
        jurusan: 'multimedia'


    }, {
        nama: 'iyan',
        kelas: '12',
        umur: '19',
        jurusan: 'multimedia'


    }, {
        nama: 'rian',
        kelas: '12',
        umur: '19',
        jurusan: 'multimedia'


    }]

    res.render('mahasiswa', { mhs, judul: 'web mahasiswa' })

})
//! tutup
//!halaman index
app.get('/index', (req, res) => {
    res.render('index', {
        judul: 'web index',
    })

})
//! tutup

//!halaman contact
app.get('/contact', async (req, res) => {
    //!menampilkan data yang ada di json dengan memangil function masuk json
    const contacts = await contact.find()
    res.render('contact', {
        judul: 'web contact',
        contacts,
        flash: req.flash('msg')
    })

})
//!halaman add data harus dibawah detail agar tidak termasuk detail
app.get('/contact/add', (req, res) => {
    res.render('add_kontak', {
        judul: 'web add'
    })
})

//!proses data add masuk
//! untuk express-validator cari di docs custom error massege dan dan custom validotr orsanitazer
//! cara kerja method post
//! cara kerja method post
app.post('/contact', [
    body('nama').custom(async (value) => {
        const custom = await contact.findOne({ nama: value })
        if (custom) {
            throw new Error('nama sudah digunakan')
        }
        return true
    }),
    check('email', 'nomor email tidak valid').isEmail(),
    check('noHP', 'nomor hp tidak valid').isMobilePhone("id-ID")], (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('add_kontak', {
                judul: 'web add',
                errors: errors.array()
            })
        }
        //! ini akan di esekusi dan mengubah file json
        else {
            contact.insertMany(req.body, (err, resp) => {
                if (resp) {

                    req.flash('msg', 'data anda telah di tambahkan')
                    //! lalu file json akan kita lempar kek get dan di eskusi seperti biasa
                    return res.redirect('/contact')
                }
            })
        }
    })

//!halaman contact/detail

app.get('/contact/:nama', async (req, res) => {
    //! jadi ketika req.params.nama di masukan kedalam contact findOne yang sudah connect ke monngodb
    //! lalu akan dicarikan adakah findOne dengan object nama:req.params.nama 'yang berisi string'
    const contacts = await contact.findOne({ nama: req.params.nama })
    res.render('detail', {
        judul: 'web detail',
        contacts,
    })

})

//!tutup
//!delte
// app.get('/contact/delete/:nama', async (req, res) => {
//     const contacts = await contact.findOne({ nama: req.params.nama })

//     if (!contacts) {
//         res.status(404)
//         res.send('404')
//     } else {
//         contacts.deleteOne({ nama: req.params.nama }).then(() => {
//             req.flash('msg', 'data anda telah di hapus')
//             //! lalu file json akan kita lempar kek get dan di eskusi seperti biasa
//             res.redirect('/contact')
//         })
//     }
// })
//! bedanya pemakaiian delete adalah bisa mengunakan method delete 
// //!dan kenapa hanya mengarah ke /contact karena hal ini sudah di tanagani di belakanglayar di detail.ejs yang ketika action /contact yang memiliki method delete di jalankan akan mengirim data berupa contacts.nama yang jika di kirim ke app delete akan masuk sebagai req.body 
app.delete('/contact', (req, res) => {
    contact.deleteOne({ nama: req.body.nama }).then(() => {
        req.flash('msg', 'data anda telah di hapus')
        //! lalu file json akan kita lempar kek get dan di eskusi seperti biasa
        res.redirect('/contact')
    })
})

// //!tutup

// //!halaman update
app.get('/contact/edit/:nama', async (req, res) => {
    const contac = await contact.findOne({ nama: req.params.nama })
    console.log(contac);

    res.render('edit_kontak', {
        judul: 'web edit',
        contac,
    })

})
app.put('/contact', [
    body('nama').custom((value, { req }) => {
        const custom = contact.findOne({ nama: value })
        if (value !== req.body.oldNama && custom) {
            return true
        }
        return true
    }),
    check('email', 'nomor email tidak valid').isEmail(),
    check('noHP', 'nomor hp tidak valid').isMobilePhone("id-ID")], (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render('edit_kontak', {
                judul: 'web edit',
                errors: errors.array(),
                contac: req.body
            })
        }
        //! ini akan di esekusi dan mengubah file json
        contact.updateOne({ oldNama: req.body.oldNama }, { $set: { nama: req.body.nama, noHP: req.body.noHP, email: req.body.email } }).then((act) => {
            req.flash('msg', 'data anda telah di tambahkan')
            //! lalu file json akan kita lempar kek get dan di eskusi seperti biasa
            res.redirect('/contact')
        })

    })

//! method set
//!tutup
//!halaman error 
app.use('/', (req, res) => {
    res.send('tidak ada halaman ini')
})
    //!tutup    
    .listen('3000', () => {
        console.log('login to browser');
    })