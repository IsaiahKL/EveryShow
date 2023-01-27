// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 


// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // showSearchResults



// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres




// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
	elemDiv.classList.add("showDiv");
	
    var elemImage = document.createElement("img");
	elemImage.classList.add("showImage");
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
	elemShowTitle.classList.add("showTitle");
    
    var elemGenre = document.createElement("div");
	elemGenre.classList.add("showGenre");
	
    var elemRating = document.createElement("div");
	elemRating.classList.add("showRating");
	
    var elemSummary = document.createElement("div");
	elemSummary.classList.add("showSummary");
    
    // add JSON data to elements
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    elemSummary.innerHTML = tvshowJSON.show.summary;
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
    
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow





// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes

// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    var elemEpisodes = document.createElement("div");  // creates a new div tag
    elemEpisodes.classList.add("elemEpisodes");
	var output = "<ol>";
    for (episode in data) {
        output += "<li><a href='javascript:fetchEpisodeInfo(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";//change so that each link calls showEpisodeInfo
    }                       
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
        
} // showEpisodes





function fetchEpisodeInfo(episodeId){

  
  fetch('https://api.tvmaze.com/episodes/' + episodeId)  //edit this line to get indivdual episode info using episodeId var (parameter)
    .then(response => response.json())
    .then(data => showLightBox(data));	//call showLightBox on this line

}



// open lightbox and display episode info
function showLightBox(episodeInfo){ //change this var name ot episodeInfo
	console.log(episodeInfo)//log the parameter with new name
     document.getElementById("lightbox").style.display = "block";
     
     // show episode info in lightbox
		//this will now error because there's no episode ID var in this function.. ignir eit for now, and read the console to see what it logged.
		
		
		
 
document.getElementById("episodeName").innerHTML =  episodeInfo.name ;
 document.getElementById("season").innerHTML =  "season:" + episodeInfo.season ;   
  document.getElementById("episode").innerHTML =  "episode:" + episodeInfo.number ; 
    document.getElementById("summary").innerHTML = episodeInfo.summary ; 
 document.getElementById("episodeimage").src =  episodeInfo.image.medium;   	 
} // showLightBox



 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}


