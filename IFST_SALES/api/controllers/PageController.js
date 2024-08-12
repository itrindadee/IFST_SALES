// api/controllers/PageController.js
module.exports = {
  loginPage: function(req, res) {
    return res.view('login', {
      bodyClass: 'login-page' // Define a classe específica para a página de login
    });
  },

  homePage: function(req, res) {
    return res.view('home', {
      bodyClass: 'home-page' // Define a classe específica para a página inicial
    });
  }
};
