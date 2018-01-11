var ref=firebase.database().ref('location');
ref.on('child_changed', function(data) {
  //setCommentValues(postElement, data.key, data.val().text, data.val().author);
  console.log("key is "+data.key);
  console.log("value is "+data.val());
  var email=data.key;
  var locate=data.val();
  var user_ref=firebase.database().ref('friends/'+email).once('value',function(snapshot){

  	console.log("snapshot "+snapshot.val());
  	snapshot.forEach(function(childSnapshot){
  		//console.log("childSnapshot "+childSnapshot);
  		var friend_email=childSnapshot.val().f_email;
  		console.log("betichod"+friend_email);
  		var friend_ref=firebase.database().ref('tasks/'+friend_email).once('value',function(snap){
  			//console.log("snap "+snap);
  			snap.forEach(function(childSnap){
  				//console.log("childSnap "+childSnap);
  				var task_loc=childSnap.val().location;
  				var friend_loc=locate;
  				//assume range 0
  				var isPossible=(task_loc==friend_loc);
  				if(isPossible){
  					console.log("le aaunga bhai dont worry");
  					var u;
  					firebase.database().ref('users/'+friend_email).once('value',function(sap){
  						u=sap.val().name;
  						console.log("maa chudali "+ u)

  					})
  					var friend;
  					firebase.database().ref('users/'+email).once('value',function(sap){
  						friend=sap.val()
  						console.log(friend)
  					})
  					var task=childSnap.val().task_name;
  					var location=task_loc;
  					generateNotification(u,friend,task,location);

  				}
  				else{
  					console.log("sorry bhai cant help");
  				}
  			})
  		})
  	})
  })
});
function generateNotification(user,friend,task,location){
	console.log('aa gayi bijli');
	
}
// function check(){
// 	var ref=firebase.database().ref('tasks/raghavchawla711').once('value',function(snapshot){
// 		//console.log(snapshot);
// 		console.log('key and value');
// 		snapshot.forEach(function(childSnapshot){
// 			//console.log(childSnapshot.key);
// 			console.log(childSnapshot.val().description);
// 		})
// 	})
// }
// check()
