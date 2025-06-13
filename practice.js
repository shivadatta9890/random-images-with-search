// steps to follow
// 1 . get images using pexels api (should pass apiKey as headers , current page = 1 and per page images = 15). - done
// 2 . create a seperate function for html boiler plate for card and fetch images in to this card - done
// 3 . if we click on load more button then more images should be loaded.(until the images loaded , the text should be "loading" and load more button will be diabled) - done
// 4 . work on search functionality i.e., when user enters something and click enter, then load images related to that query ( use seperate api for this one , read documentation for better understanding) - done
// 5 . if we click on load more button by search anything , then next images should be related to this search query. - done
// 6 . when ever user clicks on image card then a popup should be visible , then click on cross icon the popup should be removed. - done
// 7 . if any user click on download button then image should be downloaded.
let imagesContainer = document.querySelector(".images");
let loadmoreBtn = document.querySelector(".load-more");
let userInput = document.querySelector(".input");
let popUp = document.querySelector(".modal-window");
const crossIcon = document.querySelector(".uil-times");
const downloadIcon = document.querySelector(".uil-import");


// const apiKey = {your_api_key};
let currentPage = 1;
const apiKey = "0A7wmLB2eZesKoGvmZykydt69OzEgghp9mQV5XGicDoFoPKC8rwuIjbL";
const perPage = 15;
let userInputValue = null;

// to show/hide pop up
const showPopUp = async(name,image)=>{
    popUp.classList.add("show");
    popUp.querySelector("span").innerText = name;
    popUp.querySelector(".preview-image img").src=image;
    downloadIcon.setAttribute("data-img",image);
    document.body.style.overflow = "hidden";
}

const hidePopUp = async()=>{
    popUp.classList.remove("show");
    document.body.style.overflow = "auto";
}

// to download an image by clicking on download icon
const downloadImg = async(imgUrl)=>{
  try {
    const res = await fetch(imgUrl);
    const file = await res.blob();
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "Pexels image "+new Date();
    a.click();
    // console.log(a);
    
  } catch (error) {
    alert("Failed to download image...");
  }
}

// generate an htmlCode for each image card and append it to the image container
const generateHtmlCode = async(images) => {
  imagesContainer.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick="showPopUp('${img.photographer}','${img.src.large2x}')">
          <img src=${img.src.original} alt="${img.alt}" />
          <div class="details">
            <div class="photographer-name">
              <i class="uil uil-camera"></i>
              <a href=${img.photographer_url} target="_blank"; onclick=event.stopPropagation()><span>${img.photographer}</span></a>
            </div>
            <button onclick=downloadImg("${img.src.original}");event.stopPropagation()><i class="uil uil-import"></i></button>
          </div>
        </li>`
    )
    .join("");
};

// to get images using pexel api and passing apiKey as a header
const getImages = async (apiUrl) => {
  loadmoreBtn.innerText = "Loading...";
  loadmoreBtn.classList.add("disabled");
  const res = await fetch(apiUrl, { headers: { Authorization: apiKey } });
  const data = await res.json();
  // console.log(data.photos);
  generateHtmlCode(data.photos); //generate an htmlCode for each image card and append it to the image container
  loadmoreBtn.innerText = "Load More";
  loadmoreBtn.classList.remove("disabled");
};
// loading more images when click on load more button
const loadMoreImages = async() => {
  currentPage++;
  let apiUrl = `https://api.pexels.com/v1/curated?&page=${currentPage}per_page=${perPage}`;
  apiUrl = userInputValue
    ? `https://api.pexels.com/v1/search?query=${userInputValue}&page=${currentPage}&per_page=${perPage}`
    : apiUrl; //if userInput is true then load images related to that url otherwise load default url images.
  getImages(apiUrl);
  // console.log(apiUrl);
};
// to load the search images 
const loadsearchImages = async(e) => {
  userInputValue = userInput.value;
  if (e.key === "Enter") {
    if (userInputValue === "") {
      alert("Please Enter Something😒...");
    } else {
      const apiUrl = `https://api.pexels.com/v1/search?query=${userInputValue}&page=${currentPage}&per_page=${perPage}`;
      imagesContainer.innerHTML = "";
      getImages(apiUrl);
      // console.log(apiUrl);
    }
  }
};

getImages(
  `https://api.pexels.com/v1/curated?&page=${currentPage}per_page=${perPage}`
);

loadmoreBtn.addEventListener("click", loadMoreImages);
userInput.addEventListener("keyup", loadsearchImages);
crossIcon.addEventListener("click",hidePopUp);
downloadIcon.addEventListener("click",(e)=>{
  downloadImg(e.target.dataset.img);
})