
var dbb_ref=firebase.database().ref('location');
dbb_ref.on('child_changed', function(data) {
  var email=data.key;
  console.log(email);
  var locate=data.val();//{latitude:,longitude:}
  console.log(locate);
  var user_ref=firebase.database().ref('friends/'+email).once('value',function(snapshot){
  	console.log("snapshot "+snapshot.key);
  	snapshot.forEach(function(childSnapshot){
  		var friend_email=childSnapshot.val().f_email;
      console.log(friend_email);
  		var friend_ref=firebase.database().ref('tasks/'+friend_email).once('value',function(snap){
  			snap.forEach(function(childSnap){
  				var task_loc=childSnap.val().location;//string
  				var friend_loc=locate;//latitude,longitude
          var range=childSnap.val().range;
          initMap(task_loc,friend_loc,childSnap,friend_email,email,range,task_loc);
  				//assume range 0
  			})
  		})
  	})
  })
});
function initMap(stringLoc,obj,childSnap,friend_email,email,range,task_loc){
  //var origin1 = new google.maps.LatLng(55.930385, -3.118425);
  var origin2 = stringLoc;
  var destinationA = new google.maps.LatLng(obj.latitude,obj.longitude);
  //var destinationB = new google.maps.LatLng(50.087692, 14.421150);
  var dist;
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [origin2],
    destinations: [destinationA],
    transitOptions: null,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function (response, status) {
    // See Parsing the Results for
    // the basics of a callback function.
      if (status !== 'OK') {
        alert('Error was: ' + status);
        dist=null;
      }
      else {
        // console.log(task_loc);
        console.log(response.rows[0].elements[0].distance.value);
        dist=(response.rows[0].elements[0].distance.value);
        fun(dist,childSnap,task_loc,friend_email,email,range);
      }
  });
}
function fun(d,childSnap,task_loc,friend_email,email,range){
  var isPossible;
  if(d<=range){
    isPossible=1;
    console.log("possible");
  }
  else{
    isPossible=0;
    console.log("not possible");
  }
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
}
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
  //console.log(location + mobile_name + task);
  emailjs.send("gmail","template_6rzmRF4V",{destination: dest_actual, user_name: dest_name,location:location,task_name:task,friend_name:mobile_name})
  .then(function(response) {
    console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
  }, function(err) {
    console.log("FAILED. error=", err);
  });
}


/*function callback(response, status) {
  // See Parsing the Results for
  // the basics of a callback function.
  var d;
  if (status !== 'OK') {
    alert('Error was: ' + status);
    d=null;
  }
  else {
    console.log(response);
    console.log(response.rows[0].elements[0].distance.text);
    d=response.rows[0].elements[0].distance.text;
  }

}*/
