const imagesContainer = document.querySelector(".images");
const apiKey = "0A7wmLB2eZesKoGvmZykydt69OzEgghp9mQV5XGicDoFoPKC8rwuIjbL";
let currentPage = 1;
const perPage = 4;
const loadMoreBtn = document.querySelector(".load-more");
const searchBox = document.querySelector(".search-box .input");
const totalResults = document.querySelector(".total_results");
let modalWindow = document.querySelector(".modal-window");
let crossIcon = document.querySelector(".modal-window .uil-times");
const downloadIcon = document.querySelector(".modal-window .uil-import");
let userInput = null;
let searchCurrentPage = 1;

const showPopUp = async (image,name)=>{
  modalWindow.classList.add("show");
  let img = modalWindow.querySelector("img");
  let photographerName = modalWindow.querySelector("span");
  downloadIcon.setAttribute("data-img",image);
  img.src = image;
  photographerName.innerText = name;
  document.body.style.overflow = 'hidden';
  // console.log("show pop up ",image,name);
}
const hidePopUp = async()=>{
  modalWindow.classList.remove("show");
  // console.log("hide popup clicked");
  document.body.style.overflow = 'auto';

}

const stopPopUp = async(event)=>{
  event.stopPropagation();
}

const downloadImage = async(img)=>{
  let a =document.createElement("a");
  const res = await fetch(img);
  let file = await res.blob();
  a.href = URL.createObjectURL(file);
  a.download= "pexels image "+new Date().getTime();
  a.click();
  console.log(a);
}

// code for htmlCode to render images and append it to the imagesContainer
const htmlCode = async (images) => {
  imagesContainer.innerHTML += images
    .map(
      (img) =>
        `<li class="card" onclick='showPopUp("${img.src.portrait}","${img.photographer}")'>
          <img src=${img.src.portrait} alt=${img.alt} />
          <div class="details">
            <div class="photographer-name">
              <i class="uil uil-camera" onclick="stopPopUp(event)"></i>
              <a href=${img.photographer_url} target="_blank";onclick="stopPopUp(event)"><span>${img.photographer}</span></a>
            </div>
            <button><i class="uil uil-import" onclick=downloadImage("${img.src.portrait}");event.stopPropagation()></i></button>
          </div>
        </li>`
    )
    .join("");
};

// getting random images by fetching pexels api passing our apiKey as authorization.
// also displaying the total random images available 
const getImages = async (apiUrl) => {
    loadMoreBtn.innerText = "Loading Images...";
    loadMoreBtn.classList.add("disabled");
    totalResults.style.display="none";
  const res = await fetch(apiUrl, { headers: { Authorization: apiKey } });
  const data = await res.json();
//   console.log(data.total_results);
  if(data.total_results === 0){
    totalResults.style.display="initial";
      totalResults.innerHTML = 'Sorry🥲! No Images Found... ';
      loadMoreBtn.style.display = "none";
  }else{
      htmlCode(data.photos);
      loadMoreBtn.innerText = "Load More Images";
      loadMoreBtn.classList.remove("disabled");
    //   console.log(data);
    //   console.log(data.total_results);
    totalResults.style.display="block";
      totalResults.innerHTML = `Total Images Found : ${data.total_results}`;
      //   console.log(apiUrl);
    };
}
// calling the function
getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

// by clicking on load more cta , displaying more images 
// if user searches any keyWord , then click on load more cta , we have to display the images related to those keyWord

const loadMoreImages = async() => {
  currentPage++;
currentPage = userInput ? searchCurrentPage++ : currentPage++;
// console.log(currentPage);
  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
  apiUrl = userInput ? `https://api.pexels.com/v1/search?query=${userInput}&page=${searchCurrentPage}&per_page=${perPage}` : apiUrl;
  getImages(apiUrl);
//   console.log(apiUrl);
};

// It will display the images related to the keyWords entered by user
// if images are not available , displaying a normal error screen 
const loadSearchImages = async(e)=>{
    // let currentPage = 1;
    userInput = searchBox.value;
    if(userInput === "" && e.key==="Enter"){
        alert("Please Enter Something...✍️");
    }else{
        if(e.key ==="Enter"){
            imagesContainer.innerHTML = "";
            // totalResults.style.display="none";
            // totalResults.style.display="none";
            const apiUrl = `https://api.pexels.com/v1/search?query=${userInput}&page=${searchCurrentPage}&per_page=${perPage}`;
            getImages(apiUrl);
            // totalResults.style.display = "initial";
            // totalResults.innerText = `Total Images Found : ${data.total_results}`;
            // console.log(apiUrl);
        }
    }
}

loadMoreBtn.addEventListener("click", loadMoreImages);
searchBox.addEventListener("keyup",loadSearchImages);
crossIcon.addEventListener("click",hidePopUp);
downloadIcon.addEventListener("click",(e)=>{
  downloadImage(e.target.dataset.img);
});
