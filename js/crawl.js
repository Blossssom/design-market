const axios = require("axios");
const cheerio = require("cheerio");

const getHtml = async () => {
    try {
        // return await axios.get("http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioFrame&applno=1020190136040&index=0&start=fulltext&openPageId=View03");
        return await axios.get("http://kpat.kipris.or.kr/kpat/biblioa.do?method=biblioMain_biblio&next=biblioViewSub01&applno=1020190136040&getType=BASE&link=N");
    } catch(error) {
        console.error(error);
    }
};


getHtml().then(html => {
    let dataList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("h1.title_hidden");
    
    console.log($bodyList.text());
    // const data = dataList.filter(n => n.title);
    return dataList;
}).then(res => {
    console.log(res);
});


// $bodyList.each(function(i, el) {
//     dataList[i] = {
//         title: $(this).find('div.item div.title_box').text(),
//         // url: 'search.naver.com/search.naver'+$(this).find('div.list_title a').attr('href'),
//         // image_url: $(this).find('div.list_thumb a img').attr('src'),
//         // image_alt: $(this).find('div.list_thumb a img').attr('alt'),
//     };
// });