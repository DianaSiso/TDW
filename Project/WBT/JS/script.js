// ---------- Global Variables ----------
var user_email, all_titles, title_info;
var page_first_card = 0;
var page_second_card = 0;
var info_first_card, info_second_card; 
var counter_books_read = 0;
var counter_div_row = 0;
var modal_box, modal_button, modal_close;
var page_modal = 0;
var titleList;
var input_modal;
var modal_bookmark;

const key = "bac6cc94f5msh9e50682c6afe0a2p1e920ejsne0c8b8dfbbf9";

// alert(window.location['pathname'])

if (window.location['pathname'] == '/HTML/all_titles.html') {
    request_all_titles();
    get_elements_modal_box();
}

if (window.location['pathname'] == '/HTML/books_read.html') {
    request_books_read();
}

if (window.location['pathname'] == '/HTML/home.html') {
    request_home();
    get_elements_modal_box();
}

// ---------- Login Page ----------

// Function to validate user information 
function sign_in_validation() {
    user_email = document.getElementById('login_email').value;
    let user_password = document.getElementById('login_password').value;
    
    // Get the data of all users
    fetch('../DB/users.json') 
        .then(response => response.json())
        .then(response => {
            let users_info = response.userInfo;
            let email_flag = false; // Flag to check if email is in DB

            // Check if the inserted data is in the DB
            for (let i=0; i < users_info.length; i++) {
                // If the data is in the DB then we continue to the Home page.
                if (users_info[i].email == user_email && users_info[i].password == user_password){
                    window.localStorage.setItem('user_email', user_email);  // Save user email in localstorage
                    email_flag = true;
                    window.location.href = 'home.html';
                    break;
                } 
                // If the data is in the DB but something is something wrong, then we give the user feedback that helps to understand what is wrong
                else {
                    // Right email but wrong password
                    if (users_info[i].email == user_email && users_info[i].password != user_password){ 
                        alert("Password is incorrect.");
                        email_flag = true;
                        break;
                    }
                }
            }
            // Email is not in the DB, then we give the user feedback that helps to understand what is wrong
            if (!email_flag) {
                alert("Email is not in the database.");
            }
            console.log(users_info);
        });
}

// Call sign_in_validation() when button continue is pressed
try {
    document.getElementById("continue_sign_in").addEventListener("click", sign_in_validation);
} catch { 
    err => console.error(err)
}

// Function to change the sign up button to sign in or the sign in button to sign up
function change_sign_in_sign_up() {
    let title = document.getElementsByTagName("h2")[0];
    let button = document.getElementById("sign_up_sign_in");
    let forget_password = document.getElementById("forget_password");

    // Check what information is displayed: sign in or sign up.
    if (title.innerHTML == "SIGN IN") {
        // Change Sign In to Sign Up
        let password_group = document.getElementById("password_group");
        title.innerHTML = "SIGN UP";
        button.innerHTML = "Sign In";
        // Hidden the "foget password" field
        forget_password.style.display = "None";
        // Change continue button displayed
        document.getElementById("continue_sign_up").style.display = "Block";
        document.getElementById("continue_sign_in").style.display = "None";
        // Create the "confirm password" field
        let div = document.createElement("div");
        div.classList.add("form-group");
        div.id = "confirm_password_div"
        let span = document.createElement("span");
        span.classList.add("login_icons");
        let icon = document.createElement("i");
        icon.classList.add("fa-solid");
        icon.classList.add("fa-lock");
        let input = document.createElement("input");
        input.classList.add("form-control");
        input.type = "password";
        input.placeholder = "Confirm Password";
        input.id = "login_confirm_password";
        input.required = true;
        span.appendChild(icon);
        div.appendChild(span);
        div.appendChild(input);
        password_group.appendChild(div);
    } else {
        // Change Sign Up to Sign In
         title.innerHTML = "SIGN IN";
         button.innerHTML = "Sign Up";
         // Display the "forget password" field
         forget_password.style.display = "Block";
         // Remove the "confirm password" field
         document.getElementById("confirm_password_div").remove();
         // Change continue button displayed
         document.getElementById("continue_sign_in").style.display = "Block";
         document.getElementById("continue_sign_up").style.display = "None";
    }
}

// Call change_sign_in_sign_up() when button sign_up_sign_in is pressed
try {
    document.getElementById("sign_up_sign_in").addEventListener("click", change_sign_in_sign_up);
} catch { 
    err => console.error(err)
}

// Function to validate new user information and insert data in the DB
function sign_up_validation() {
    user_email = document.getElementById('login_email').value;
    let user_password = document.getElementById('login_password').value;
    let user_password_confirm = document.getElementById('login_confirm_password').value;

    // Get the data of all users
    fetch('../DB/users.json') 
        .then(response => response.json())
        .then(response => {
            let users_info = response.userInfo;
            let email_flag = false; // Flag to check if email is in DB

            // Check if email is in the DB
            for (let i=0; i < users_info.length; i++) {
                if (users_info[i].email == user_email) {
                    email_flag = true;
                    alert("Email is already in use.");
                    break;
                }
            }

            // Check if passwords match
            if (!email_flag) {
                if (user_password != user_password_confirm) {
                    alert("Passwords do not match.");
                } 
                // If email is not in the DB and passwords match, then we add the data to the DB
                else {
                    let object = {
                        "email" : user_email,
                        "password" : user_password
                    }
                    response.userInfo[response.userInfo.length] = object;
                    console.log(response);

                    window.localStorage.setItem('user_email', user_email);  // Save user email in localstorage
                    // TODO: UPDATE PYTHON FILES
                }
            }
        });
}

// Call sign_up_validation() when button continue is pressed
try {
    document.getElementById("continue_sign_up").addEventListener("click", sign_up_validation);
} catch { 
    err => console.error(err);
}


// ---------- Titles Page ----------

// Function to send the request to get all titles
function request_all_titles() {
    var options_all_titles;

    for (let x = 0; x < 3; x++) {
        y = x * 20;
        options_all_titles = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': key,
                'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
            }
        };
        
        fetch('https://webtoon.p.rapidapi.com/canvas/titles/list?genre=ALL&startIndex=' + x, options_all_titles)
            .then(response => response.json())
            .then((response) => {
                all_titles = response.message.result.titleList.titles;
                console.log(all_titles);
                generate_cards();
            })
            .catch(err => console.error(err));
    }

    // var options_all_titles = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': key,
    //         'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
    //     }
    // };
    
    // fetch('https://webtoon.p.rapidapi.com/canvas/titles/list?genre=ALL&startIndex=0', options_all_titles)
    //     .then(response => response.json())
    //     .then((response) => {
    //         all_titles = response.message.result.titleList.titles;
    //         console.log(all_titles);
    //         generate_cards();
    //     })
    //     .catch(err => console.error(err));
}

// Function to generate the card for each title
function generate_cards() {
    let all_container = document.getElementById('all_titles'); //Container that will contain all the cards

    for (let i=0; i < all_titles.length; i++) {
        var div_row;
        if (i % 4 == 0) { // Each row will contains only 4 cards, so it's necessary to create another row when the previous one is already full
            div_row = document.createElement('div');
            div_row.classList.add('row');
            div_row.classList.add('justify-content-center');
        }

        // Create all necessary HTML elements
        let div_col = document.createElement('div');
        let div_card_title = document.createElement('div');
        let div_card_body = document.createElement('div');
        let div_card_author = document.createElement('div');
        let div_card_genre = document.createElement('div');
        let span_card_genre = document.createElement('span');
        let div_card_language = document.createElement('div');
        let span_card_language = document.createElement('span');  
        let span_score = document.createElement('div');
        let div_read = document.createElement('div');
        let icon_read = document.createElement('i');
        let icon_more = document.createElement('i');
        let span_genre = document.createElement('span');
        let span_language = document.createElement('span');

        // Add all necessary classes to the respective elements
        div_col.classList.add('col-md-3');
        div_col.classList.add('align-items-stretch');
        div_col.classList.add('d-flex');
        div_card_body.classList.add('card-body');
        div_card_title.classList.add("all_titles_title");
        div_card_author.classList.add('all_titles_author');
        span_card_genre.classList.add('all_titles_genre');
        span_card_language.classList.add('all_titles_language');
        span_score.classList.add('all_titles_score');
        if (localStorage.getItem(all_titles[i]['titleNo']) == null) {
            icon_read.classList.add('fa-regular');
        } else {
            icon_read.classList.add('fa-solid');
        }
        icon_read.classList.add('fa-bookmark');
        icon_more.classList.add('fa-solid');
        icon_more.classList.add('fa-eye');
        span_genre.classList.add("card-text");
        span_language.classList.add("card-text");

        // Add the id to the respective element
        div_col.id = "card_all_titles";
        div_card_title.id = "div_card_all_title_title";
        icon_read.id = all_titles[i]['titleNo'];
        icon_more.id = "icon_read_more";
        div_card_author.id = "all_titles_author" + i;
        div_card_genre.id = "div_card_genre";
        span_card_genre.id = "all_titles_genre" + i;
        div_card_language.id = "div_card_language";
        span_card_language.id = "all_titles_language" + i;
        span_score.id = "all_titles_score" + i;

        // Edit innerHTML and style/onclick
        div_card_title.innerHTML = all_titles[i]['title'];
        div_card_title.style.marginBottom = "1.5rem";
        div_card_author.innerHTML = "- " + all_titles[i]['writingAuthorName'];
        span_card_genre.innerHTML = all_titles[i]['representGenre'];
        span_card_genre.style.background = "#" + all_titles[i]['genreColor'];
        span_card_language.innerHTML = all_titles[i]['language']; 
        div_read.style.textAlign = "center";
        div_read.style.color = "#08c0c8";
        div_read.style.marginBottom = "1rem";
        icon_read.style.marginRight = "0.5rem";
        icon_more.style.marginLeft = "0.5rem";
        icon_more.style.color = "#999";
        icon_read.setAttribute("onclick",'mark_as_read(' + all_titles[i]['titleNo'] + ')');
        icon_more.setAttribute("onclick",'request_search("' + all_titles[i].title + '" , false)');

        // For the score, the stars are calculated based on the following table:
        // _________________
        // | Rate  | Stars |
        // |  < 1  |   0   |
        // |  < 2  |   1   |
        // |  < 4  |   2   |
        // |  < 6  |   3   |
        // |  < 8  |   4   |
        // |  <10  |   5   |
        // |_______|_______|
        let rate = all_titles[i]['starScoreAverage']; 
        let number_of_stars = Math.round(rate)/2;

        for (let x = 0; x < 5; x++) {
            let icon = document.createElement("i");
            if (x < number_of_stars && number_of_stars > 1) {
                icon.classList.add("fa-solid");
            } else {
                icon.classList.add("fa-regular");
            }
            icon.classList.add("fa-star");
            icon.style.color = "#08c0c8";
            span_score.appendChild(icon)
        }
        let text = document.createTextNode("  (" + rate + ")");
        
        // Finally, appendChild to all elements in the correct order
        span_score.appendChild(text);
        div_read.appendChild(icon_read);
        div_read.appendChild(icon_more);
        div_card_body.appendChild(div_read);
        div_card_body.appendChild(div_card_title);
        div_card_body.appendChild(div_card_author);
        span_genre.appendChild(document.createTextNode("Genre: "));
        div_card_genre.appendChild(span_genre);
        div_card_genre.appendChild(span_card_genre);
        div_card_body.appendChild(div_card_genre);
        span_language.appendChild(document.createTextNode("Language: "));
        div_card_language.appendChild(span_language);
        div_card_language.appendChild(span_card_language);
        div_card_body.appendChild(div_card_language);
        div_card_body.appendChild(span_score); 
        div_col.appendChild(div_card_body);  
        div_row.appendChild(div_col); 

        if (i % 4 == 0) { // Only appendChild the div_row if div_row contains 4 cards
            all_container.appendChild(div_row);
        } 
    }
}


// ---------- Books Read Page ----------

// Function to send the request to get information about certain book
function request_books_read() {
    let books_read = localStorage.getItem(localStorage.getItem("user_email"));
    const array_books = books_read.split(",");
    for (let i = 0; i < array_books.length; i++) {
        if (localStorage.getItem(array_books[i]) != null) {
            var options_books_read = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': key,
                    'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
                }
            };
            
            fetch('https://webtoon.p.rapidapi.com/canvas/titles/get-info?titleNo=' + array_books[i], options_books_read)
                .then(response => response.json())
                .then((response) => {
                    title_info = response.message.result.titleInfo;
                    console.log(response);
                    generate_cards_read();
                })
                .catch(err => console.error(err));
        }
    }
}

// Function to generate the card for each book read
function generate_cards_read() {
    let all_container = document.getElementById('books_read'); // Container that will contain all the cards
    var div_row;

    if (counter_books_read % 4 == 0) {
        var div_row = document.createElement('div');
        div_row.classList.add('row');
        div_row.classList.add('justify-content-center');
        counter_div_row = counter_div_row + 1;
        div_row.id = 'div_row_' + counter_div_row;
    } else {
        div_row = document.getElementById('div_row_' + counter_div_row);
    }

    counter_books_read = counter_books_read + 1;

        // Create all necessary HTML elements
        let div_col = document.createElement('div');
        let div_card_title = document.createElement('div');
        let div_card_body = document.createElement('div');
        let div_card_author = document.createElement('div');
        let div_card_genre = document.createElement('div');
        let span_card_genre = document.createElement('span');
        let div_card_language = document.createElement('div');
        let span_card_language = document.createElement('span');  
        let span_score = document.createElement('div');
        let div_read = document.createElement('div');
        let icon_read = document.createElement('i');
        let span_genre = document.createElement('span');
        let span_language = document.createElement('span');

        // Add all necessary classes to the respective elements
        div_col.classList.add('col-md-3');
        div_col.classList.add('align-items-stretch');
        div_col.classList.add('d-flex');
        div_card_body.classList.add('card-body');
        div_card_title.classList.add("books_read_title");
        div_card_author.classList.add('books_read_author');
        span_card_genre.classList.add('books_read_genre');
        span_card_language.classList.add('books_read_language');
        span_score.classList.add('books_read_score');
        if (localStorage.getItem(title_info['titleNo']) == null) {
            icon_read.classList.add('fa-regular');
        } else {
            icon_read.classList.add('fa-solid');
        }
        icon_read.classList.add('fa-bookmark');
        span_genre.classList.add("card-text");
        span_language.classList.add("card-text");

        // Add the id to the respective element
        div_col.id = "card_books_read";
        icon_read.id = title_info['titleNo'];
        div_card_author.id = "books_read_author" + title_info['titleNo'];
        div_card_genre.id = "div_card_genre";
        span_card_genre.id = "books_read_genre" + title_info['titleNo'];
        div_card_language.id = "div_card_language";
        span_card_language.id = "abooks_read_language" + title_info['titleNo'];
        span_score.id = "books_read_score" + title_info['titleNo'];

        // Edit innerHTML and style/onclick
        div_card_title.innerHTML = title_info['title'];
        div_card_title.style.marginBottom = "1.5rem";
        div_card_author.innerHTML = "- " + title_info['writingAuthorName'];
        span_card_genre.innerHTML = title_info['representGenre'];
        span_card_genre.style.background = "#" + title_info['genreColor'];
        span_card_language.innerHTML = title_info['language']; 
        div_read.style.textAlign = "center";
        div_read.style.color = "#08c0c8";
        div_read.style.marginBottom = "1rem";
        icon_read.setAttribute("onclick",'mark_as_read(' + title_info['titleNo'] + ')');

        // For the score, the stars are calculated based on the following table:
        // _________________
        // | Rate  | Stars |
        // |  < 1  |   0   |
        // |  < 2  |   1   |
        // |  < 4  |   2   |
        // |  < 6  |   3   |
        // |  < 8  |   4   |
        // |  <10  |   5   |
        // |_______|_______|
        let rate = title_info['starScoreAverage']; 
        let number_of_stars = Math.round(rate)/2;

        for (let x = 0; x < 5; x++) {
            let icon = document.createElement("i");
            if (x < number_of_stars && number_of_stars > 1) {
                icon.classList.add("fa-solid");
            } else {
                icon.classList.add("fa-regular");
            }
            icon.classList.add("fa-star");
            icon.style.color = "#08c0c8"
            span_score.appendChild(icon)
        }
        let text = document.createTextNode("  (" + rate + ")");
        
        // Finally, appendChild to all elements in the correct order
        span_score.appendChild(text);
        div_read.appendChild(icon_read);
        div_card_body.appendChild(div_read);
        div_card_body.appendChild(div_card_title);
        div_card_body.appendChild(div_card_author);
        span_genre.appendChild(document.createTextNode("Genre: "));
        div_card_genre.appendChild(span_genre);
        div_card_genre.appendChild(span_card_genre);
        div_card_body.appendChild(div_card_genre);
        span_language.appendChild(document.createTextNode("Language: "));
        div_card_language.appendChild(span_language);
        div_card_language.appendChild(span_card_language);
        div_card_body.appendChild(div_card_language);
        div_card_body.appendChild(span_score); 
        div_col.appendChild(div_card_body);  
        div_row.appendChild(div_col); 

        all_container.appendChild(div_row);
}


// ---------- Home Page ----------

// Function to send the request to get home data
function request_home() {
    const options_home = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
        }
    };
    
    fetch('https://webtoon.p.rapidapi.com/canvas/home', options_home)
        .then(response => response.json())
        .then((response) => {
            // Get all webtoons that are in the Weekly Hot Title category
            info_first_card = response.message.result.weeklyHotTitleList;
            // Get all webtoons that are in the Weekly Hot Title category
            info_second_card = response.message.result.freshPicksTitleList; 
            generate_cards_home();
        })
        .catch(err => console.error(err));

}

// Function to generate the cards to display in home page
function generate_cards_home() {
    // To first card
    var webtoon_displayed = info_first_card[page_first_card];
    console.log(webtoon_displayed);
    document.getElementById("home_title_first_card").innerHTML = webtoon_displayed['title'];
    // document.getElementById("open_info_first").id = "open_info_" + webtoon_displayed['titleNo'];
    document.getElementById("home_author_first_card").innerHTML = "- " + webtoon_displayed['writingAuthorName'];
    document.getElementById("home_language_first_card").innerHTML = webtoon_displayed['language'];
    document.getElementById("home_genre_first_card").innerHTML = webtoon_displayed['representGenre'];
    document.getElementById("home_genre_first_card").style.backgroundColor = "#" + webtoon_displayed['genreColor'];
    document.getElementById("home_score_first_card").innerHTML = ""; // Clean score to add after

    // For the score, the stars are calculated based on the following table:
    // _________________
    // | Rate  | Stars |
    // |  < 1  |   0   |
    // |  < 2  |   1   |
    // |  < 4  |   2   |
    // |  < 6  |   3   |
    // |  < 8  |   4   |
    // |  <10  |   5   |
    // |_______|_______|
    let score = document.getElementById("home_score_first_card");
    let rate = webtoon_displayed['starScoreAverage'];
    let number_of_stars = Math.round(rate)/2;

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

    // Call function to check if arrows are visible or hidden
    check_arrows_home(true);

    // To second card
    webtoon_displayed = info_second_card[page_second_card];
    console.log(webtoon_displayed);
    document.getElementById("home_title_second_card").innerHTML = webtoon_displayed['title'];
    // document.getElementById("open_info_second").id = "open_info_" + webtoon_displayed['titleNo'];
    document.getElementById("home_author_second_card").innerHTML = "- " + webtoon_displayed['writingAuthorName'];
    document.getElementById("home_language_second_card").innerHTML = webtoon_displayed['language'];
    document.getElementById("home_genre_second_card").innerHTML = webtoon_displayed['representGenre'];
    document.getElementById("home_genre_second_card").style.backgroundColor = "#" + webtoon_displayed['genreColor'];
    document.getElementById("home_score_second_card").innerHTML = ""; // Clean score to add after

    // For the score, the stars are calculated based on the following table:
    // _________________
    // | Rate  | Stars |
    // |  < 1  |   0   |
    // |  < 2  |   1   |
    // |  < 4  |   2   |
    // |  < 6  |   3   |
    // |  < 8  |   4   |
    // |  <10  |   5   |
    // |_______|_______|
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

    // Call function to check if arrows are visible or hidden
    check_arrows_home(false);
}

// Function to check if arrows are visible or hidden
function check_arrows_home(first) {
    // If function it's called by the first card, first is true and we manipulate the first card, otherwise we manipulate the second
    let page = page_second_card;
    let text = "_second_card";
    let info_array = info_second_card;
    if  (first) {
        page = page_first_card
        text = "_first_card";
        info_array = info_first_card;
    }
    if (page < 1) {
        document.getElementById("arrow_back" + text).style.visibility = "hidden";
    } else {
        document.getElementById("arrow_back" + text).style.visibility = "visible";
    }
    if (page > info_array.length - 2) {
        document.getElementById("arrow_next" + text).style.visibility = "hidden";
    } else {
        document.getElementById("arrow_next" + text).style.visibility = "visible";
    }
}

// Update arrows and card displayed
document.getElementById("arrow_next_first_card").addEventListener("click", function(){ 
    page_first_card++;
    generate_cards_home();
});

// Update arrows and card displayed
document.getElementById("arrow_back_first_card").addEventListener("click", function(){ 
    page_first_card--;
    generate_cards_home();
});

// Update arrows and card displayed
document.getElementById("arrow_next_second_card").addEventListener("click", function(){ 
    page_second_card++;
    generate_cards_home();
});

// Update arrows and card displayed
document.getElementById("arrow_back_second_card").addEventListener("click", function(){ 
    page_second_card--;
    generate_cards_home();
});


// ---------- Modal Box ----------

// Function to close the modal box
function close_modal() {
    modal_box.style.display = "none";
    modal_bookmark =  document.getElementById(titleList[page_modal].titleNo);
    modal_bookmark.id = 'modal_bookmark';
}

// Function to get elements from modal box
function get_elements_modal_box() {
    modal_box = document.getElementById('modal_box');
    modal_button = document.getElementById("search_button");
    modal_close = document.getElementById("modal_close");
}

// Function to send the request to get information about the title searched
function request_search(input, flag) {
    console.log(input);
    input_modal = input;
    const search_options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
        }
    };

    fetch('https://webtoon.p.rapidapi.com/canvas/search?query=' + input , search_options)
        .then(response => response.json())
        .then((response) => {
            titleList = response.message.result.challengeSearch.titleList;
            // Hidden the feedback to the user that can not find results
            try {
                document.getElementById("warning_search").style.visibility = "hidden";
            } catch {
            }
            // If modal box display already is block, then we don't need change it
            if (modal_box.style.display != "block") {
                modal_box.style.display = "block";
            }

            // Call function to send request to search by title, that it is possible to complete the remaining fields
            request_by_title(titleList[page_modal].titleNo, flag);
        })
        .catch((err) =>  {
            console.error(err);
            // Is not possible search by title
            try {
                document.getElementById("warning_search").style.visibility = "visible";
            } catch {
            }
        });
}

// Function to send the request to get information given an ID
function request_by_title(number, flag) {
    const options_by_title = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': key,
            'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
        }
    };
    
    fetch('https://webtoon.p.rapidapi.com/canvas/titles/get-info?titleNo=' + number, options_by_title)
        .then(response => response.json())
        .then((response) => {
            var details = response.message.result.titleInfo;
            // Complete modal fields with data
            document.getElementById('modal_genre').style.backgroundColor = "#" + details['genreColor'];
            document.getElementById('modal_language').innerHTML = details['language'];
            document.getElementById('modal_synopsis').innerHTML = details['synopsis'];
            document.getElementById('modal_title').innerHTML = titleList[page_modal].title;
            document.getElementById('modal_genre').innerHTML = titleList[page_modal].representGenre;
            document.getElementById('modal_author').innerHTML = "- " + titleList[page_modal].writingAuthorName; 

            // Check if it's necessary change the icon bookmark
            modal_bookmark =  document.getElementById('modal_bookmark');
            modal_bookmark.id = titleList[page_modal].titleNo;

            if (localStorage.getItem(titleList[page_modal].titleNo) != null) {
                modal_bookmark.classList.add('fa-solid');
                modal_bookmark.classList.remove('fa-regular');
            } else {
                modal_bookmark.classList.remove('fa-solid');
                modal_bookmark.classList.add('fa-regular');
            }

            modal_bookmark.setAttribute('onclick', 'mark_as_read('+ titleList[page_modal].titleNo + ')');
        
            // For the score, the stars are calculated based on the following table:
            // _________________
            // | Rate  | Stars |
            // |  < 1  |   0   |
            // |  < 2  |   1   |
            // |  < 4  |   2   |
            // |  < 6  |   3   |
            // |  < 8  |   4   |
            // |  <10  |   5   |
            // |_______|_______|
            var number_of_stars = Math.round(titleList[page_modal].starScoreAverage)/2;
            document.getElementById("modal_score").innerHTML = "";

            for (let x = 0; x < 5; x++) {
                let icon = document.createElement("i");
                if (x < number_of_stars && number_of_stars > 1) {
                    icon.classList.add("fa-solid");
                } else {
                    icon.classList.add("fa-regular");
                }
                icon.classList.add("fa-star");
                icon.style.color = "#08c0c8"
                
                document.getElementById("modal_score").appendChild(icon);
            }
            document.getElementById("modal_score").appendChild(document.createTextNode("  (" + parseFloat(titleList[page_modal].starScoreAverage).toFixed(2) + ")"));
            
             // If flag is true, modal box is called by home cards and display more than one book
             if (flag) {
                check_arrows_modal();
            } 
            // If flag is false, modal box only display information about one book
            else {
                document.getElementById("modal_arrow_back").style.visibility = "hidden";
                document.getElementById("modal_arrow_next").style.visibility = "hidden";
            }        
        })
        .catch(err => console.error(err));
}

// Function to check if arrows are visible or hidden
function check_arrows_modal() {
    if (page_modal < 1) {
        document.getElementById("modal_arrow_back").style.visibility = "hidden";
    } else {
        document.getElementById("modal_arrow_back").style.visibility = "visible";
    }
    if (page_modal > titleList.length - 2) {
        document.getElementById("modal_arrow_next").style.visibility = "hidden";
    } else {
        document.getElementById("modal_arrow_next").style.visibility = "visible";
    }
}

document.getElementById("modal_arrow_next").addEventListener("click", function(){ 
    modal_bookmark =  document.getElementById(titleList[page_modal].titleNo);
    modal_bookmark.id = 'modal_bookmark';
    page_modal++;
    request_by_title(titleList[page_modal].titleNo, true);
});

document.getElementById("modal_arrow_back").addEventListener("click", function(){ 
    modal_bookmark =  document.getElementById(titleList[page_modal].titleNo);
    modal_bookmark.id = 'modal_bookmark';
    page_modal--;
    request_by_title(titleList[page_modal].titleNo, true);
});


// Call function request_search when click in the following elements
try {
    modal_button.onclick = function () {
        page_modal = 0;
        request_search(document.getElementById("search_input").value, true);
    }
} catch {
}

try {
    document.getElementById("open_info_first").onclick = function() {
        request_search(document.getElementById("home_title_first_card").innerHTML, false);
    }
} catch {
}

try {
    document.getElementById("open_info_second").onclick = function() {
        request_search(document.getElementById("home_title_second_card").innerHTML, false);
    }
} catch {
}


// ---------- Global Pages ----------

// Set information in 
var users_info = {
    'user_one@gmail.com' : 'user_one',
    'user_two@gmail.com' : 'user_two',
}
localStorage.setItem("users", users_info);

// Sign out function -> remove user_email from localStorage
try {
    document.getElementById("sign_out").addEventListener("click", function() {
        window.localStorage.removeItem('user_email');
    });
} catch {
    err => console.error(err)
}

// Function to mark the books that the user already read
function mark_as_read(titleNumber) {
    var books_read;
    let element = document.getElementById(titleNumber);
    // Try get the book from localStorage
    let book = localStorage.getItem(titleNumber);
    // If the book is not in localStorage, then add the book to localStorage
    if (book == null) {
        localStorage.setItem(titleNumber, true);
        // Change icon to fa-solid
        element.classList.remove('fa-regular');
        element.classList.add('fa-solid');

        // Update the list of books_read to add the book
        // Try get the set of books from localStorage
        books_read = localStorage.getItem(localStorage.getItem('user_email'));

        // If books_read exists, then we need manipulate the variable
        if (books_read != null) {
            books_read = books_read + "," + titleNumber;
        }
        localStorage.setItem(localStorage.getItem('user_email'), books_read.toString());
    }
    // If the book exists in localStorage, then remove the book from localStorage
    else {
        localStorage.removeItem(titleNumber);
        // Change icon to fa-regular
        element.classList.add('fa-regular');
        element.classList.remove('fa-solid');

        // Remove the book from set of books_read by the user
        books_read = localStorage.getItem(localStorage.getItem('user_email'));
        let books_array = books_read.split(","); // Convert String to Array
        let temp_array = []; // Temporary variable for array manipulation
        
        for (let i = 0; i < books_array.length; i++) {
            if (books_array[i] != titleNumber) { // If the element is different from the one removed, it is added to the temporary array 
                temp_array.push(books_array[i]);
            }
        } 
        localStorage.setItem(localStorage.getItem("user_email"), temp_array);
    }
    if (window.location['pathname'] != '/HTML/home.html') {
        location.reload();
    } 
}

// ---------- Get Image (invalid) ----------
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