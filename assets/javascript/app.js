/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new train info - then update the html + update the database
// 3. Create a way to retrieve train info from the train-scheduler database.
// 4. Create a way to calculate the current live time, frequency, next arrival, and minutes away. Using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate Total billed

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
    var firstTrainTime = moment($("#firstTrain-time-input").val().trim(), "DD/MM/YY").format("X");
    var trainFrequency = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrainInfo = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrainTime,
      frequency: trainFrequency
    };
  
    // Uploads employee data to the database
    database.ref().push(newTrainInfo);
  
    // Logs everything to console
    console.log(newTrainInfo.name);
    console.log(newTrainInfo.destination);
    console.log(newTrainInfo.firstTrain);
    console.log(newTrainInfo.rate);
  
    // Alert
    alert("Train info successfully added");
  
    // Clears all of the text-boxes
    $("#trainName-input").val("");
    $("#destination-input").val("");
    $("#firstTrain-time-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().rate;
  
    // Employee Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(trainFrequency);
  
    // Assumptions
    var tFrequency = 3;

    // Time is 3:30 AM
    var firstTime = "03:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
  
    // Add each train's data into the table
    $("#employee-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
    trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td><td>");
  });
    

  // Assume the following situations.

    // (TEST 1)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 3 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:18 -- 2 minutes away

    // (TEST 2)
    // First Train of the Day is 3:00 AM
    // Assume Train comes every 7 minutes.
    // Assume the current time is 3:16 AM....
    // What time would the next train be...? (Use your brain first)
    // It would be 3:21 -- 5 minutes away


    // ==========================================================

    // Solved Mathematically
    // Test case 1:
    // 16 - 00 = 16
    // 16 % 3 = 1 (Modulus is the remainder)
    // 3 - 1 = 2 minutes away
    // 2 + 3:16 = 3:18

    // Solved Mathematically
    // Test case 2:
    // 16 - 00 = 16
    // 16 % 7 = 2 (Modulus is the remainder)
    // 7 - 2 = 5 minutes away
    // 5 + 3:16 = 3:21

