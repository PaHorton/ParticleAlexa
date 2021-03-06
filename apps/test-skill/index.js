module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var food = require( './recipe.json' );
var app = new alexa.app( 'test-skill' );

app.launch( function( request, response ) {
	response.say( 'Welcome to Cooking with Alexa! You can ask what\'s for dinner.' ).reprompt( 'Even though I\'m a robot, I\'m famished. We should start cooking' ).shouldEndSession( false );
} );


app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);	
	response.say( 'Sorry an error occured ' + error.message);
};

app.intent('askRecipe',
  {
	"utterances":[ 
		"What am I cooking",
    "What is for dinner",
    "What recipe is loaded",
    "What am I making"]
  },
  function(request,response) {
    response.session('step',0);
    response.say("The recipe I have prepared is " + food.recipe.name);
    response.shouldEndSession(false);
  }
);
app.intent('askIngredients',
  {
  "utterances":[ 
    "What do I need to start",
    "What are the ingredients",
    "What is the recipe list"]
  },
  function(request,response) {
    var recipeList = "For this recipe you will need the following. ";
    for (var i = 0; i <= Object.keys(food.recipe.ingredients).length - 1; i++) {
      if (food.recipe.ingredients[i].quantity == "") {
        recipeList += food.recipe.ingredients[i].name + "";
      }
      else if(food.recipe.ingredients[i].unit == ""){
        recipeList += food.recipe.ingredients[i].quantity + " " + food.recipe.ingredients[i].name;
      }
      else {
        recipeList += food.recipe.ingredients[i].quantity + " " + food.recipe.ingredients[i].unit + " of " + food.recipe.ingredients[i].name;
      }
      if (food.recipe.ingredients[i].prep != "") {
        recipeList += " " + food.recipe.ingredients[i].prep + ". ";
      }
      else {
        recipeList += ". ";
      }
    }
  response.say(recipeList);
  response.shouldEndSession(false);
  }
);
app.intent('checkIngredient',
  {
    "slots": {"ingredient":"INGREDIENTS"},
  "utterances":[ 
    "How much {ingredient} do I need?",
    "How many {cups|grams|ounces|tablespoons|teaspoons} of {ingredient}"]
  },
  function(request,response) {
  response.say("Let me check the amount of " + request.slot('ingredient') + " you need.");
  response.shouldEndSession(false);
  }
);
app.intent('checkStep',
  {
  "utterances":[ 
    "What is the current step",
    "Repeat the step",
    "Check current step"]
  },
  function(request,response) {
    var step = request.session('step');
    if (step == "") {
      step = 0;
    }
    response.say("Step " + (step + 1) + " says " + food.recipe.directions[step].step);
    response.shouldEndSession(false);
  }
);
app.intent('nextStep',
  {
  "utterances":[ 
    "Next step",
    "Go to next step",
    "What do I do next",
    "What is the next step",
    "What is the next direction"]
  },
  function(request,response) {
    var step = request.session('step') + 1;
    if (step == "") {
      step = 0;
    }
    if (step <= Object.keys(food.recipe.directions).length - 1) {
      response.say("Step " + (step + 1) + " says " + food.recipe.directions[step].step);
      response.session('step',step);
    }
    else {
      response.say("There are no next steps!")
      response.session('step',step-1)

    }
    response.shouldEndSession(false);
  }
);
app.intent('stop',
{
  "utterances":[
  "Stop"]
},
function(request,response) {
  response.say("Okay I'll stop");
  response.shouldEndSession(true);
}
)
module.exports = app;