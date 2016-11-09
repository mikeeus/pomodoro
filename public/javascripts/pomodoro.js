$(document).ready(function(){
  updateDisplay(timerType);
  setQuote();
  // start interval to change quote every 15 seconds;
  setInterval(function(){ setQuote(); }, 20000);
});

var pomodoroTimer;
var breakTimer;
var timerState = false;
var timerType = 'session';
var baseProgressClass = "c100 big orange";
var incrementValue = 60000; // 1 min * 60 seconds * 1000 milliseconds
// default length
var sessionLength = 1500000; // x mins * 60 seconds * 1000 milliseconds
var sessionLeft = sessionLength;
var breakLength = 300000;
var breakLeft = breakLength;
// notification sound
var chime = new Audio('/sounds/chime-justinbw.wav');
function playSound(){
  chime.play();
}

function toggleTimer(){
  timerState = !timerState;
  if(sessionLeft <= 0){
    if(breakLeft <= 0){
      resetTimers();
      return;
    }
    timerState ? startTimer('break') : stopTimer('break') ;
  } else {
    timerState ? startTimer('session') : stopTimer('session') ;    
  }
}
function resetTimers(){
  stopTimer('session');
  stopTimer('break');  
  sessionLeft = sessionLength;
  breakLeft = breakLength;
  updateProgress();
  // remove green class
  $('#progress').removeClass();
}
// increments the timer by -1 second
function incrementTimer(type){
  if(type == 'session'){
    sessionLeft <= 0 ? stopTimer(type) : sessionLeft -= 1000;
    if(sessionLeft == 0){stopTimer(type);} 
  } else if(type == 'break'){
    breakLeft <= 0 ? stopTimer(type) : breakLeft -= 1000;
    if(breakLeft == 0){stopTimer(type);}     
  }
  updateProgress(); 
}
// Increments session and break length
function incrementLength(type, direction){
  stopTimer(type);
  if(type == 'session'){
    if(direction == 'up'){
      sessionLength += incrementValue;  
    } else if(direction == 'down'){
      sessionLength >= (incrementValue * 2) ? sessionLength -= incrementValue : sessionLength = incrementValue;
    }
    sessionLeft = sessionLength;                      
  } else if (type == 'break'){
    if(direction == 'up'){
      breakLength += incrementValue;      
    } else if(direction == 'down'){
      breakLength >= (incrementValue * 2) ? breakLength = incrementValue : breakLength = incrementValue;
    }
    breakLeft = breakLength;
  } 
  updateProgress();        
}
function updateProgress(){
  progress = $("#progress");
  if(sessionLeft == 0){
    progPercent = Math.round(parseFloat((1 - breakLeft/breakLength) * 100).toPrecision(2));
    updateDisplay('break');
    if(breakLeft == 0){
      progress.addClass('green'); 
      progress.html("Ready?");
      notify("Times up lazy bum! ;) Ready to work?")
      playSound();
    } else if(timerState == false && progPercent == 0){
      progress.addClass('green');      
      progress.html("Break?");
      notify("Good work! Ready for a " + parseTime(breakLength) + " break?")
      playSound();      
    }
  } else {
    progress.removeClass();
    progPercent = Math.round(parseFloat((1 - sessionLeft/sessionLength) * 100).toPrecision(2));
    updateDisplay('session');
  }
  newClass = baseProgressClass + " p" + progPercent;
  $("#circleProgress").removeClass();
  $("#circleProgress").addClass(newClass);
}
function startTimer(type){
  if(type == 'session'){
    pomodoroTimer = setInterval(function(){ incrementTimer('session') }, 1000);
  } else if(type == 'break'){
    breakTimer = setInterval(function(){ incrementTimer('break') }, 1000);
  }
  if(timerType != type){
    fill = $('.fill');
    bar = $('.bar');    
    fill.hasClass('break-time') ? fill.removeClass('break-time') : fill.addClass('break-time');
    bar.hasClass('break-time') ? bar.removeClass('break-time') : bar.addClass('break-time');    
    timerType = type;
  }
  // console.log('begin: ', type);
}
function stopTimer(type){
  type == 'session' ? clearInterval(pomodoroTimer) : clearInterval(breakTimer);
  timerState = false;
  // console.log('Stopped: ', type);
}
function parseTime(time){
  min = time/1000/60 << 0;
  sec = time/1000 % 60;
  if(sec < 10){ sec = "0" + sec; }
  return min + ":" + sec;
}
function preset(time){
  stopTimer('session');
  stopTimer('break');  
  sessionLength = (time * 1000 * 60);
  sessionLeft = sessionLength;
  breakLength = sessionLength/5;
  updateProgress();
} 
function updateDisplay(type){
  // update remaining time, and session/break length
  if(type == 'session'){
    remaining = parseTime(sessionLeft);
  } else if(type == 'break'){
    remaining = parseTime(breakLeft);
  }
  $("#progress").html(remaining);
  session = parseTime(sessionLength);  
  $("#session").html(session);
  breakTime = parseTime(breakLength);
  $("#break").html(breakTime);    
  // show's the timer's state and type, *DEBUG
  timerState ? $('#state').html('true') : $('#state').html('false');
  $('#timer-type').html(timerType);
}

// Notifications
function notify(message) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(message);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(message);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

//
function setQuote(){
  random = Math.floor((Math.random() * 90) + 1);
  quote = quotesArray[random].quote;
  author = quotesArray[random].by;
  $('.quote').html(quote);
  $('.author').html(author);  
}

// Quotes list rather than using API
var quotesArray = [
  {quote: "The critical ingredient is getting off your butt and doing something. It’s as simple as that. A lot of people have ideas, but there are few who decide to do something about them now. Not tomorrow. Not next week. But today.", by: "Nolan Bushnell"},

  {quote: "Productivity is being able to do things that you were never able to do before.", by: "Franz Kafka"},

  {quote: "Until we can manage time, we can manage nothing else.", by: "Peter Drucker"},

  {quote: "Being rich is having money; being wealthy is having time.", by: "Margaret Bonnano"},

  {quote: "Life is too complicated not to be orderly.", by: "Martha Stewart"},

  {quote: "The winners in life think constantly in terms of I can, I will, and I am. Losers, on the other hand, concentrate their waking thoughts on what they should have or would have done, or what they can’t do.", by: "Dennis Waitley"},

  {quote: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", by: "Stephen King"},

  {quote: "If you spend too much time thinking about a thing, you’ll never get it done.", by: "Bruce Lee"},

  {quote: "It’s not knowing what to do, it’s doing what you know.", by: "Tony Robbins"},

  {quote: "There is no royal, flower-strewn path to success. And if there is, I have not found it. For if I have accomplished anything in life, it is because I have been willing to work hard.", by: "C.J. Walker"},

  {quote: "For all of its faults, it gives most hardworking people a chance to improve themselves economically, even as the deck is stacked in favor of the privileged few. Here are the choices most of us face in such a system: Get bitter or get busy.", by: "Bill O’ Reilly"},

  {quote: "Once you have mastered time, you will understand how true it is that most people overestimate what they can accomplish in a year – and underestimate what they can achieve in a decade!", by: "Tony Robbins"},

  {quote: "Why do anything unless it is going to be great?", by: "Peter Block"},

  {quote: "It is not enough to be busy… The question is: what are we busy about?", by: "Henry David Thoreau"},

  {quote: "To think is easy. To act is difficult. To act as one thinks is the most difficult.", by: "Johann Wolfgang Von Goeth"},

  {quote: "Few ever lived to old age, and fewer still ever became distinguished, who were not in the habit of early rising.", by: "John Todd"},

  {quote: "It is well to be up before daybreak, for such habits contribute to health, wealth, and wisdom", by: "Aristotle"},

  {quote: "Your mind is for having ideas, not holding them.", by: "David Allen"},

  {quote: "Nothing is less productive than to make more efficient what should not be done at all.", by: "Peter Drucker"},

  {quote: "I like thinking big. If you’re going to be thinking anything, you might as well think big.", by: "Donal Trump"},

  {quote: "Success is often achieved by those who don’t know that failure is inevitable.", by: "Coco Chanel"},

  {quote: "The key is not to prioritize what’s on your schedule, but to schedule your priorities.", by: "Stephen Covey"},

  {quote: "Ordinary people think merely of spending time, great people think of using it.", by: "Arthur Schopenhauer"},

  {quote: "Time is the scarcest resource and unless it is managed nothing else can be managed", by: "Peter Drucker"},

  {quote: "Focus on being productive instead of busy.", by: "Tim Ferriss"},

  {quote: "Early rising not only gives us more life in the same number of years, but adds, likewise, to their number; and not only enables us to enjoy more of existence in the same time, but increases also the measure.", by: "Caleb C. Colton"},

  {quote: "He that rises late must trot all day", by: "Benjamin Franklin"},

  {quote: "Time is at once the most valuable and the most perishable of all our possessions", by: "John Randolph"},

  {quote: "Absorb what is useful, reject what is useless, add what is specifically your own.", by: "Bruce Lee"},

  {quote: "Efficiency is doing better what is already being done.", by: "Peter Drucker"},

  {quote: "I feel that luck is preparation meeting opportunity.", by: "Oprah Winfrey"},

  {quote: "You’ve got to say, I think that if I keep working at this and want it badly enough I can have it. It’s called perseverance", by: "Lee Iacocca"},

  {quote: "Do not squander time for that is the stuff life is made of.", by: "Benjamin Franklin"},

  {quote: "We have a strategic plan. It’s called doing things.", by: "Herb Kelleher"},

  {quote: "There’s a tendency to mistake preparation for productivity. You can prepare all you want, but if you never roll the dice you’ll never be successful.", by: "Shia LaBeouf"},

  {quote: "Effective performance is preceded by painstaking preparation", by: "Brian Tracy"},
  {quote: "Think of many things; do one.", by: "Portuguese proverb"},
  {quote: "Lost time is never found again.", by: "Benjamin Franklin"},
  {quote: "In a society that judges self-worth on productivity, it’s no wonder we fall prey to the misconception that the more we do, the more we’re worth" , by: "Ellen Sue Stern"},

  {quote: "The desire of knowledge, like the thirst for riches, increases ever with the acquisition of it.", by: "Laurence Sterne"},

  {quote: "The great accomplishments of man have resulted from the transmission of ideas of enthusiasm.", by: "Thomas J. Watson"},

  
  {quote: "By failing to prepare, you are preparing to fail.", by: "Benjamin Franklin"},

  {quote: "Don’t confuse the urgent with the important.", by: "Preston Ni"},

  {quote: "Both good and bad days should end with productivity. You mood affairs should never influence your work.", by: "Greg Evans"},

  {quote: "Efficiency is doing things right. Effectiveness is doing the right things.", by: "Peter Drucker"},

  {quote: "You don’t need a new plan for next year. You need a commitment.", by: "Seth Godin"},

  {quote: "The trick is in what one emphasizes. We either make ourselves miserable, or we make ourselves strong. The amount of work is the same.", by: "Carlos Castaneda"},

  {quote: "To the degree we’re not living our dreams; our comfort zone has more control of us than we have over ourselves.", by: "Peter McWilliams"},

  {quote: "Stressing output is the key to improving to productivity, while looking to increase activity can result in just the opposite.", by: "Andrew Grove"},

  {quote: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", by: "Paul J. Meyer"},

  {quote: "If you love life, don’t waste time, for time is what life is made up of.", by: "Bruce Lee"},

  {quote: "You may delay, but time will not.", by: "Benjamin Franklin"},

  {quote: "Long-range planning works best in the short term.", by: "Doug Evelyn"},

  {quote: "Hofstadter’s Law: It always takes longer than you expect, even when you take into account Hofstadter’s Law.", by: "Douglas R. Hofstadter"},

  {quote: "You see, in life, lots of people know what to do, but few people actually do what they know. Knowing is not enough! You must take action.", by: "Tony Robbins"},

  {quote: "If there are nine rabbits on the ground, if you want to catch one, just focus on one.", by: "Jack Ma"},

  {quote: "Winning is not a sometime thing; it’s an all time thing. You don’t win once in a while, you don’t do things right once in a while, you do them right all the time. Winning is habit. Unfortunately, so is losing.", by: "Vince Lombardi"},

  {quote: "When one has much to put into them, a day has a hundred pockets.", by: "Friedrich Nietzsche"},

  {quote: "Surviving a failure gives you more self-confidence. Failures are great learning tools.. but they must be kept to a minimum.", by: "Jeffrey Immelt"},

  {quote: "A life spent making mistakes is not only more honorable, but more useful than a life spent doing nothing", by: "George Bernard Shaw"},

  {quote: "Working on the right thing is probably more important than working hard.", by: "Caterina Fake"},

  {quote: "Follow effective actions with quiet reflection. From the quiet reflection will come even more effective action.", by: "Peter Drucker"},

  {quote: "Whatever the mind of man can conceive and believe, it can achieve. Thoughts are things! And powerful things at that, when mixed with definiteness of purpose, and burning desire, can be translated into riches.", by: "Napoleon Hill"},

  {quote: "Whoever has tasted the breath of morning knows that the most invigorating and most delightful hours of then day are commonly spent in bed; though it is the evident intention of nature that we should enjoy and profit by them.", by: "Robert Southey"},

  {quote: "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change.", by: "Charles Darwin"},

  {quote: "Time is the school in which we learn, time is the fire in which we burn.", by: "Delmore Schwartz"},

  {quote: "Excellence is an art won by training and habituation. We do not act rightly because we have virtue or excellence, but we rather have those because we have acted rightly. We are what we repeatedly do. Excellence, then, is not an act but a habit.", by: "Aristotle"},

  {quote: "There is no substitute for hard work.", by: "Thomas Edison"},

  {quote: "If you don’t pay appropriate attention to what has your attention, it will take more of your attention than it deserves.", by: "David Allen"},

  {quote: "Would you like me to give you a formula for success? It’s quite simple, really. Double your rate of failure. You are thinking of failure as the enemy of success. But it isn’t at all. You can be discouraged by failure or you can learn from it, so go ahead and make mistakes. Make all you can. Because remember that’s where you will find success.", by: "Thomas Watson"},

  {quote: "Action is the foundational key to all success.", by: "Picasso"},

  {quote: "Never mistake motion for action.", by: "Ernest Hemingway"},

  {quote: "You need to be aware of what others are doing, applaud their efforts, acknowledge their successes, and encourage them in their pursuits. When we all help one another, everybody wins.", by: "Jim Stovall"},

  {quote: "While one person hesitates because he feels inferior, the other is busy making mistakes and becoming superior.", by: "Henry Link"},

  {quote: "A lot of the best work I’ve ever done started out as something completely different because I gave myself permission to have space around my time and expectations.", by: "Merlin Mann"},

  {quote: "The perfect is the enemy of the good.", by: "Voltaire"},

  {quote: "The least productive people are usually the ones who are most in favor of holding meetings.", by: "Thomas Sowell"},

  {quote: "No matter how great the talent or efforts, some things just take time. You can’t produce a baby in one month by getting nine women pregnant.", by: "Warren Buffett"},

  {quote: "If you commit to giving more time than you have to spend, you will constantly be running from time debt collectors.", by: "Elizabeth Grace Saunders"},

  {quote: "There is no waste in the world that equals the waste from needless, ill-directed, and ineffective motions.", by: "Frank Bunker Gilbreth, Sr."},

  {quote: "My goal is no longer to get more done, but rather to have less to do.", by: "Francine Jay"},

  {quote: "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.", by: "Paul J. Meyer"},

  {quote: "The simple act of paying positive attention to people has a great deal to do with productivity.", by: "Tom Peters"},

  {quote: "Concentrate all your thoughts upon the work in hand. The sun’s rays do not burn until brought to a focus.", by: "Alexander Graham Bell"},

  {quote: "The only way around is through.", by: "Robert Frost"},

  {quote: "Being lazy does not mean that you do not create. In fact, lying around doing nothing is an important, nay crucial, part of the creative process. It is meaningless bustle that actually gets in the way of productivity. All we are really saying is, give peace a chance.", by: "Tom Hodgkinson"},

  {quote: "The way we measure productivity is flawed. People checking their BlackBerry over dinner is not the measure of productivity.", by: "Timothy Ferriss"},

  {quote: "Improved productivity means less human sweat, not more.", by: "Henry Ford"},

  {quote: "The noblest search is the search for excellence.", by: "Lyndon B. Johnson"},

  {quote: "You don’t actually do a project; you can only do action steps related to it. When enough of the right action steps have been taken, some situation will have been created that matches your initial picture of the outcome closely enough that you can call it ‘done.'", by: "David Allen"},

  {quote: "It’s not always that we need to do more but rather that we need to focus on less.", by: "Nathan W. Morris"},

  {quote: "You must remain focused on your journey to greatness.", by: "Les Brown"},

  {quote: "Whether you think you can or whether you think you can’t, you’re right!", by: "Henry Ford"},

  {quote: "You only have to do a very few things right in your life so long as you don’t do too many things wrong.", by: "Warren Buffett"},

  {quote: "Don’t be fooled by the calendar. There are only as many days in the year as you make use of. One man gets only a week’s value out of a year while another man gets a full year’s value out of a week.", by: "Charles Richards"},

  {quote: "Live daringly, boldly, fearlessly. Taste the relish to be found in competition – in having put forth the best within you.", by: "Henry J. Kaiser"}
]