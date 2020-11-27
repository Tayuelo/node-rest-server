const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0; // .query para obtener parámetros opcionales
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ state: true }, 'nombre email role state google img')
        .skip(desde) // Desde dónde traer los datos
        .limit(limite) // Hasta dónde traer los datos
        .exec((err, usuarios) => { // Ejecuta el query
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ state: true}, (err, conteo) => { // Cuenta los datos que pasen la validación {}

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // encripta la contraseña
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usaurio: usuarioDB
        });
    });
    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: 'El nombre es necesario.'
    //     })
    // } else {
    //     res.json({
    //         persona: body
    //     })
    // }
})

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); // underscore

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
})

// Borrado físico.
app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    
    let cambiaEstado = {
        state: false
    };
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
 
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;