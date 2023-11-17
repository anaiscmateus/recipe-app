module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // HOME PAGE W/ LOGIN LINKS
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('recipes').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            recipes: result
          })
        })
    });

    app.get('/recipes', isLoggedIn, function(req, res) {
      db.collection('recipes').find().toArray((err, result) => {
        console.log(result)
        if (err) return console.log(err)
        res.render('recipes.ejs', {
          user : req.user,
          recipes: result
        })
      })
  });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// RECIPE BLOG ROUTES ===============================================================
    app.post('/profile', (req, res) => {
      db.collection('recipes').save({email: req.body.email, recipeName: req.body.recipeName, recipeDesc: req.body.recipeDesc, recipePrep: req.body.recipePrep, ingredients: req.body.ingredients, instructions: req.body.instructions}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/recipes')
      })
    })

    app.delete('/profile', (req, res) => {
      db.collection('recipes').findOneAndDelete({email: req.body.email, recipeName: req.body.recipeName, recipeDesc: req.body.recipeDesc, recipePrep: req.body.recipePrep, ingredients: req.body.ingredients, instructions: req.body.instructions}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Recipe deleted!')
      })
    })
    
    app.put('/profile', (req, res) => {
      const { email, oldRecipeName, oldRecipeDesc, oldRecipePrep, oldIngredients, oldInstructions,
              updatedRecipeName, updatedRecipeDesc, updatedRecipePrep, updatedIngredients, updatedInstructions } = req.body;
    
      // Filter: Find the recipe with the oldRecipeName and oldRecipeDesc
      const filter = { 
        email: email,
        recipeName: oldRecipeName,
        recipeDesc: oldRecipeDesc,
        recipePrep: oldRecipePrep,
        ingredients: oldIngredients,
        instructions: oldInstructions
      };
    
      // Update: Set the updatedRecipeName, updatedRecipeDesc, updatedRecipePrep, updatedIngredients, and updatedInstructions
      const update = { $set: { 
        recipeName: updatedRecipeName,
        recipeDesc: updatedRecipeDesc,
        recipePrep: updatedRecipePrep,
        ingredients: updatedIngredients,
        instructions: updatedInstructions
      } };
    
      // Options: Set the returnOriginal option to false to get the updated document
      const options = { returnOriginal: false };
    
      // Perform the update
      db.collection('recipes').findOneAndUpdate(filter, update, options, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
    
        if (!result.value) {
          // If the recipe with old properties is not found
          return res.status(404).send('Recipe not found');
        }
    
        res.send('Recipe updated successfully');
      });
    });    

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
