const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const bcrypt = require("bcryptjs")


// GET "/auth/signup" => renderiza la vista de registro

router.get("/signup", (req, res, next) => {

    res.render("authentication/signup.hbs")
})

// GET "/auth/signup" => crea sistema de registro
router.post("/signup", async (req, res, next) => {
    // console.log(req.body)
    const {username, password} = req.body;

    if(username === "" || password === ""){
        //console.log("Usuario o contraseña vacíos")
        res.render("authentication/signup.hbs", {
            errorMsg: "Usuario y contraseña obligatorios"
        })
        return
    }
    // Aqui se valida la contraseña
    const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if(regexPattern.test(password) === false){
        res.render("authentication/signup.hbs", {
            errorMsg: "Contraseña débil. Debe contener al menos: Una mayuscula, una minuscula, un caracter especial y min 8 caracteres"
        })
        return
    }

    try {
        const foundUser = await User.findOne({username: username})

        if(foundUser !== null) {
            res.render("authentication/signup.hbs", {
                errorMsg: "Ya existe un usuario con ese nombre de usuario"
            })
            return
        }
        // Encriptación de password
        const salt = await bcrypt.genSalt(12);
        const encriptedPassword = await bcrypt.hash(password, salt)
        //console.log(encriptedPassword)

        await User.create({
            username,
            password: encriptedPassword
        })
        res.redirect("/auth/login")
        
    } catch (error) {
        next(error)
    }
})

// GET "/auth/login" => renderiza la vista de login

router.get("/login", (req, res, next) => {
    res.render("authentication/login.hbs")
})

router.post("/login", async (req, res, next) => {
    //console.log(req.body)
    const {username, password} = req.body;
    if(username === "" || password === ""){
        res.render("authentication/login.hbs", {
            errorMsg: "Usuario y contraseña no puede estar vacíos"
        })
        return
    }
    try {
        const foundUser = await User.findOne({username: username})
        console.log(foundUser)
        if(foundUser === null){
            res.render("authentication/login.hbs", {
                errorMsg: "El usuario no está registrado",
            })
            return
        }
    // Verificar la contraseña
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password)
    //console.log(isPasswordCorrect)
    if (isPasswordCorrect === false) {
        res.render("authentication/login.hbs", {
            errorMsg: "Contraseña erronea",
        })
        return
    }

    req.session.activeUser = foundUser; 
    req.session.save(() => {
    res.redirect("/main.hbs")
    })

} catch (error){
    next(error)
}
})



module.exports = router