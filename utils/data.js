const mongoose = require('mongoose');
//! hal di lakukan untuk membuat connect kek dbs local kita
//!mongoodb/nama ip local kita/lalunama databse kita
mongoose.connect('mongodb://127.0.0.1:27017/mhs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});


// //! menambahkan data
// contact1 = new contact({
//     nama: 'fahribaebae',
//     email: 'fahrian@gmail.com',
//     noHP: '085710247189'
// })

// contact1.save().then(success => { console.log(success); })