const lyricsData = document.getElementById("dataList");
const searchInput = document.getElementById("searchterm");
const searchBtn = document.getElementById("submit");
const pagination = document.getElementById("pagination");

const url = "https://api.lyrics.ovh/";

// Event Listner
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // input data
  let inputValue = searchInput.value;

  if (inputValue === '') {
    alert("There is nothing to search");
  } else {
    getData(inputValue);
  }
});

// Event Listner
lyricsData.addEventListener("click", (e) => {
  const clickBtn = e.target;

  if (clickBtn.tagName === "BUTTON") {
    const artist = clickBtn.getAttribute("data-artist");
    const songtitle = clickBtn.getAttribute("data-songtitle");

    getLyrics(artist, songtitle);
  }
});

// Get Songs Data function
async function getData(inputValue) {
  try {
    const response = await fetch(`${url}/suggest/${inputValue}`);
    const data = await response.json();
    showData(data);
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
}

// Get Lyrics Function
async function getLyrics(artist, songtitle) {
  try {
    const response = await fetch(`${url}/v1/${artist}/${songtitle}`);
    const data = await response.json();
    const lyrics = data.lyrics.replace(/(\r\n|\n|\n)/g, "<br>");

    lyricsData.innerHTML = `<h2><strong>${artist}</strong> - ${songtitle}</h2>
    <span>${lyrics}</span>`;

    

    pagination.innerHTML = "";
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
}

// Show Data Function
function showData(data) {
    let songData = ''
    data.data.forEach(function(song){
        songData +=
        `
        <div class="card" >
        <li>
        <span>
            <div> <img src="${song.album.cover_small}" alt=""> </div>       
            ${song.artist.name} - ${song.title} 
        </span>
        <button class="btn"  data-artist="${song.artist.name}"  data-songtitle="${song.title}">View Lyrics</button>
        </li>
        </div>`
        
    })
    lyricsData.innerHTML = `
    <ul class='songs'>${songData}</ul>`


    if (data.prev || data.next) {
        pagination.innerHTML = `
                ${
                  data.prev
                    ? `<button class="btn" onClick="paginationSong('${data.prev}')">Previous</button>`
                    : ""
                }
                ${
                  data.next
                    ? `<button class="btn" onClick="paginationSong('${data.next}')">Next</button>`
                    : ""
                }
                `;
            } else {
                pagination.innerHTML = " ";
            }

}

// Pagination FUnction
async function paginationSong(urlApi) {
  try {
    const response = await fetch(
      `https://cors-anywhere.herokuapp.com/${urlApi}`
    );
    const data = await response.json();
    showData(data);
  } catch (error) {
    console.log(`ERROR : ${error}`);
  }
}
