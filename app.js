
const auth = "563492ad6f9170000100000174f6797d6236427cafb2ca71711a483f";
const gallery = document.querySelector('.gallery')
const searchInput = document.querySelector('.search-input')
const submitBtn = document.querySelector('.submit-btn')
const searchForm = document.querySelector('.search-form')
const more = document.querySelector('.more');
let page = 1;
let fetchLink;
let cur;
const dataKey = {
    items: {}
}
let searchValue;


more.addEventListener('click', loadMore);

searchInput.addEventListener('input', function (e) {
    cur = e.target.value;
    searchValue = e.target.value;
})


searchForm.addEventListener('submit', (e) => {
    e.preventDefault()

    searchPhoto(searchValue);
})



const curatedPhotos = async function () {
    fetchLink = `https://api.pexels.com/v1/curated?page=2&per_page=40`

    const data = await fetchApi(fetchLink)

    console.log(data);
    dataKey.items = {
        nextPage: data.next_page,
        page: data.page,
        perPage: data.per_page,
        photos: data.photos,
        prevPage: data.prev_page,
        total: data.total_results
    }

    generatePictures(dataKey.items)
}


async function searchPhoto(query) {
    fetchLink = `https://api.pexels.com/v1/search?query=${query}+querypage=2&per_page=40`
    const data = await fetchApi(fetchLink)

    clear()
    generatePictures(data);

}

curatedPhotos()


async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: 'application/json',
            Authorization: auth
        }

    });
    const data = await dataFetch.json();
    return data;
}

function generatePictures(data) {
    data.photos.forEach(photo => {
        const galleryImg = document.createElement('div');
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>download</a>
        </div>
          <img src=${photo.src.large}></img>
        `
        gallery.appendChild(galleryImg)
    })
}
function clear() {
    gallery.innerHTML = ''
    searchInput.value = ''
}
async function loadMore() {
    page++;
    if (cur) {
        fetchLink = `https://api.pexels.com/v1/search?query=${cur}+querypage=${page}&per_page=40`
    }
    else {
        fetchLink = `https://api.pexels.com/v1/curated?page=${page}&per_page=40`
    }
    const data = await fetchApi(fetchLink)
    generatePictures(data)
}