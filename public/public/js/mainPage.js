'use strict'
var database=firebase.database();
// database.ref("tasks").on('value', function(snapshot){
// 		console.log("cHANGE HAS OCCURED", snapshot.key, snapshot.val());
// 	});	
$(document).ready(function(){
	console.log("Trigg");
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    	$('.modal').modal();
    });
function addTasks(email)
{
	var task_name=$('#task_name').val();
	var description=$('#description').val();
	var location=$('#location').val();
	var range=$('#range').val();
	//get email of current user somehow
	insertIntoDatabase(task_name, description,location,range,email);
}
function insertIntoDatabase(task_name, description,location,range,email)
{
	var taskObject={
		task_name: task_name, 
		description: description,
		location:location,
		range:range
	};
	database.ref('users/'+email+'/task_list_key').once('value',function(snapshot){
		var task_list_key=snapshot.val();

	});
}
function insertIntoTask(taskObject,task_list_key){
	var db_ref=databse.ref('tasks/'+task_list_key).push().key;
	database.ref('tasks/'+task_list_key+"/"+db_ref).set(taskObject).then(function(){
		console.log('inserted task');
	}).catch(function(error){
		console.log(error);
	});
}
function addFriend(email){
	var name=$('#f_name').val();
	var f_email=$('#email_login').val();
	//query if email exist in database
	database.ref('users/'+f_email).once('value',function(snapshot){
	var val=snapshot.exists();
	console.log(val);
	if(val){
		console.log('friend exist in db of user');
		var friendObject={
			f_email:f_email
		}
		var db_ref=database.ref('friends/'+email).push().key;
		database.ref('friends/'+email+"/"+db_ref).set(friendObject).then(function(){
		console.log('inserted friend');
		}).catch(function(error){
			console.log(error);
		});
	}
	else{
			console.log('friend entered not present in database list');
	}
	})
}
