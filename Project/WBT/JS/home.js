var page_first_card = 0;
var page_second_card = 0;
var info_first_card;
var info_second_card; 

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '8970078f28msha2ea7ea368acaaep14e7cdjsnb473bb932bff',
		'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
	}
};

fetch('https://webtoon.p.rapidapi.com/canvas/home?language=en', options)
	.then(response => response.json())
    .then((response) => {
        info_first_card = response.message.result.weeklyHotTitleList; // variable with all webtoons that are in the hot title list
        info_second_card = response.message.result.freshPicksTitleList; 
        put_info();
    })
	.catch(err => console.error(err));


function put_info() {

    // code to first_card
    var webtoon_displayed = info_first_card[page_first_card];
    console.log(webtoon_displayed);
    document.getElementById("home_title_first_card").innerHTML = webtoon_displayed['title'];
    document.getElementById("home_author_first_card").innerHTML = "- " + webtoon_displayed['writingAuthorName'];
    document.getElementById("home_language_first_card").innerHTML = webtoon_displayed['language'];
    document.getElementById("home_genre_first_card").innerHTML = webtoon_displayed['representGenre'];
    document.getElementById("home_genre_first_card").style.backgroundColor = "#" + webtoon_displayed['genreColor'];
    //to clean
    document.getElementById("home_score_first_card").innerHTML = "";

    var score = document.getElementById("home_score_first_card");
    var rate = webtoon_displayed['starScoreAverage'];
    var number_of_stars = Math.round(rate)/2;

    for (let x = 0; x < 5; x++) {
        let icon = document.createElement("i");
        if (x < number_of_stars && number_of_stars > 1) {
            icon.classList.add("fa-solid");
        } else {
            icon.classList.add("fa-regular");
        }
        icon.classList.add("fa-star");
        icon.style.color = "#08c0c8"
        score.appendChild(icon)
    }
    let text = document.createTextNode("  (" + rate + ")");
    score.appendChild(text);
    check_arrows_first_card();
    //get_image(webtoon_displayed['thumbnail']);

    // code to second card
    webtoon_displayed = info_second_card[page_second_card];
    console.log(webtoon_displayed);
    document.getElementById("home_title_second_card").innerHTML = webtoon_displayed['title'];
    document.getElementById("home_author_second_card").innerHTML = "- " + webtoon_displayed['writingAuthorName'];
    document.getElementById("home_language_second_card").innerHTML = webtoon_displayed['language'];
    document.getElementById("home_genre_second_card").innerHTML = webtoon_displayed['representGenre'];
    document.getElementById("home_genre_second_card").style.backgroundColor = "#" + webtoon_displayed['genreColor'];
    //to clean
    document.getElementById("home_score_second_card").innerHTML = "";

    score = document.getElementById("home_score_second_card");
    rate = webtoon_displayed['starScoreAverage'];
    number_of_stars = Math.round(rate)/2;

    for (let x = 0; x < 5; x++) {
        let icon = document.createElement("i");
        if (x < number_of_stars && number_of_stars > 1) {
            icon.classList.add("fa-solid");
        } else {
            icon.classList.add("fa-regular");
        }
        icon.classList.add("fa-star");
        icon.style.color = "#08c0c8"
        score.appendChild(icon)
    }
    text = document.createTextNode("  (" + rate + ")");
    score.appendChild(text);
    check_arrows_second_card();
    //get_image(webtoon_displayed['thumbnail']);
}



function get_image(url) {
    var myHeaders = new Headers();
    myHeaders.append("Referer", "http://m.webtoons.com/");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Linux; Android 8.1.0; Mi MIX 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36");
    myHeaders.append('Content-Type', 'application/json');
    // myHeaders.append("X-RapidAPI-Key", "8970078f28msha2ea7ea368acaaep14e7cdjsnb473bb932bff");
    // myHeaders.append("X-RapidAPI-Host", "webtoon.p.rapidapi.com");
    // myHeaders.append("Access-Control-Allow-Origin", "*")
    // myHeaders.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    // myHeaders.append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    var requestOptions = {
    method: 'GET',
    headers: myHeaders
    };

    fetch('https://webtoon-phinf.pstatic.net' + url, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    
}

function check_arrows_first_card() {
    if (page_first_card < 1) {
        document.getElementById("arrow_back_first_card").style.visibility = "hidden";
    } else {
        document.getElementById("arrow_back_first_card").style.visibility = "visible";
    }
    if (page_first_card > info_first_card.length - 2) {
        document.getElementById("arrow_next_first_card").style.visibility = "hidden";
    } else {
        document.getElementById("arrow_next_first_card").style.visibility = "visible";
    }
}

function check_arrows_second_card() {
    if (page_second_card < 1) {
        document.getElementById("arrow_back_second_card").style.visibility = "hidden";
    } else {
        document.getElementById("arrow_back_second_card").style.visibility = "visible";
    }
    if (page_second_card > info_second_card.length - 2) {
        document.getElementById("arrow_next_second_card").style.visibility = "hidden";
    } else {
        document.getElementById("arrow_next_second_card").style.visibility = "visible";
    }
}

document.getElementById("arrow_next_first_card").addEventListener("click", function(){ 
    page_first_card++;
    put_info()
});

document.getElementById("arrow_back_first_card").addEventListener("click", function(){ 
    page_first_card--;
    put_info();
});

document.getElementById("arrow_next_second_card").addEventListener("click", function(){ 
    page_second_card++;
    put_info()
});

document.getElementById("arrow_back_second_card").addEventListener("click", function(){ 
    page_second_card--;
    put_info();
});