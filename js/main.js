
// Max start point should be defined based on the size of department art collection (Too high numbers will not register with the api's 'from' parameter)
const MAX_START_POINT = 300
let departmentId = ''
let departmentKeys = {'Arts of Africa': 'PC-1', 'Comtemperary Art': 'PC-8', 'Modern Art': 'PC-11', 'Arts of Asia':'PC-7'}
let arrOfArtworks = null;
let count = 0
const MAX_ARTWORKS = 5

//Set Department ID
document.querySelectorAll('.department').forEach((el) => {
    el.addEventListener('click', setDeparmentId)
})
//Get list of artworks
document.querySelector('#fetch').addEventListener('click', fetchArtworks)
//Display art wall carousel
document.querySelectorAll('.wall').forEach((el) => { 
    el.addEventListener('click', showCarouselElements);
})
//Carousel Arrows
document.querySelector('.right-arrow').addEventListener('click', function(e) {
    moveCarouselRight();
    e.stopPropagation()
})
document.querySelector('.left-arrow').addEventListener('click', function(e) {
    moveCarouselLeft();
    e.stopPropagation()
})
//Back Button
document.querySelector('.back-arrow').addEventListener('click', function(e) {
    backToGallery(); 
    e.stopPropagation();
})
// Fetch new random set of artworks
document.querySelector('.refresh-button').addEventListener('click', fetchArtworks)
//Select a particualar frame(artwork) and have it appear in caoursel
document.querySelectorAll('.frame').forEach(el => {
    el.addEventListener('click', function(e){
        //Set artwork in coursel
        count = Number(this.id.split('-')[1]);
    })
})




function setDeparmentId() {
    departmentId = departmentKeys[this.innerText]
    document.querySelector('.collection-title').innerText = this.innerText;
    console.log(departmentId)
}
function fetchArtworks() {
    // Returns random number between 1 and MAX_START_POINT. Used to define a random start point in selecting a group of art work to display. This selects a random group of artwork each call.
    let randomStart = Math.ceil(Math.random()*MAX_START_POINT)

    fetch(`https://api.artic.edu/api/v1/artworks/search?q=&query[term][department_id]=${departmentId}&size=${MAX_ARTWORKS}&from=${randomStart}`)
    .then(res => res.json())
    .then(obj => {
        // Stores list of artworks in a global variable that can be referenced later
        arrOfArtworks = obj.data;

        // Displays art image thumbnails
        for(let i = 0; i < MAX_ARTWORKS; i++){
            
            // Remove any pre-exsting thumbnail images for each frame
            let previousImg = document.querySelector(`.frame-${i}`).childNodes[0]
            if(document.querySelector(`.frame-${i}`).hasChildNodes()) document.querySelector(`.frame-${i}`).removeChild(previousImg)
            
            let img = document.createElement('img')
            img.src = obj.data[i].thumbnail.lqip
            img.classList.add('art-image')
            document.querySelector(`.frame-${i}`).appendChild(img)
        }
    })
    .catch(err => {console.log(err)})
}
// Takes in an array of artworks and generates each peice of art work on screen one at a time
function showArtPeice(arr) {

    // Reset count to cycle through existing indexes 
    if(count > (MAX_ARTWORKS - 1)) count = 0
    else if(count < 0) count = MAX_ARTWORKS - 1

    fetch(`${arr[count].api_link}?fields=title,image_id,thumbnail,department_title,artist_display`)
    .then(res => res.json())
    .then(item => {

        //Ensure title fits page
        if(item.data.title.length > 150) document.querySelector('.art-title').style.fontSize = "20px"
        else document.querySelector('.art-title').style.fontSize = "30px"

        //Display art details
        document.querySelector('.art-title').innerText = item.data.title;
        document.querySelector('.art-pic').src = `https://www.artic.edu/iiif/2/${item.data.image_id}/full/400,/0/default.jpg`
        document.querySelector('.art-pic').alt = item.data.thumbnail.alt_text
        document.querySelector('#artist').innerText = item.data.artist_display;

    })
    .catch(err => {console.log(err)})
}
function moveCarouselLeft() {
    //Moves to previous item
    count--; 
    showArtPeice(arrOfArtworks);
}
function moveCarouselRight() {
    //Moves to next item
    count++; 
    showArtPeice(arrOfArtworks);
}
function backToGallery() {
    // Hide carousel elements
    let elements = document.querySelectorAll('.wall-art')
    elements.forEach((el, i) => {
        el.classList.add('hidden')
    })
    document.querySelector('.carousel-wall').classList.remove('viewable')
}
function showCarouselElements() {
    
    // Unhide carousel elements
    let elements = document.querySelectorAll('.wall-art')
    elements.forEach((el, i) => {
        el.classList.remove('hidden')
    })

    // Gives the system a second to reprocess so the 'viewable' transition can run
    let reflow = document.querySelector('.carousel-wall').offsetHeight

    document.querySelector('.carousel-wall').classList.add('viewable')
    showArtPeice(arrOfArtworks);
}