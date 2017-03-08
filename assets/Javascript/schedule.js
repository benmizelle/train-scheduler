// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCGrPpPLUJCg5VlBJFyOPignMhaaox63OE",
    authDomain: "train-schedule-assignment.firebaseapp.com",
    databaseURL: "https://train-schedule-assignment.firebaseio.com",
    storageBucket: "train-schedule-assignment.appspot.com",
    messagingSenderId: "477260293066"
  };
  firebase.initializeApp(config);


var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var firstTrain = moment($("#first-input").val().trim(), "hh:mm").format("X");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding added train data
  var addsTrain = {
    name: trainName,
    destination: trainDestination,
    first: firstTrain,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(addsTrain);


  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-input").val("");
  $("#frequency-input").val("");

  // Prevents moving to new page
  return false;
});

// 3. Create Firebase event for adding added train data to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;
  	
    var trnFrequencyData = firstTrain - trainFrequency;

    var initialTime = "00:00";

    // First Time (pushed back 1 year to make sure it comes before current time)
    var initialTimeConverted = moment(initialTime, "hh:mm").subtract(1, "years");
   

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(initialTimeConverted, "minutes");

    // remainder
    var tRemainder = diffTime % trnFrequencyData;

    // Minute Until Train
    var tMinutesTillTrain = trnFrequencyData - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextTrain.format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});