var filename = process.argv[2];

var fs = require('fs');
var input_json = JSON.parse(fs.readFileSync(filename,'utf8'));

output_json = []

for (var i in input_json) {
	var item = input_json[i];

	// console.log(item.id);

	var out = {
		// Post ID
		"id":item.id,
		// Short Code
		"shortcode":item.shortcode,
		// Owner ID
		"owner-id":item.owner.id,
		// 投稿ページURL
		"page-url":"https://www.instagram.com/p/" + item.shortcode,
        // Liked Count
		"liked":item.edge_media_preview_like,
		// Comment Count
		"comment-count":item.edge_media_to_comment,
		// Caption
		"edge_media_to_caption":item.edge_media_to_caption.edges,
		// TimeStamp
		"taken_at_timestamp":new Date(item.taken_at_timestamp * 1000),
        // # Tags
		"tags":[],
		// # Tags Count
		"tags_count":0,
		// IMG
		"img":[],
		// IMG Count
		"img_count":0,
		// @ Tags
		"attag":[],
		// @ Tags Count
		"attag_count":0,
	};

	// # Tags
	if (item.tags) {
		out.tags = item.tags;
		out.tags_count = item.tags.length;
	}

    // IMG File Name
    for (var i in item.urls) {
    	out.img.push(item.urls[i].split("/").filter(e => Boolean(e)).pop())
    }
    out.img_count = out.img.length;

    // @ Tags
    if (out.edge_media_to_caption[0]) {
	    var caption = out.edge_media_to_caption[0].node.text;
    	var atArray = caption.match(/@[a-zA-Z0-9_.]*/g);
    	if (atArray) {
    		out.attag = atArray.map(function(attag) {
    			var result = [];

    			// Remove "@" & "."
    			var replacedAttag = attag.replace(/@/g,'').replace(/[.]$/g,'');
    			return replacedAttag;
    		});
   			
   			// Remove Empty String
   			out.attag = out.attag.filter(function(e) { return e !==""; });
    		out.attag_count = out.attag.length;
    	};
    };

	output_json.push(out);
}

// count sum
var all_post_count = output_json.length;
var all_tags_count = 0;
var all_img_count = 0;
var all_attag_count = 0;
var all_attag_post_count = 0;
var all_liked_count = 0;

for (var post in output_json) {
	all_tags_count += output_json[post].tags_count;
	all_img_count += output_json[post].img_count;
	all_attag_count += output_json[post].attag_count;

	if(output_json[post].attag_count > 0) {
		all_attag_post_count ++;
	}

	all_liked_count += output_json[post].liked.count;
}

console.log("userid," + filename.split("/")[0]);
console.log("all_post_count," + all_post_count);
console.log("all_tags_count," + all_tags_count);
console.log("all_img_count," + all_img_count);
console.log("all_attag_count," + all_attag_count);
console.log("all_attag_post_count," + all_attag_post_count);
console.log("all_liked_count," + all_liked_count);

fs.writeFile(filename.split(".").filter(e => Boolean(e)).shift()+'_result@.json', JSON.stringify(output_json,null,"\t"), (error) => { if (error) console.error(error) });