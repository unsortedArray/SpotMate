//var provider = new firebase.auth.GoogleAuthProvider();
var ref=firebase.database().ref('friends');
var database = firebase.database();
var use = [];
var names = [];
var email =''
var map = new Object();
initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            user.getIdToken().then(function(accessToken) {
              var disp = 'Welcome ' + displayName;
            document.getElementById('zuser').innerHTML = disp;
            document.getElementById('zuser1').innerHTML = disp;


                email = user.email.substring(0,email.lastIndexOf("@"))
                email = email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');

                database.ref("friends/" + email).once('value', function(snap){
                    snap.forEach(yourData);
                    if(snap.val() == null)
                    {
                        console.log('dost nahi hai tumhare');
                        $('.preloader-background').fadeOut('slow');
                        $('.preloader-wrapper')
                            .fadeOut();
                    }

                });

                $('.modal').modal();
                // console.log(email);
                // console.log( JSON.stringify({
                //     displayName: displayName,
                //     email: email,
                //     emailVerified: emailVerified,
                //     phoneNumber: phoneNumber,
                //     photoURL: photoURL,
                //     uid: uid,
                //     accessToken: accessToken,
                //     providerData: providerData
                // }, null, '  '));
            });
        } else {
            console.log('User is signed out.')
            window.location='index.html'
        }
    }, function(error) {
        console.log(error);
    });
};
window.addEventListener('load', function() {
    initApp() ;
    var out = document.getElementById('out');
    var out1 = document.getElementById('out1');


    out.onclick=SignOut ;
    out1.onclick=SignOut ;


});

// email me local storage se email uthani hai jo rmainpage me save ki hai
// try to replace with session or firebase storage
//console.log(email)

//your friends


function yourData(data)
{
  // hashing with keys key to be deleted down
   map[data.val().f_email] = data.key;
  // use.push(data.val().f_email);
  pushName(data.val().f_email, printTable);
  //console.log(use);
}
function errData(err)
{
  console.log(err);
}
function pushName(mail, callback)
{
  var ref = database.ref("users/"+ mail).on('value',function(snap)
  {
        names.push(snap.val().name);
        callback(snap.val(),mail);
  });
}

function printTable(object,mail)
{
  var friend_list_holder = $('#friend_list');
//  friend_list_holder.text('');
  var data = "";
      //console.log(names + names.length);
        //for(var i = 0;i<names.length;i++)
        {
          //console.log(email);
          data += '<tr id = "'+mail+'">\
            <td>\
              <a class="friends-name black-text" href="#">'+object.Name+'</a></td>\
              <td>\
                <button class="tooltipped btn-floating btn-medium waves-effect waves-light red" onclick = "removeFriend(\''+mail+'\')" ><i class="medium material-icons">clear</i></button>\
              </td>\
            </tr>';
        }
        //console.log(mail);
        //console.log(data);

        friend_list_holder.append(data);
        $('.preloader-background').fadeOut('slow');
        $('.preloader-wrapper')
          .fadeOut();

}
function removeFriend(mail)
{
  firebase.database().ref("friends/" + email + "/" + map[mail]).remove();
  var x = document.getElementById(mail);
  x.style.display = "none";
}

function  SignOut() {

    console.log('HEy');
    firebase.auth().signOut().then(function() {
        window.location.href = 'index.html';
    }).catch(function(error) {
        console.log(error);
    });
}
