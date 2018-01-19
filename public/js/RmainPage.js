//console.log('print ' + localStorage.mail);

var email = ''
var count =0;

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
                addFirstTimeUser();


                email = user.email.substring(0,email.lastIndexOf("@"))
                email = email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
                retrieve();

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
    initApp()
    var out = document.getElementById('out');
    out.onclick= SignOut ;
    var Btn =document.getElementById('Btn')
        Btn.onclick = addFriend;

});

var database=firebase.database();
database.ref("tasks").on('value', function(snapshot){
        console.log("task h", snapshot.key, snapshot.val());
    });
function addFirstTimeUser(){
    var user=firebase.auth().currentUser

    console.log(user);
    console.log("actual_email "+user.email);
    var actual_email=user.email;
    console.log(actual_email+" 2");
    var new_email = actual_email.substring(0,actual_email.lastIndexOf("@"))
    new_email = new_email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    console.log("new_email "+new_email);
    firebase.database().ref("users/"+new_email).once('value',function(snapshot){
        var check=snapshot.exists();
        console.log(check);
        if(check){
            console.log("visited earlier also ");
        }
        else{
            console.log("visited first time");
            var userObject={
                Name:user.displayName,
                Contact:user.phoneNumber
               // PhotoURL:user.PhotoURL,

            }
            firebase.database().ref('users/'+new_email).set(userObject);
            console.log("new user inserted");
            firebase.database().ref('actual_email/'+new_email).set({
                actual_email:actual_email
            })
        }
    })
}

function addTasks()
{
    var task_name=$('#task_name').val();
    var description=$('#description').val();
    var location=$('#location').val();
    var range=$('#range').val();
    //get email of current user somehow
    var email=firebase.auth().currentUser.email;
    var new_email = email.substring(0,email.lastIndexOf("@"))
    new_email = new_email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    console.log(new_email);
    insertIntoDatabase(task_name, description,location,range,new_email);
    retrieve();

}
function insertIntoDatabase(task_name, description,location,range,email)
{
    var taskObject={
        task_name: task_name,
        description: description,
        location:location,
        range:range
    };
    // database.ref('users/'+email+'/task_list_key').once('value',function(snapshot){
    //  var task_list_key=snapshot.val();

    // });
    insertIntoTask(taskObject,email);
}
function insertIntoTask(taskObject,email){
    var db_ref=database.ref('tasks/'+email).push().key;
    database.ref('tasks/'+email+"/"+db_ref).set(taskObject).then(function(){
        console.log('inserted task');


    }).catch(function(error){
        console.log(error);
    });
}
function addFriend(){
    // var new_email = email.substring(0,email.lastIndexOf("@"))
    // new_email = new_email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    var new_email = email;
    var name=$('#f_name').val();
    var fr_email=$('#email_login').val();
    var new_fr_email = fr_email.substring(0,fr_email.lastIndexOf("@"))
    new_fr_email = new_fr_email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    console.log(new_fr_email);
    //query if email exist in database
    database.ref('users/'+new_fr_email).once('value',function(snapshot){
    console.log('in function');
    var val=snapshot.exists();
    console.log(val);
    if(val){
        console.log('friend exist in db of user');
        var friendObject={
            f_email:new_fr_email
        }
        var db_ref=database.ref('friends/'+new_email).push().key;
        database.ref('friends/'+new_email+"/"+db_ref).set(friendObject).then(function(){
        console.log('inserted friend');
        }).catch(function(error){
            console.log(error);
        });
    }
    else{
            console.log('friend entered not present in database list');
    }
    })
    console.log('ghusa in addFriend');
}

function  SignOut() {

    console.log('HEy');
    firebase.auth().signOut().then(function() {
        window.location.href = 'index.html';
    }).catch(function(error) {
        console.log(error);
    });
}

function showMessage(){


    Materialize.toast('Welcome', 4000)
    console.log('hello2');
    return;
}




function yourData(data)
{
    console.log(data.key);
    printTable(data,data.key);
    //console.log(use);
}
function printTable(object,key)
{
    var task_row = $('#task_list');
    data = "";
    //console.log(names + names.length);
    //for(var i = 0;i<names.length;i++)
    {
        //console.log(email)
        data += '<tr id = "'+key+'">\
            <td>\
              <a class="friends-name" href="#">'+object.val().task_name+'</a></td>\
              <td>\
                <button class="tooltipped btn-floating btn-medium waves-effect waves-light teal" onclick = "removeTask(\''+key+'\')" ><i class="medium material-icons">clear</i></button>\
              </td>\
            </tr>';
    }
    console.log(data);
    count++;
    console.log(count);
    task_row.append(data);
    // $('.preloader-background').fadeOut('slow');
    // $('.preloader-wrapper')
    //   .fadeOut();
}
function removeTask(key)
{
    firebase.database().ref("tasks/" + email + "/" + key).remove();
    var x = document.getElementById(key);
    x.style.display = "none";
}
function retrieve() {
    firebase.database().ref("tasks/" + email).once('value', function(snap){
        snap.forEach(yourData);
        if(snap.val() == null)
        {
            console.log('task nahi hai tumhare');
        }
        else console.log('task hai');
    });
}