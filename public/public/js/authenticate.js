var provider = new firebase.auth.GoogleAuthProvider();

window.onload = function (ev) {

  var Rlogin = document.getElementById('Rlogin');
  console.log(Rlogin);
  Rlogin.onclick = googleSign2;


}
function googleSign2() {

        console.log("Hey");
    firebase.auth().signInWithPopup(provider).then(function (result) {
            console.log("tatti");
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user);
        if(user) {
            window.location = 'mainPage.html';

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

    firebase.auth().onAuthStateChanged( function (user) {

        {

        }})


    }




