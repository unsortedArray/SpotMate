//var provider = new firebase.auth.GoogleAuthProvider();
var ref=firebase.database().ref('friends');
var database = firebase.database();
var use = [];
var names = [];
var map =  new Object();

// email me local storage se email uthani hai jo rmainpage me save ki hai
// try to replace with session or firebase storage
email = localStorage.mail;
email = email.substring(0,email.lastIndexOf("@"))
var email = email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
//console.log(email)

//your friends
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

function yourData(data)
{
  // hashing with keys key to be deleted down
  map[data.val().f_email] = data.key;
  use.push(data.val().f_email);
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
              <a class="friends-name" href="#">'+object.name+'</a></td>\
              <td>\
                <button class="tooltipped btn-floating btn-large waves-effect waves-light teal" onclick = "removeFriend(\''+mail+'\')" ><i class="large material-icons">clear</i></button>\
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
