/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
        if(isUnmatched){
            $(this).toggleClass('unmatch');
        }
    });
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

    let cards = document.getElementsByClassName("card");
    let cardsToShuffle = [...cards];
    let shuffledCards = shuffle(cardsToShuffle);
    let clickCounter = 0;
    let flippedCards = {
        card1class: "",
        card1element: "",
        card2class: "",
        card2element: ""
    };
    let matchFlag=false; //Checks if game has been completed

    //Set shuffled cards on deck.
    $('.deck').empty();
    $('.deck').append(shuffledCards);

    //Restart the game after pressing the restart button.
    $('.restart').click(function () {
        //Turn the cards around.
        resetCards(); //Reset the unmatched cards.
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
        $('.deck').empty();
        $('.deck').append(shuffledCards);
    });

    //Flip and match cards.
    $('.deck').on('click', 'li', function () {
        let isClosed = $(this).hasClass('close');
        let isShown = $(this).hasClass('show');
        if (clickCounter <= 2) {
            let isMatched = $(this).hasClass('match');
            if (isClosed) {
                clickCounter += 1;
                $(this).toggleClass('open');
                $(this).toggleClass('close');
                $(this).toggleClass('show');
                if (clickCounter == 1) {
                    flippedCards.card1class = $(this).children('i').attr('class');
                    flippedCards.card1element = $(this);

                }
                if (clickCounter == 2) {
                    flippedCards.card2class = $(this).children('i').attr('class');
                    flippedCards.card2element = $(this);
                    //console.log(flippedCards.card1class);
                    //console.log(flippedCards.card2class);
                    if (flippedCards.card1class == flippedCards.card2class) {
                        //console.log("match!");
                        $(flippedCards.card1element).toggleClass('open');
                        $(flippedCards.card1element).toggleClass('match');
                        $(flippedCards.card2element).toggleClass('open');
                        $(flippedCards.card2element).toggleClass('match');
                    } else {
                        $(flippedCards.card1element).toggleClass('unmatch');
                        $(flippedCards.card2element).toggleClass('unmatch');
                        setTimeout(resetCards, 500);
                    }
                    clickCounter = 0;
                }
            }
        }

        //After each click check if deck is complete.
        let matchCounter = 0;
        $('.deck li').each(function () {
            let isMatched = $(this).hasClass('match');
            if(isMatched){
                matchCounter++;
                if(matchCounter==16){
                    matchFlag=true; //Game has been completed
                }
            }
        });

        //If game has been completed, show modal.
    });
})