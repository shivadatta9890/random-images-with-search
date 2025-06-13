// yet to start js

// steps to follow
// 1 . get images using pexels api (should pass apiKey as headers , current page = 1 and per page images = 15).
// 2 . create a seperate function for html boiler plate for card and fetch images in to this card
// 3 . if we click on load more button then more images should be loaded.(until the images loaded , the text should be "loading" and not able to click that button)
// 4 . work on search functionality i.e., when user enters something and click enter, then load images related to that query ( use seperate api for this one , read documentation for better understanding)
// 5 . if we click on load more button by search anything , then next images should be related to this search query along with Total results found .
// 6 . when ever user clicks on image card then a popup should be visible , then click on cross icon the popup should be removed.
// 7 . if any user click on download button then image should be downloaded.
// 8 . if there is any search input is not valid , show the text as "Not Found"


// remaining feature or bug : if I click load more cta till 5th page , then I searched any image , at first The url is showing correct apiUrl , but when I click load more of search then the results related to 6th page showing -- > fixed
const apiKey = "0A7wmLB2eZesKoGvmZykydt69OzEgghp9mQV5XGicDoFoPKC8rwuIjbL";
let currentPage = 1;
let searchPage = 1;
const perPage = 4;
let imagesContainer = document.querySelector(".images");
let loadMoreBtn = document.querySelector(".load-more");
let userInput = document.querySelector(".input");
let totalResults = document.querySelector(".total_results");
let userInputValue = null;
let modalWindow = document.querySelector(".modal-window");
const crossIcon = document.querySelector(".uil-times");
const downloadIcon = document.querySelector(".modal-window .uil-import");

const showPopUp = (image, photographer) => {
  modalWindow.classList.add("show");
  downloadIcon.setAttribute("data-img", image);
  modalWindow.querySelector("img").src = image;
  modalWindow.querySelector("span").innerText = photographer;
  document.body.style.overflow = "hidden";
};

const closePopUp = () => {
  modalWindow.classList.remove("show");
  document.body.style.overflow = "auto";
};

const downloadImage = async (image) => {
  const res = await fetch(image);
  const file = await res.blob();
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "Pexels Images " + new Date().getTime();

  a.click();
};

const htmlCode = async (images) => {
  imagesContainer.innerHTML += images
    .map(
      (
        image
      ) => `<li class="card" onclick="showPopUp('${image.src.portrait}','${image.photographer}')">
          <img src="${image.src.portrait}" alt="${image.alt}" />
          <div class="details" onclick=event.stopPropagation()>
            <div class="photographer-name">
              <i class="uil uil-camera"></i>
              <a href="${image.photographer_url}" target="_blank"><span>${image.photographer}</span></a>
            </div>
            <button><i class="uil uil-import" onclick="downloadImage('${image.src.portrait}')"></i></button>
          </div>
        </li>`
    )
    .join("");
};

const getRandomImages = async (apiUrl) => {
  loadMoreBtn.innerText = "Loading More Images...";
  loadMoreBtn.classList.add("disabled");
  totalResults.style.display = "none";
  const res = await fetch(apiUrl, { headers: { Authorization: apiKey } });
  const data = await res.json();
  if (data.total_results === 0) {
    totalResults.style.display = "block";
    totalResults.innerText = `No Images Found🥲... `;
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "block";
    totalResults.style.display = "block";
    totalResults.innerText = `Total Images Found ${data.total_results}`;
    htmlCode(data.photos);
    loadMoreBtn.innerText = "Load More Images";
    loadMoreBtn.classList.remove("disabled");
  }
  // console.log(data);
};
getRandomImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

const loadMoreImages = async () => {
  currentPage++;
  searchPage = userInputValue ? searchPage + 1 : searchPage;
  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiUrl = userInputValue
    ? `https://api.pexels.com/v1/search?query=${userInputValue}&page=${searchPage}&per_page=${perPage}`
    : apiUrl;
  getRandomImages(apiUrl);
  console.log("load more", apiUrl);
  console.log("search page ", searchPage);
};

const searchImages = async (e) => {
  userInputValue = userInput.value;
  if (userInputValue === "" && e.key === "Enter") {
    alert("Please Enter Something...");
  } else {
    if (e.key === "Enter") {
      let apiUrl = `https://api.pexels.com/v1/search?query=${userInputValue}&page=${searchPage}&per_page=${perPage}`;
      imagesContainer.innerHTML = "";
      getRandomImages(apiUrl);
      console.log("search page", apiUrl);
      console.log("search page ", searchPage);
    }
  }
};

loadMoreBtn.addEventListener("click", loadMoreImages);
userInput.addEventListener("keyup", searchImages);
crossIcon.addEventListener("click", closePopUp);
downloadIcon.addEventListener("click", (e) => {
  downloadImage(e.target.dataset.img);
});

// pending tasks
// 1 . total results is showing while loading , it should not visible until images loaded -- >  done
// 2 .
