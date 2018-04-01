let afterReset = false;
let clickCounter = 0;
let moveCounter = 0;
let mistakeCounter = 0;
let totalStars = 3; //Start with 3 stars.

// Shuffle function from http://stackoverflow.com/a/2450976
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


//Reset the cards of the deck that are not matched.
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



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

$(function () {

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
        //$('.deck').empty();
        $('.deck').append(shuffledCards);

        //Reset click counter.
        clickCounter = 0;
        //Reset move counter.
        moveCounter = 0;
        $('.moves').empty();
        $('.moves').append(moveCounter);
        //Reset star ratings.
        mistakeCounter = 0;
        totalStars=3;
        $('#star1').find('strong').html('★');
        $('#star2').find('strong').html('★');
        $('#star3').find('strong').html('★');
    }

    //Get the cards in order to shuffle them.
    let cards = document.getElementsByClassName("card");
    let cardsToShuffle = [...cards];
    let shuffledCards = shuffle(cardsToShuffle);

    let flippedCards = {
        card1class: "",
        card1element: "",
        card2class: "",
        card2element: ""
    };
    let matchFlag = false; //Checks if game has been completed

    //Set shuffled cards on deck.
    console.log(shuffledCards);
    $('.deck').empty();
    $('.deck').append(shuffledCards);

    //Restart the game after pressing the restart button.
    $('.restart').click(function () {
        playAgain();
    });

    //Flip and match cards.
    $('.deck').on('click', 'li', function () {
        let isClosed = $(this).hasClass('close');
        let isShown = $(this).hasClass('show');

        if (clickCounter <= 2) { //Make sure user doesn't open third card accidentally.
            let isMatched = $(this).hasClass('match');

            if (isClosed) {
                clickCounter += 1;

                console.log("click counter is: " + clickCounter);
                if (clickCounter <= 2) {
                    $(this).toggleClass('open');
                    $(this).toggleClass('close');
                    $(this).toggleClass('show');

                    if (clickCounter == 1) {
                        flippedCards.card1class = $(this).children('i').attr('class');
                        flippedCards.card1element = $(this);
                    }
                    if (clickCounter == 2) {
                        moveCounter++;
                        //Print move number on the score pannel.
                        $('.moves').empty();
                        $('.moves').append(moveCounter);

                        //Print move number on the results modal.
                        $('.stats').empty();
                        $('.stats').append("You made " + moveCounter + " moves.");
                        //Print out the stars-score on the result modal.
                        $('.stats').append("<br>You made it with ");

                        console.log(moveCounter);
                        flippedCards.card2class = $(this).children('i').attr('class');
                        flippedCards.card2element = $(this);

                        //In case the cards match.
                        if (flippedCards.card1class == flippedCards.card2class) {
                            $(flippedCards.card1element).toggleClass('open');
                            $(flippedCards.card1element).toggleClass('match');
                            $(flippedCards.card2element).toggleClass('open');
                            $(flippedCards.card2element).toggleClass('match');
                            clickCounter = 0;
                        } else {
                            if (afterReset == false) {
                                mistakeCounter++;
                                console.log(mistakeCounter);
                                $(flippedCards.card1element).toggleClass('unmatch');
                                $(flippedCards.card2element).toggleClass('unmatch');
                                //Every 5 mistakes, subtract a star.
                                if (mistakeCounter == 5) {
                                    $('#star3').find('strong').html('☆');
                                    totalStars--;
                                }
                                if (mistakeCounter == 10) {
                                    $('#star2').find('strong').html('☆');
                                    totalStars--;
                                }
                                if (mistakeCounter == 15) {
                                    $('#star1').find('strong').html('☆');
                                    totalStars--;
                                }
                                //Reset the cards that did not match.
                                setTimeout(resetCards, 500);
                            }
                        }
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
                if (matchCounter == cards.length) {
                    matchFlag = true; //Game has been completed
                }
            }
        });

        //If game has been completed, show modal.
        if (matchFlag) {
            //Print move number on the results modal.
            $('.stats').empty();
            $('.stats').append("You made " + moveCounter + " moves.");
            //Print out the stars-score on the result modal.
            if(totalStars==3){
                $('.stats').append("<br>WOW "+totalStars+" stars! Awesome!!");
                $('.stats').append("<br><span class='stars'>★★★</span>");
            }else if(totalStars==2){
                $('.stats').append("<br>You get "+totalStars+" stars. Very good! :D");
                $('.stats').append("<br><span class='stars'>★★☆</span>");
            }else if(totalStars==1){
                $('.stats').append("<br>You get "+totalStars+" star. You can do better :)");
                $('.stats').append("<br><span class='stars'>★☆☆</span>");
            }else{
                $('.stats').append("<br>No stars... Better luck next time.");
                $('.stats').append("<br><span class='stars'>☆☆☆</span>");
            }

            //Open the results module.
            let targeted_popup_class = $('[data-popup-open]').attr('data-popup-open');
            $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
            matchFlag = false;
        }
    });

    $('.playAgain').click(function () {
        playAgain();
    });

    //Modal

     //Open link (used for debbuging the modal).
    $('[data-popup-open]').on('click', function (e) {
        var targeted_popup_class = $(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);
        e.preventDefault();
    });

    //Close
    $('[data-popup-close]').on('click', function (e) {
        var targeted_popup_class = $(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);
        matchFlag = false;
        e.preventDefault();
    });

})