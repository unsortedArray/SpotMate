
var provider = new firebase.auth.GoogleAuthProvider();

window.onload = function (ev) {

  var Rlogin = document.getElementById('Rlogin');
  console.log(Rlogin);
  Rlogin.onclick = googleSign2;


}
function googleSign2() {

  console.log("fuck off");
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    //return firebase.auth().signInWithEmailAndPassword(email, password);
      console.log("Hey");
    firebase.auth().signInWithPopup(provider).then(function (result) {
            console.log("tatti");
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            user = result;
            console.log(user);
        if(user) {

            window.location.href ="http://localhost:8000/mainPage.html";

        }

        // ...
        }).catch(function (error) {
            // Handle Errors here.
            console.log(error);
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });


}
