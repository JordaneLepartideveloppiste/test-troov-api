module.exports = {
    signUpErrors: (err) => {
        let errors = {email: '', password: ''}
    
        if(err.message.includes('email'))
            errors.email = "Votre email doit contenir @ et .quelquechose";
    
        if(err.message.includes('password'))
            errors.password = "8 caractères minimum requis pour le mot de passe";
    
        if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
          errors.email = "On comprend que tu veuilles un deuxième compte mais...";
    
        return errors;
    },
    signInErrors: (err) => {
        let errors = {email: "", password: "" };
    
            if (err.message.includes('email'))
                errors.email = "Votre email n'est pas reconnu !";
            if (err.message.includes('password'))
                errors.password = "Votre mot de passe ne semble pas correspondre!";
    
        return errors;
    },
    // uploadErrors: (err) => {
    //     let errors = {format: "", maxSize: ""};
    
    //         if(err.message.includes('invalid file'))
    //             errors.format = "Un carré dans un rond...";
    //         if(err.message.includes('max size'))
    //             errors.maxSize = "Aïe, il est trop gros.......ton fichier.";
    
    //     return errors;
    // }
    }
    
    
