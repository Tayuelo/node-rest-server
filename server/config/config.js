//
// PUERTO
//
process.env.PORT = process.env.PORT || 3000;

//
// ENTORNO
//

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//
// BD
//
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://akhali:SbwPtxQWcQF6NE2o@cluster0.ozuaa.mongodb.net/cafe';
}

process.env.URLDB = urlDB;