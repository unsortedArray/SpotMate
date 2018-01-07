var database=firebase.database();
database.ref("users").on('value', function(snapshot){
	console.log("cHANGE HAS OCCURED", snapshot.key, snapshot.val());
});	
function registerUser()
{
	var name=$('#first_name').val();
	var email=$('#email_register').val();
	insertIntoDatabase(name, email);
}
function insertIntoDatabase(name, email)
{
	var userObject={
		name: name, 
		email: email
	};

	var db_ref=database.ref("users").push().key;
	database.ref("users/"+db_ref).set(userObject).then(function(){
		console.log("Inserted");
	}).catch(function(err){
		console.log(err);
	});
}