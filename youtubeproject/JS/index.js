gapi.load("client", loadClient);
var pageToken = '';
const videoList = document.getElementById('videoListContainer');
const page_number = document.getElementById('page_num');
const video_heading = document.getElementById('video_heading');
const landing_page = document.getElementById('landing_page');

document.querySelector("#search").addEventListener("click",(e)=>{
    
    e.preventDefault()
    execute();

})
function loadClient() {
    gapi.client.setApiKey("your Api key goes here");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(function() { console.log("GAPI client loaded for API"); },
    function(err) { console.error("Error loading GAPI client for API", err); });
}
function paginate(e, obj) {
    e.preventDefault();
    pageToken = obj.getAttribute('data-id');
    landing_page.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto', // or can get `auto` variable
      });
    execute();
}
function execute(userInput="youtube") {
    const searchString = document.querySelector("#user_input").value || "youtube";
    const maxresult = 12;
    const orderby = "viewCount";
  
    var arr_search = {
        "part": 'snippet',
        "type": 'video',
        "order": orderby,
        "maxResults": maxresult,
        "q": searchString
    };
  
    if (pageToken != '') {
        arr_search.pageToken = pageToken;
    }
  
    return gapi.client.youtube.search.list(arr_search)
    .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        const listItems = response.result.items;
        console.log(listItems)
        if (listItems) {
            let output = '';
            var num_page='';
  
            listItems.forEach(item => {
                const videoId = item.id.videoId;
                const videoTitle = item.snippet.title;
                output += `
                    <div><a data-fancybox href="https://www.youtube.com/watch?v=${videoId}"><img src="http://i3.ytimg.com/vi/${videoId}/hqdefault.jpg" /></a><p>${videoTitle}</p></div>
                `;
            });
            // output += '';
  
            if (response.result.prevPageToken) {
                num_page += `<br><a class="paginate" href="#" data-id="${response.result.prevPageToken}" onclick="paginate(event, this)"><img src="./Assets/img/left-arrow.png" alt="Prev" /></a>`;
            }
  
            if (response.result.nextPageToken) {
                num_page += `<a href="#" class="paginate" data-id="${response.result.nextPageToken}" onclick="paginate(event, this)"><img src="./Assets/img/right-arrow.png" alt="Next" /></a>`;
            }
  
            // Output list
            videoList.innerHTML = output;
            video_heading.innerHTML=searchString;
            page_number.innerHTML=num_page;
        }
    },
    function(err) { console.error("Execute error", err); });
}
// Disable right-click
document.addEventListener('contextmenu', (e) => e.preventDefault());

function ctrlShiftKey(e, keyCode) {
  return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
}
document.addEventListener('keyup',(e)=>{
    if(e.key=="Enter"){
        execute();
    }
})
document.onkeydown = (e) => {
//   Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
  if (
    event.keyCode === 123 ||
    ctrlShiftKey(e, 'I') ||
    ctrlShiftKey(e, 'J') ||
    ctrlShiftKey(e, 'C') ||
    (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0))
  )
    return false;
};
