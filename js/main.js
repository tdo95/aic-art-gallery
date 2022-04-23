
let count = 0
const MAX_ARTWORKS = 5
// Max start point should be defined based on the size of department art collection (Too high numbers will not register with the api's 'from' parameter)
const MAX_START_POINT = 300
let departmentId = ''
let departmentKeys = {'Arts of Africa': 'PC-1', 'Comtemperary Art': 'PC-8'}
let arrOfArtworks = null;


//Set Department ID
document.querySelectorAll('.department').forEach((el) => el.addEventListener('click', setDeparmentId))
//Get list of artworks
document.querySelector('#fetch').addEventListener('click', fetchArtworks)
//Hide center wall thumbnail frames
document.querySelectorAll('.wall').forEach((el) => { 
    console.log(el); 
    el.addEventListener('click', hideImgThumbnails);
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


function setDeparmentId() {
    departmentId = departmentKeys[this.innerText]
    console.log(departmentId)
}

function fetchArtworks() {
    // Returns random number between 1 and MAX_START_POINT. Used to define a random start point in selecting a group of art work to display. This selects a random group of artwork each call.
    let randomStart = Math.ceil(Math.random()*MAX_START_POINT)

    fetch(`https://api.artic.edu/api/v1/artworks/search?q=&query[term][department_id]=${departmentId}&size=${MAX_ARTWORKS}&from=${randomStart}`)
    .then(res => res.json())
    .then(obj => {
        console.log(obj.data, obj.data.length);

        // Stores list of artworks in a global variable that can be referenced later
        arrOfArtworks = obj.data;

        // Displays art image thumbnails
        for(let i = 0; i < MAX_ARTWORKS; i++){

            let previousImg = document.querySelector(`.frame-${i}`).childNodes[0]
            
            // Remove any pre-exsting img
            if(document.querySelector(`.frame-${i}`).hasChildNodes()) document.querySelector(`.frame-${i}`).removeChild(previousImg)
            
            let img = document.createElement('img')
            img.src = obj.data[i].thumbnail.lqip
            img.classList.add('art-image')
            document.querySelector(`.frame-${i}`).appendChild(img)
        }
    })
    .catch(err => {console.log(err)})
}


// Takes in an array of artworks and generates on screen each item
function showArtCarousel(arr) {

    console.log('carousel called!')
    // Reset count
    if(count > (MAX_ARTWORKS - 1)) count = 0
    else if(count < 0) count = MAX_ARTWORKS - 1


    fetch(`${arr[count].api_link}?fields=title,image_id,thumbnail,department_title,artist_display`)
    .then(res => res.json())
    .then(item => {
        // console.log(item)

        // Unhide carousel elements
        let elements = document.querySelectorAll('.wall-art')
        elements.forEach((el, i) => {
            el.classList.remove('hidden')
        
        })

        //Display art details
        document.querySelector('.art-title').innerText = item.data.title;
        document.querySelector('.art-pic').src = `https://www.artic.edu/iiif/2/${item.data.image_id}/full/400,/0/default.jpg`
        document.querySelector('.art-pic').alt = item.data.thumbnail.alt_text
        document.querySelector('#artist').innerText = item.data.artist_display;

    })
    .catch(err => {console.log(err)})
}

function moveCarouselLeft() {
    count--; 
    showArtCarousel(arrOfArtworks);
}
function moveCarouselRight() { 
    count++; 
    showArtCarousel(arrOfArtworks);
}
function backToGallery() {

    console.log('back to gallery called!')
    // Hide carousel elements
    let elements = document.querySelectorAll('.wall-art')
    elements.forEach((el, i) => {
        el.classList.add('hidden')
    })
    // Move wall back into place 
    document.querySelector('.center-wall').classList.remove('fill-screen')

    // Show center wall thumbnail frames
    let thumbnails = document.querySelectorAll('.center-frame')
    thumbnails.forEach((el, i) => {
        el.classList.remove('hidden')
    })

}

function hideImgThumbnails() {
    console.log('hide thumbnails called!')
    let imgs = document.querySelector('.center-wall').children
    for(let i = 0; i < imgs.length; i++) {
        imgs[i].classList.add('hidden');
    }
    imgs = document.querySelector('.center-wall').classList.add('fill-screen')

    showArtCarousel(arrOfArtworks);
}