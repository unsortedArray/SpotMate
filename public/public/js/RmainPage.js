var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().onAuthStateChanged( function (user) {
        {
            user = firebase.auth().currentUser;

            if(user)
            {
                console.log(user);
                addFirstTimeUser();
            }
            else{
                window.location.href="localhost:8000";
            }

        }});
window.onload = function (ev) {
    showMessage();
    var out = document.getElementById("out");

    console.log(out);
    var Btn = document.getElementById("Btn");
    Btn.onclick = addFriend;
    out.onclick= SignOut;
    //console.log(user)
    // if(!user){
    //     window.location.href="localhost:8000/index.html";
    // }


};

var database=firebase.database();
database.ref("tasks").on('value', function(snapshot){
        console.log("task h", snapshot.key, snapshot.val());
    }); 
$(document).ready(function(){
    console.log("Trigg");
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
        $('.modal').modal();

    });

function addFirstTimeUser(){
    var user=firebase.auth().currentUser
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
    var email=firebase.auth().currentUser.email;
    var new_email = email.substring(0,email.lastIndexOf("@"))
    new_email = new_email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
    console.log(new_email);
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



