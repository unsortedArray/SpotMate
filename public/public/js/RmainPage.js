var provider = new firebase.auth.GoogleAuthProvider();

window.onload = function (ev) {
    showMessage();
    var out = document.getElementById("out");

    console.log(out);
    out.onclick= SignOut;

    if(user)
    {
        console.log(user);
    }


}
function  SignOut() {


    console.log('HEy');
    firebase.auth().signOut().then(function() {
        window.location = 'index.html';
    }).catch(function(error) {
        // An error happened.
    });
}

function showMessage(){


    Materialize.toast('I am a toast!', 4000)
    console.log('hello2');
    return;


}