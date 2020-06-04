function encodeHtml(str) {
  var buf = [];

  for (var i=str.length-1;i>=0;i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }

  return buf.join('');
}

$(function() {
  var sheetUrl =
    "https://spreadsheets.google.com/feeds/cells/1fy-ZztZlhwgfz1wH8YGji2zuiiEfV88XyCRBDzLB1AA/2/public/full?alt=json";

  $.getJSON(sheetUrl, function(data) {
    const entries = data.feed.entry;
    let listings = [];

    for (const e of entries) {
      let cell = e.gs$cell;
      if (cell) {
        let row = cell.row;
        const col = cell.col;
        const val = cell.$t;
        let paramName;

        if (row != 1) { //skip the header row
          row -= 2; //decrement for the skipped row and to iterate from 0
          if (!listings[row]) {
            listings[row] = {};
          }

          switch (col) {
            case "1":
              paramName = "title";
              break;
            case "2":
              paramName = "image";
              break;
            case "3":
              paramName = "link";
              break;
            default:
              console.log("ERROR: No paramName mapped");
          }
          listings[row][paramName] = encodeHtml(val);
        }
      }
    }
    let r = 0;
    let i = 0;
    let p = 0;
    for (const listing of listings) {
      $('#container').append(`<a-image position="${i*2}.${i} ${r*1.3} 0"
                 width="2" height="1"
                 link="href: ${listing.link}"
                 src="${listing.image}">   
          <a-entity
            geometry="primitive: plane; width: 2; height: .2"
            material="color: #111"
            text="align:center; value: ${listing.title}"
            position="0 -.6 0"></a-entity>
        </a-image>`);
      i++;
      if (i == 4) {
        r--;
        i = 0;
        p++;
      }
      if (p == 3) {
        r+=20;
        p = 0;
        pages++;
        console.log(pages);
      }
    }
  });
});
