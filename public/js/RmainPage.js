//console.log('print ' + localStorage.mail);

var email = '';
var count =0;
var dbref = '';

 $('.tap-target').tapTarget('open');

initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            email = user.email;
            showMessage();
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            var disp = 'Welcome ' + displayName;
            document.getElementById('zuser').innerHTML = disp;
            document.getElementById('zuser1').innerHTML = disp;
            user.getIdToken().then(function(accessToken) {
                addFirstTimeUser();


                email = user.email.substring(0,email.lastIndexOf("@"))
                email = email.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
                retrieve();
                // count=0; // random key latest task insert k liye
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
    var check=taskValidity();
    if(check==1){
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
        print_latest_task(task_name , db_ref);
    }else{
        //toast for task not inserted
         Materialize.toast('Task not inserted', 4000);
    }
}
function taskValidity(){
    var check=1;
    var task_name_ele=document.getElementById('task_name');
    var description_ele=document.getElementById('description');
    var location_ele=document.getElementById('location');
    var range_ele=document.getElementById('range');
    if(!task_name_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid Task Name', 4000);
    }
    if(!description_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid Description', 4000);
    }
    if(!location_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid Location', 4000);
    }
    if(!range_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid Range ', 4000);
    }
    return check;

// >>>>>>> 4d3ac88bf625f7f5e9f871b599225420cde7fc4a
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
    db_ref=database.ref('tasks/'+email).push().key;
    database.ref('tasks/'+email+"/"+db_ref).set(taskObject).then(function(){
        console.log('inserted task');
// <<<<<<< HEAD
// =======
        //toast for task inserted
        $('#task_name').val('');
        $('#description').val('');
        $('#location').val('');
        $('#range').val('');
         Materialize.toast('Task inserted successfully!!', 4000)
// >>>>>>> 4d3ac88bf625f7f5e9f871b599225420cde7fc4a
    }).catch(function(error){
        console.log(error);
        Materialize.toast('Task not inserted due to error!!', 4000)
    });
}
function addFriend(){
    var check=friendValidity();
    if(check==1){
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
            console.log('friend exist in db ');
            var friendObject={
                f_email:new_fr_email
            }
            var friendObjectBi={
              f_email : new_email
            }
            var db_ref=database.ref('friends/'+new_email).push().key;
            var db_ref_bi = database.ref('friends/'+new_email).push().key
            database.ref('friends/'+new_email+"/"+db_ref).set(friendObject).then(function(){
            console.log('inserted friend');
            Materialize.toast("Friend Inserted",4000);
            }).catch(function(error){
                console.log(error);
            });
            database.ref('friends/' + new_fr_email + "/" + db_ref_bi).set(friendObjectBi).then(function(){
              console.log('u inserted as his friend');
            }).catch(function(error){
              console.log(error);
            });
        }
        else{
                console.log('friend entered not registered');
                Materialize.toast("friend entered not registered",4000);
        }
        })
        console.log('ghusa in addFriend');
    }
    else{
        Materialize.toast("Friend not inserted",4000);
    }

}
function friendValidity(){
    var check=1;
    var name_ele=document.getElementById("f_name");
    var email_ele=document.getElementById("email_login");
    if(!name_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid Friend Name', 4000);
    }
    if(!email_ele.checkValidity()){
        check=0;
        Materialize.toast('Invalid Email', 4000);
    }
    return check;

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

    var name=firebase.auth().currentUser.displayName;
    Materialize.toast('Welcome '+name+" !", 4000)
    console.log('hello2');
    return;
}

function yourData(data)
{
    console.log(data.key);
    printTable(data,data.key);
    //console.log(use);
}
function print_latest_task(task_name,key)
{
  var task_row = $('#task_list');
  var data = "";
  {
      data += '<tr id = "'+key+'">\
          <td>\
            <a class="friends-name black-text" href="#">'+task_name+'</a></td>\
            <td>\
              <button class="tooltipped btn-floating btn-medium waves-effect waves-light red" onclick = "removeTask(\''+key+'\')" ><i class="medium material-icons">clear</i></button>\
            </td>\
          </tr>';
  }
  console.log(data);
  task_row.append(data);
}
function printTable(object,key)
{
    var task_row = $('#task_list');
    var data = "";
    //console.log(names + names.length);
    //for(var i = 0;i<names.length;i++)
    {
        //console.log(email)
        data += '<tr id = "'+key+'">\
            <td>\
              <a class="friends-name black-text" href="#">'+object.val().task_name+'</a></td>\
              <td>\
                <button class="tooltipped btn-floating btn-medium waves-effect waves-light red" onclick = "removeTask(\''+key+'\')" ><i class="large material-icons">clear</i></button>\
              </td>\
            </tr>';
    }
    console.log(data);
  //  count++;
    //console.log(count);
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
