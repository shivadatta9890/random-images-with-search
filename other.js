let imagesContainer = document.querySelector(".images");
const apiKey = "0A7wmLB2eZesKoGvmZykydt69OzEgghp9mQV5XGicDoFoPKC8rwuIjbL";
let loadMoreBtn = document.querySelector(".load-more");
let userInput = document.querySelector(".search-box .input");
let totalResults = document.querySelector(".total_results");
let modalWindow = document.querySelector(".modal-window");
let closeIcon = document.querySelector(".modal-window .uil-times");
let downloadIcon = document.querySelector(".modal-window .uil-import");
const modal = document.getElementById("customAlert");
// const savedSearchTerm = localStorage.getItem("userInput");

// It is used to close the pop up when user click on cross icon
const closePopUp = async () => {
  modalWindow.classList.remove("show");
  document.body.style.overflow = "visible";
};

closeIcon.addEventListener("click", closePopUp);
let userInputValue = "";
let perPage = 4;
let currentPage = 1;

// It is used to show the pop up when user click on image card
const showPopUp = async (image, photographer) => {
  modalWindow.classList.add("show");
  let img = modalWindow.querySelector("img");
  downloadIcon.setAttribute("data-img", image);
  img.src = image;
  let photographerName = modalWindow.querySelector("span");
  photographerName.innerText = photographer;
  document.body.style.overflow = "hidden";
};

// It is used to download image,on click of download icon
const downloadImage = async (imgUrl) => {
  const res = await fetch(imgUrl);
  const file = await res.blob();
  // console.log("res",res);
  // console.log("file",file);
  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "Pexels Image " + new Date().getTime();
  a.click();

  // console.log("download image", imgUrl);
};

// generate html code
const htmlCode = async (images) => {
  images.map((image) => {
    imagesContainer.innerHTML += `<li class="card" onclick="showPopUp('${image.src.portrait}','${image.photographer}')">
          <img src="${image.src.portrait}" alt="${image.alt}" />
          <div class="details" onclick="event.stopPropagation()">
            <div class="photographer-name">
              <i class="uil uil-camera"></i>
              <a href="${image.photographer_url}" target="_blank"><span>${image.photographer}</span></a>
            </div>
            <button><i class="uil uil-import" onclick="downloadImage('${image.src.portrait}')"></i></button>
          </div>
        </li>`;
  });
};

// It is used to load more images when click on load more images button
const loadMoreImages = async () => {
  currentPage++;
  const savedSearchTerm = localStorage.getItem("userInput");
  if (savedSearchTerm) {
    userInputValue = savedSearchTerm;
  }
  // console.log("saved", savedSearchTerm);
  // console.log("userInput", userInputValue);
  let apiUrl = `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`;

  apiUrl = userInputValue
    ? `https://api.pexels.com/v1/search?query=${userInputValue}&page=${currentPage}&per_page=${perPage}`
    : apiUrl;
  showRandomImages(apiUrl);
  // console.log("load more url", apiUrl);
};

// It is used to show random images from the api
const showRandomImages = async (apiUrl) => {
  loadMoreBtn.innerText = "Loading Images...";
  loadMoreBtn.classList.add("disabled");
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  });
  const data = await res.json();
  if (data.total_results === 0) {
    totalResults.style.display = "none";
    totalResults.style.display = "initial";
    totalResults.innerText = "No Results Found!...";
    // totalResults.innerHTML = "<img style='height:300px;width:400px;' src='images/error.jpg' alt='error'/> >";
    loadMoreBtn.style.display = "none";
  } else {
    totalResults.style.display = "none";
    loadMoreBtn.style.display = "initial";
    totalResults.style.display = "initial";
    totalResults.innerText = `Total Results Found : ${data.total_results}`;
    htmlCode(data.photos);
    loadMoreBtn.innerText = "Load More Images";
    loadMoreBtn.classList.remove("disabled");
    console.log("show random images", apiUrl);
  }
  // console.log("data",data);
  // console.log(apiUrl);
};

// showRandomImages(
//   `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`
// );
loadMoreBtn.addEventListener("click", loadMoreImages);

// const storedValue = localStorage.getItem('userInput');

// // If there's a stored value, set it as the input field's value
// if (storedValue) {
//   userInput.value = storedValue;
// }

const showAlert = async () => {
  document.querySelector(".custom-alert").classList.add("show");
  document.body.style.overflow = "hidden";
};

const closeAlert = async () => {
  document.querySelector(".custom-alert").classList.remove("show");
  document.body.style.overflow = "auto";
};

window.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeAlert();
  }
});

userInput.onkeydown = async(e)=>{
  let userInputValue = userInput.value.trim();
  let currentPage = 1;
  let hasPreviousSearch = localStorage.getItem("search");
  if(e.key === "Enter"){
    if(userInputValue === ""){
      if(hasPreviousSearch){
        localStorage.removeItem("search");
      }else{
        showAlert();
        return;
      }
    }else{
      imagesContainer.innerHTML = "";
      localStorage.setItem("search",userInputValue);
      apiUrl = `https://api.pexels.com/v1/search?query=${userInputValue}&page=${currentPage}&per_page=${perPage}`;
    }
  }
};

// It is used to search images based on user input
// userInput.addEventListener("keyup", (e) => {
//   userInputValue = userInput.value.trim();
//   if (userInputValue === "" && e.key === "Enter") {
//     showAlert();
//   } else if (e.key === "Enter") {
//       localStorage.setItem("userInput", userInputValue);
//       // console.log("user entered word", userInputValue);
//       // userInputValue = localStorage.getItem("userInput");
//       imagesContainer.innerHTML = "";
//       currentPage = 1;
//       let apiUrl = `https://api.pexels.com/v1/search?query=${userInputValue}&page=${currentPage}&per_page=${perPage}`;
//       showRandomImages(apiUrl);
//       // console.log("seach images", apiUrl);
//       // console.log("userinput",userInput.value);
//   }
// });

window.onload = function () {
  const savedSearchTerm = localStorage.getItem("userInput");
  if (savedSearchTerm) {
    userInput.value = savedSearchTerm; // Pre-fill input field with saved value
    const apiUrl = `https://api.pexels.com/v1/search?query=${savedSearchTerm}&page=${currentPage}&per_page=${perPage}`;
    showRandomImages(apiUrl); // Automatically trigger the search if there's a saved term
  } else {
    // Optionally, you can load random images if no search term is saved
    const apiUrl = `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`;
    showRandomImages(apiUrl);
  }
};

downloadIcon.addEventListener("click", (e) => {
  downloadImage(e.target.dataset.img);
});
