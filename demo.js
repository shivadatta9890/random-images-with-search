// steps to follow
// pexels url : https://api.pexels.com/v1/curated/?page=1&per_page=1
// api key = 0A7wmLB2eZesKoGvmZykydt69OzEgghp9mQV5XGicDoFoPKC8rwuIjbL
// documentation url : https://www.pexels.com/api/documentation/
// 1 . get images using pexels api (should pass apiKey as headers , current page = 1 and per page images = 15). - done
// 2 . create a seperate function for html boiler plate for card and fetch images in to this card - done
// 3 . if we click on load more button then more images should be loaded.(until the images loaded , the text should be "loading" and load more button will be diabled) - done
// 4 . work on search functionality i.e., when user enters something and click enter, then load images related to that query ( use seperate api for this one , read documentation for better understanding) - done
// 5 . if we click on load more button by search anything , then next images should be related to this search query. - pending
// 6 . when ever user clicks on image card then a popup should be visible , then click on cross icon the popup should be removed. - done
// 7 . if any user click on download button then image should be downloaded. - done
// 8 . if user click on image then only we have to show the modal window - done
// 9 . while searching for images , while loading the total results button shouldn't be visible - done
// 10 . If total results count is >=4 then there is no need to show the load more button.

// Search Input Behavior Requirements
// Overview:
// The search input should handle three distinct user interaction cases. Depending on whether the user enters a value and whether there is a previously stored search, the behavior should include showing alerts, clearing the image container, and loading images accordingly.

// ✅ Functional Requirements
// Case 1: User enters a search query
// Condition: Input field is not empty.

// Behavior:

// Do not show an alert.

// Clear the imagesContainer before showing new results.

// Perform a search request using the input value.

// Store the input in localStorage as the current search term.

// Case 2: Input is empty & a previous search exists
// Condition: Input field is empty AND a previous search term exists in localStorage.

// Behavior:

// Do not show an alert.

// Remove the previous search from localStorage.

// Clear the imagesContainer.

// Load random (curated) images from the API.

// Case 3: Input is empty & no previous search
// Condition: Input field is empty AND no previous search is stored.

// Behavior:

// Show a non-blocking alert (e.g., “Please enter something ✍️”).

// Do not clear the imagesContainer.

// Still load random (curated) images for user engagement.
let imagesContainer = document.querySelector(".images");
let loadMoreBtn = document.querySelector(".load-more");
let userInput = document.querySelector(".search-box .input");
let modalWindow = document.querySelector(".modal-window");
let closeIcon = document.querySelector(".modal-window .uil-times");
let downloadIcon = modalWindow.querySelector(".uil-import");
let customAlert = document.getElementById("customAlert");
let totalResults = document.querySelector(".total_results");
let apiKey = "0A7wmLB2eZesKoGvmZykydt69OzEgghp9mQV5XGicDoFoPKC8rwuIjbL";
let currentPage = 1;
let perPage = 4;

let hasPreviousSearch = localStorage.getItem("search");
// console.log("previous search",hasPreviousSearch);

// totalResults.style.display="none";

// when click on image card a pop up will be shown
const showPopUp = async (image, photographer) => {
  modalWindow.classList.add("show");
  document.body.style.overflow = "hidden";
  let modalWindowImage = modalWindow.querySelector("img");
  let modalWindowPhotographer = modalWindow.querySelector("span");
  downloadIcon.setAttribute("data-img", image); //here we can give any name but it should be start with data
  modalWindowImage.src = image;
  modalWindowPhotographer.innerText = photographer;
};

// clicking on x icon the pop up should close
closeIcon.onclick = async () => {
  modalWindow.classList.remove("show");
  document.body.style.overflow = "";
};
// download the image
const downloadImage = async (imageUrl) => {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "Pexels Images";
    a.click();
  } catch (error) {
    console.log("error ", error);
  }
};
// html boiler plate code
const htmlCode = async (images) => {
  images.map((image) => {
    imagesContainer.innerHTML += `<li class="card" onclick = 'showPopUp("${image.src.portrait}","${image.photographer}")'>
          <img src="${image.src.portrait}" alt="image"/>
          <div class="details" onclick="event.stopPropagation()">
            <div class="photographer-name">
              <i class="uil uil-camera"></i>
              <a href="${image.photographer_url}" target="_blank"><span>${image.photographer}</span></a>
            </div>
            <button><i class="uil uil-import" onclick="downloadImage('${image.src.portrait}')"></i></button>
          </div>
        </li>
    `;
  });
};

// loading more images when clicked on load more cta
const loadMoreImages = async () => {
  currentPage++;
  let apiUrl = `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`;
  apiUrl = userInput.value
    ? `https://api.pexels.com/v1/search?query=${userInput.value}&page=${currentPage}&per_page=${perPage}`
    : apiUrl;
  await loadImages(apiUrl);
  console.log("load more url", apiUrl);
};

// getting random images from the pexels API
const loadImages = async (apiUrl) => {
  // when user clicks on load more btn the button will be disabled till loading of images
  loadMoreBtn.innerText = "Loading Images...";
  loadMoreBtn.classList.add("disabled");
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: apiKey,
    },
  });
  const data = await res.json();
  htmlCode(data.photos);
  loadMoreBtn.innerText = "Load More Images";
  loadMoreBtn.classList.remove("disabled");
  console.log("get images", apiUrl);
  if (data.total_results === 0) {
    totalResults.innerText = `No Results Found 😮! search with other Keywords✌️`;
    loadMoreBtn.style.display = "none";
  } else if (data.total_results <= 4) {
    totalResults.innerText = `Total Results Found : ${data.total_results}`;
    loadMoreBtn.style.display = "none";
  } else {
    totalResults.innerText = `Total Results Found : ${data.total_results}`;
    loadMoreBtn.style.display = data.total_results > 4 ? "initial" : "none";
  }
  totalResults.style.display = "initial";
};
// function call with the apiUrl
// loadImages(
//   `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`
// );

// calling the function when user clicks on load more button
loadMoreBtn.onclick = () => {
  loadMoreImages();
};
// showing alert when user input is empty and clicks on enter
const showAlert = () => {
  customAlert.classList.add("show");
};

const closeAlert = () => {
  customAlert.classList.remove("show");
};
// search images based on user input
// userInput.onkeydown = async (e) => {
//   let userInputValue = userInput.value;
//   // totalResults.style.display="none";
//   if (e.key === "Enter") {
//     e.preventDefault();
//     totalResults.style.display = "none";
//     imagesContainer.innerHTML = "";
//     currentPage = 1;
//     let apiUrl = `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`;

//     const hasPreviousSearch = localStorage.getItem("search");

//     if (userInputValue === "") {
//       if (hasPreviousSearch) {
//         localStorage.removeItem("search");
//         loadImages(apiUrl);
//       } else {
//         showAlert();
//         return;
//         // loadImages(apiUrl);
//       }
//     } else {
//       localStorage.setItem("search", userInputValue);
//       let apiUrl = `https://api.pexels.com/v1/search?query=${userInputValue}&page=${currentPage}&per_page=${perPage}`;
//       loadImages(apiUrl);
//     }
//   }
// };

userInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent page refresh

    const userInputValue = userInput.value.trim();
    const hasPreviousSearch = localStorage.getItem("search");
    currentPage = 1;
    totalResults.style.display = "none";


    if (userInputValue === "") {
      if (hasPreviousSearch) {
        // Case 2: Empty input + previous search → clear images + load random
        localStorage.removeItem("search");
        imagesContainer.innerHTML = ""; // ✅ Clear before loading

      } else {
        // Case 3: Empty input + NO previous search → show alert, do NOT clear
         totalResults.style.display = "initial";
        showAlert();
        return; // ✅ Show non-blocking alert
      }

      // ✅ Load random images in both cases
      const apiUrl = `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`;
      loadImages(apiUrl);
    } else {
      // Case 1: User typed something → clear + search
      localStorage.setItem("search", userInputValue);
      imagesContainer.innerHTML = ""; // ✅ Clear before search
      const apiUrl = `https://api.pexels.com/v1/search?query=${userInputValue}&page=${currentPage}&per_page=${perPage}`;
      loadImages(apiUrl);
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  let searchTerm = localStorage.getItem("search");
  userInput.value = searchTerm;
  apiUrl = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`
    : `https://api.pexels.com/v1/curated/?page=${currentPage}&per_page=${perPage}`;
  loadImages(apiUrl);
});

// downloading the image when user clicks the download icon in the modal window
downloadIcon.onclick = (e) => {
  downloadImage(e.target.dataset.img);
};
