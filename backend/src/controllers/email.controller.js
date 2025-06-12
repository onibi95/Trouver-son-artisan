const router = require("express").Router();
const db = require("../models");
const { validateToken } = require("../controllers/authentification.js");
const nodemailer = require("nodemailer");

const validateEmailRequest = (body) => {
    const errors = [];
    
    // Validate name
    if (!body.nom || body.nom.trim().length === 0) {
        errors.push("Le nom est requis");
    }

    // Validate email
    if (!body.email || body.email.trim().length === 0) {
        errors.push("L'email est requis");
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            errors.push("L'email n'est pas valide");
        }
    }

    // Validate subject
    if (!body.objet || body.objet.trim().length === 0) {
        errors.push("L'objet est requis");
    }

    // Validate message
    if (!body.message || body.message.trim().length === 0) {
        errors.push("Le message est requis");
    }

    return errors;
};

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

router.post("/", validateToken, async (req, res) => {
    console.log("[CONTROLLER] Email send called");
    console.log(req.body);

    const validationErrors = validateEmailRequest(req.body);
    
    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: validationErrors
        });
    }
    const artisan = await db.artisans.findOne({where: {id: req.body.artisanId}});
      const info = await transporter.sendMail({
        from: '"Artisans Auvergne Rhône-Alpes" <artisans@artisans-auvergne-rhone-alpes.fr>',
        to: "bar@example.com, baz@example.com",
        subject: "Hello ✔",
        text: "Hello world?", 
        html: "<b>Hello world?</b>", // HTML body
      });
      console.log("Message sent:", info);

  // If validation passes, proceed with sending email
    res.send({success: true, message: "Email sent"});
});

module.exports = router;
