let afterReset = false; //Flag used to manage the unmatch class after reseting the game.
let clickCounter = 0;
let moveCounter = 0;
let totalStars = 3; //Start with 3 stars.


/**
 * @description Shuffle function from http://stackoverflow.com/a/2450976.
 * @param {*} array The array to be shuffled
 * @returns The shuffled array.
 */
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/**
 * @description Reset the cards of the deck that are not matched.
 */
function resetCards() {
    $('.deck li').each(function () {
        let resetFlag = $(this).hasClass('open');
        let isUnmatched = $(this).hasClass('unmatch');
        if (resetFlag) {
            $(this).toggleClass('open');
            $(this).toggleClass('close');
            $(this).toggleClass('show');
        }
        if (isUnmatched) {
            $(this).toggleClass('unmatch');
        }
    });
    //Reset click counter.
    clickCounter = 0;
}

/**
 * @description Print move number on the score pannel.
 */
function increaseMoves() {
    moveCounter++;
    $('.moves').empty();
    $('.moves').append(moveCounter);
}

/**
 * @description Prints the final score in the modal.
 */
function printScore() {
    //Print move number on the results modal.
    $('.stats').empty();
    $('.stats').append("You made " + moveCounter + " moves.<br>");
    //Print out the stars-score on the result modal.
    if (totalStars == 3) {
        $('.stats').append("<br>WOW " + totalStars + " stars! Awesome!!");
        $('.stats').append("<br><span class='stars'>★★★</span>");
    } else if (totalStars == 2) {
        $('.stats').append("<br>You get " + totalStars + " stars. Very good! But not perfect...");
        $('.stats').append("<br><span class='stars'>★★☆</span>");
    } else if (totalStars == 1) {
        $('.stats').append("<br>You get " + totalStars + " star. You can do better :)");
        $('.stats').append("<br><span class='stars'>★☆☆</span>");
    }
    //Print time.
    let seconds = $('#seconds').text();
    let tens = $('#tens').text();
    $('.stats').append("<br><br>Your time is " + seconds + "s and " + tens + "ms.");
}

$(function () {

    /**
     * @description Restarts the game.
     */
    function playAgain() {
        //Turn the cards around.
        resetCards(); //Reset the unmatched cards.
        afterReset = true;
        $('.deck li').each(function () {
            let isMatched = $(this).hasClass('match');
            if (isMatched) {
                $(this).toggleClass('match');
                $(this).toggleClass('close');
                $(this).toggleClass('show');
            }
        });

        //Shuffle the cards again,
        let shuffledCards = shuffle(cardsToShuffle);
        $('.deck').append(shuffledCards);

        //Reset click counter.
        clickCounter = 0;
        //Reset move counter.
        moveCounter = 0;
        $('.moves').empty();
        $('.moves').append(moveCounter);
        //Reset star ratings.
        totalStars = 3;
        $('#star1').find('strong').html('★');
        $('#star2').find('strong').html('★');
        $('#star3').find('strong').html('★');
        //Reset timer.
        clearInterval(Interval);
        tens = "00";
        seconds = "00";
        appendTens.innerHTML = tens;
        appendSeconds.innerHTML = seconds;
    }

    /**
     * @description In case the two cards have matched this function enables the appropriate classes.
     */
    function matchCards() {
        $(flippedCards.card1element).toggleClass('open');
        $(flippedCards.card1element).toggleClass('match');
        $(flippedCards.card2element).toggleClass('open');
        $(flippedCards.card2element).toggleClass('match');
        clickCounter = 0;
    }

    /**
     * @description In case the two cards do not match, take the appropriate actions.
     */
    function unmatchCards() {
        $(flippedCards.card1element).toggleClass('unmatch');
        $(flippedCards.card2element).toggleClass('unmatch');
        //Reset the cards that did not match.
        setTimeout(resetCards, 500);
    }

    /**
     * @description Subtract a star from the rating every 10 moves.
     */
    function handleStars() {
        if (moveCounter == 10) {
            $('#star3').find('strong').html('☆');
            totalStars--;
        }
        if (moveCounter == 20) {
            $('#star2').find('strong').html('☆');
            totalStars--;
        }
    }

    /**
     * @description Starts the timer. (Timer inspiration from https://codepen.io/cathydutton/pen/GBcvo.)
     */
    function startTimer() {
        tens++;

        if (tens < 9) {
            appendTens.innerHTML = "0" + tens;
        }

        if (tens > 9) {
            appendTens.innerHTML = tens;

        }

        if (tens > 99) {
            seconds++;
            appendSeconds.innerHTML = "0" + seconds;
            tens = 0;
            appendTens.innerHTML = "0" + 0;
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds;
        }

    }

    //Get the cards in order to shuffle them.
    let cards = document.getElementsByClassName("card");
    let cardsToShuffle = [...cards];
    let shuffledCards = shuffle(cardsToShuffle);

    //Used to check if cards match.
    let flippedCards = {
        card1class: "",
        card1element: "",
        card2class: "",
        card2element: ""
    };

    //Checks if game has been completed
    let matchFlag = false;

    //Timer variables
    var seconds = 00;
    var tens = 00;
    var appendTens = document.getElementById("tens");
    var appendSeconds = document.getElementById("seconds");
    var Interval;

    //Set shuffled cards on deck.
    $('.deck').empty();
    $('.deck').append(shuffledCards);

    //Restart the game after pressing the restart button.
    $('.restart').click(function () {
        playAgain();
    });

    //Flip and match cards.
    $('.deck').on('click', 'li', function () {
        let isClosed = $(this).hasClass('close');

        //Start timer.
        clearInterval(Interval);
        Interval = setInterval(startTimer, 10);

        if (clickCounter <= 2) { //Make sure user doesn't open third card accidentally.

            if (isClosed) {
                clickCounter += 1;

                if (clickCounter <= 2) {
                    $(this).toggleClass('open');
                    $(this).toggleClass('close');
                    $(this).toggleClass('show');

                    if (clickCounter == 1) {
                        flippedCards.card1class = $(this).children('i').attr('class');
                        flippedCards.card1element = $(this);
                    }
                    if (clickCounter == 2) {
                        increaseMoves();

                        flippedCards.card2class = $(this).children('i').attr('class');
                        flippedCards.card2element = $(this);

                        //In case the cards match.
                        if (flippedCards.card1class == flippedCards.card2class) {
                            matchCards();
                        } else {
                            if (afterReset == false) {
                                unmatchCards();
                            }
                        }
                        handleStars();
                    }
                }
            }
        }
        afterReset = false;
        //After each click check if deck is complete.
        let matchCounter = 0;
        $('.deck li').each(function () {
            let isMatched = $(this).hasClass('match');
            if (isMatched) {
                matchCounter++;
                if (matchCounter == cards.length) { //If all 16 cards have matched, raise flag.
                    matchFlag = true; //Game has been completed
                }
            }
        });

        //If game has been completed, show modal.
        if (matchFlag) {
            clearInterval(Interval); //Stop timer.
            printScore();

            //Open the results module.
            let targeted_popup_class = $('[data-popup-open]').attr('data-popup-open');
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
            matchFlag = false;
        }
    });

    $('.playAgain').click(function () {
        playAgain();
    });

    //Modal inspiration from http://inspirationalpixels.com/tutorials/custom-popup-modal#step-html.

    /* //Open link (used for debbuging the modal).
    $('[data-popup-open]').on('click', function (e) {
        var targeted_popup_class = $(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
        e.preventDefault();
    }); */

    //Close
    $('[data-popup-close]').on('click', function (e) {
        var targeted_popup_class = $(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        matchFlag = false;
        e.preventDefault();
    });

})