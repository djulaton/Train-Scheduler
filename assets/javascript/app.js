// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train info - then update the html + update the database
// 3. Create a way to retrieve train info from the train-scheduler database.
// 4. Create a way to calculate the current live time, frequency, next arrival, and minutes away. Using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate next arrival time and minutes away

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyAgoG5TFrbJWGc2SXmOkmBn238nL4eMH20",
  authDomain: "train-scheduler-70c20.firebaseapp.com",
  databaseURL: "https://train-scheduler-70c20.firebaseio.com",
  projectId: "train-scheduler-70c20",
  storageBucket: "train-scheduler-70c20.appspot.com",
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Train info
$("#add-trainInfo-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainName-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrainTime = moment($("#firstTrain-time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrainInfo = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrainTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrainInfo);

  // Logs everything to console
  console.log(newTrainInfo.name);
  console.log(newTrainInfo.destination);
  console.log(newTrainInfo.firstTrain);
  console.log(newTrainInfo.frequency);

  // Alert
  alert(newTrainInfo.name + " info has been successfully added");

  // Clears all of the text-boxes
  $("#trainName-input").val("");
  $("#destination-input").val("");
  $("#firstTrain-time-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainNames = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var theFirstTrainTime = childSnapshot.val().firstTrain;
  var theTrainFrequency = childSnapshot.val().frequency;
  console.log(theFirstTrainTime);

  // Train Info
  console.log(trainNames);
  console.log(tDestination);
  console.log(theFirstTrainTime);
  console.log(theTrainFrequency);


  // Time apart (remainder)
  var tRemainder = moment().diff(moment.unix(theFirstTrainTime), "minutes") % theTrainFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = theTrainFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainNames + "</td><td>" + tDestination + "</td><td>" +
  theTrainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><td>");
});