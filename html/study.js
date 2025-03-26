import config from "./config.js";
//the listener when the document is loaded
document.addEventListener("DOMContentLoaded", function(){
    const topics = {
        "Math": "Math is the study of numbers, quantities and spaces",
        "Science": "Science is the systematic study of the natural world through observation and experiment.",
        "History": "History is the study of past events",
        "Geography": "Geography is the study of places and relationships between people and their environments."
    };
    //the listener to display review when the button is clicked
    document.getElementById('review-button').addEventListener('click', function() {  
        const topic = document.getElementById('select').value;
        document.getElementById('content-review').innerHTML = topics[topic];
    });
    //the hint me up button event listener
    document.getElementById('hint-button').addEventListener('click', function() {
        const question = document.getElementById('hintinput').value; 
        const hint1 = "1.Understand the Assignment: Carefully read and understand the instructions and requirements of the homework.";
        const hint2 = "<br><br>2.Plan and Organize: Break down the assignment into smaller tasks and create a schedule or plan to manage your time.";
        const hint3 = "<br><br>3.Gather Resources: Collect all necessary materials, such as notes, textbooks, and online resources, to help you complete the assignment.";
        const hint4 = "4.<br><br>Focus and Complete: Work on each task diligently, minimizing distractions and focusing on understanding the concepts.";
        const hint5 = "5.Review and Submit: Before submitting, carefully review your work for accuracy and completeness, making any necessary revisions.";
        document.getElementById('content-hints').innerHTML = hint1 + hint2 + hint3 + hint4 + hint5;

    });
    //the flash back contents
    const flash_backs = [
        {front_side: "Photosynthesis",back_side: "Process by which plants converts light to energy."},
        {front_side: "Velocity",back_side : "Speed in a given direction"},
        {front_side: "Mitochondria",back_side: "The powerhouse of the cell."},
        {front_side: "Prime number",back_side :"A natural number greater than 1 that has no positive divisors other than 1 and itself."},
    ];
    let currentcard = 0;
    function displaycurrentcard () {
        document.getElementById('flash-content').innerHTML = flash_backs[currentcard].front_side;
    };
    displaycurrentcard ();
    //the function to turn back_side with front_side and viceversa
    document.getElementById('flash-content').addEventListener('click', function() {
        if (document.getElementById('flash-content').innerHTML === flash_backs[currentcard].front_side){
            document.getElementById('flash-content').innerHTML = flash_backs[currentcard].back_side
        } else {
            document.getElementById('flash-content').innerHTML = flash_backs[currentcard].front_side;
        }
    
    });
    //the listeners to the prev and next buttons
    document.getElementById('prev').addEventListener('click',function(){
        currentcard = (currentcard - 1 + flash_backs.length) % flash_backs.length; 
        displaycurrentcard ();
    });
    document.getElementById('next').addEventListener('click',function() {
        currentcard = (currentcard + 1) % flash_backs.length; 
        displaycurrentcard ();
    });
    //the function to fetch multiple questions API and extracting the data and make use of them
    function questions_fetcher() {
        fetch('https://opentdb.com/api.php?amount=10&type=multiple')
            .then (response => response.json())
            .then (data =>{
                const questionsapi = data.results;
                let indexq = 0;
                //the function to parse through the API results 
                function questiondisplay(){
                    if (indexq < questionsapi.length) {
                        const currentquestion = questionsapi[indexq];
                        document.getElementById('questions').innerHTML = currentquestion.question;
                        //the line to merge correct answer and incorrect answers arrays
                        const options = [...currentquestion.incorrect_answers,currentquestion.correct_answer]; 
                        options.sort(() => Math.random() - 0.5);
                    //the line to make the options clickable buttons
                        let optionsb = "";
                        options.forEach((option) =>{
                            optionsb += `<button class="quizbuttons" data-storedata="${option}">${option}</button>`;
                        });
                    
                        document.getElementById('options').innerHTML = optionsb;
                        //adding eventlistener to the optoins buttons
                        document.querySelectorAll('.quizbuttons').forEach(buttons => {
                            buttons.addEventListener('click',function(){
                                const selectedanswer = this.dataset.storedata;
                                if (selectedanswer === currentquestion.correct_answer){
                                    document.getElementById('results').innerHTML = "Correct!!!";
                                } else{
                                    document.getElementById('results').innerHTML = "Incorrect!!!";
                                }
                                indexq++;
                                questiondisplay();
                            });
                        });
                    } else {
                        document.getElementById('questions').innerHTML = "quiz completed";
                        document.getElementById('options').innerHTML = "";
                        document.getElementById('results').innerHTML = "";
                    }
                };
                questiondisplay(); 
            })
            //the part to handle errors
            .catch(error => {
                console.error('found error fetching questions:',error);
                document.getElementById('questions').innerHTML = "failed to load quiz questions";
            });
        
    }
    questions_fetcher();
    //the function to fetch goole search and parse it to make use of it's data
    async function googlesearch(query) {
        const internetcontent = document.getElementById('internet-content');
        internetcontent.innerHTML = "loading....";
        const urlapi = `https://google-search74.p.rapidapi.com/?query=${encodeURIComponent(query)}&limit=5&related_keywords=false`;
       //the try block which will even catch some errors
        try {
            const response = await fetch(urlapi, {
                method: `GET`,
                headers: {
                    'x-rapidapi-host': 'google-search74.p.rapidapi.com',
                    'x-rapidapi-key': config.API_KEYS,
                }
            });
            //the block to parse through api fetched data
            const data = await response.json();
            if (data && data.results && data.results.length > 0) {
                let orderedline = 'ul';
                data.results.forEach((result) => {
                    //the list of unordered line results
                    orderedline += `<li><a href="${result.link}" target="blank">${result.title}</a><p>${result.description}</li>`;
                });
                orderedline += 'ul';
                internetcontent.innerHTML = orderedline;
            } else {
                internetcontent.innerHTML = 'No Results Found!!.';
            }
            //the block to catch some errors
        } catch(error) {
            internetcontent.innerHTML = 'found error fetching results';
            console.error('fetching met error:', error);

        }
    }
    //the eventlistener putted to the seach button
    document.getElementById('search').addEventListener('click', function (){
        const query = document.getElementById('internet-input').value;
        if (query) {
            googlesearch(query);
        } else {
            internetcontent.innerHTML = 'please you have to insert your topic';
        }
    });
});




    
