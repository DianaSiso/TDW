var all_titles;

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '8970078f28msha2ea7ea368acaaep14e7cdjsnb473bb932bff',
		'X-RapidAPI-Host': 'webtoon.p.rapidapi.com'
	}
};

fetch('https://webtoon.p.rapidapi.com/canvas/titles/list?genre=ALL&sortOrder=READ_COUNT&startIndex=0&pageSize=20&language=en', options)
	.then(response => response.json())
	.then((response) => {
        all_titles = response.message.result.titleList.titles;
        console.log(all_titles);
        generate_cards();
    })
	.catch(err => console.error(err));

function generate_cards() {
    var all_container = document.getElementById('all_titles');
    for (let i=0; i < all_titles.length; i++) {
        var div_row; 
        if (i % 4 == 0) { //if we create 4 cards, let's create another row because the current is already full
            var div_row = document.createElement('div');
            div_row.classList.add('row');
        }
        var div_col = document.createElement('div');
        div_col.classList.add('col-md-3');
        var div_card_body = document.createElement('div');
        div_card_body.classList.add('card-body');
        var div_card_title = document.createElement('div');
        div_card_title.id = "all_titles_title" + i;
        div_card_title.innerHTML = all_titles[i]['title'];
        var div_card_author = document.createElement('div');
        div_card_author.id = "all_titles_author" + i;
        div_card_author.innerHTML = all_titles[i]['writingAuthorName'];
        var div_card_genre = document.createElement('div');
        div_card_genre.id = "all_titles_genre" + i;
        div_card_genre.innerHTML = all_titles[i]['representGenre'];
        var div_card_language = document.createElement('div');
        div_card_language.id = "all_titles_language" + i;
        div_card_language.innerHTML = all_titles[i]['language'];   
        var span_score = document.createElement('div');
        span_score.id = "all_titles_score" + i;
        var rate = all_titles[i]['starScoreAverage']; 
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
            span_score.appendChild(icon)
        }
        let text = document.createTextNode("  (" + rate + ")");
        span_score.appendChild(text);
        div_card_body.appendChild(div_card_title);
        div_card_body.appendChild(div_card_author);
        div_card_body.appendChild(div_card_genre);
        div_card_body.appendChild(div_card_language);
        div_card_body.appendChild(span_score);   
        div_col.appendChild(div_card_body);  
        div_row.appendChild(div_col); 
        if (i % 4 == 0) { //if we create 4 cards, let's create another row because the current is already full
            all_container.appendChild(div_row);
        }
       
    }

    }