
var dbb_ref=firebase.database().ref('location');
dbb_ref.on('child_changed', function(data) {
  var email=data.key;
  var locate=data.val();
  var user_ref=firebase.database().ref('friends/'+email).once('value',function(snapshot){
  	console.log("snapshot "+snapshot.val());
  	snapshot.forEach(function(childSnapshot){
  		var friend_email=childSnapshot.val().f_email;
  		var friend_ref=firebase.database().ref('tasks/'+friend_email).once('value',function(snap){
  			snap.forEach(function(childSnap){
  				var task_loc=childSnap.val().location;
  				var friend_loc=locate;
  				//assume range 0
  				var isPossible=(task_loc==friend_loc);
  				if(isPossible){
  					console.log("location matched");
            var task=childSnap.val().task_name;
            var location=task_loc;
  					firebase.database().ref('users/'+friend_email).once('value',function(sap){
  						var u=sap.val().Name;
              getFriend(friend_email,u,email,task,location);
              
  					})
  				}
  				else{
  					console.log("location did not match");
  				}
  			})
  		})
  	})
  })
});
function getFriend(friend_email,u,email,task,location){
  firebase.database().ref('users/'+email).once('value',function(sap){
      var friend=sap.val().Name;
      generateNotification(friend_email,u,friend,task,location);
  })
}
function generateNotification(dest_nakli,dest_name,mobile_name,task,location){
	console.log('notification generated');
  //send email to user that his friend is  at the locaiotn where his this task can be done
  var dest_actual;
  firebase.database().ref('actual_email/'+dest_nakli).once('value',function(snap){
    dest_actual=snap.val().actual_email;
    sendMail(dest_actual,dest_name,location,task,mobile_name);
  })
  
}
function sendMail(dest_actual,dest_name,location,task,mobile_name){
  emailjs.send("gmail","template_6rzmRF4V",{destination: dest_actual, user_name: dest_name,location:location,task_name:task,friend_name:mobile_name})
  .then(function(response) {
    console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
  }, function(err) {
    console.log("FAILED. error=", err);
  });
}
