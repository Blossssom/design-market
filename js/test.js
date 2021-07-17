// import {crawl} from './crawl.js';

window.onload = (async function () {
    let jsonData = readJson();
    dropDown();
    await jsonData.then((items) => {
        items.forEach((data, i) => {
            console.log(data);
            console.log(typeof(data));
            makeCard(data, i);
        });

        detailModalView(items);
    });

});

function modalData(btnValue, data) {
    document
        .getElementById('product-title')
        .innerText = data[btnValue]
        .title;
    document
        .getElementById('product-img')
        .src = data[btnValue]
        .img;
}

function detailModalView(item) {
    let productDetail = document.querySelectorAll('.product-item');
    let productModal = document.querySelector('.detail-full');
    let modalBody = document.querySelector('.detail-full');

    productDetail.forEach(function (i) {
        i.addEventListener('click', async function (e) {
            productModal.style.display = "block";
            console.log(e.target.value);
            await modalData(e.target.value, item);
        });
    })

    modalBody.addEventListener('click', function () {
        modalBody.removeAttribute('style');
    })
}

function dropDown() {
    let clickedBtn = document.querySelectorAll('.select-drop__wrap');

    clickedBtn.forEach(function (i) {
        i.addEventListener('click', function (e) {
            if (i == clickedBtn[0] && document.querySelector('.drop-item__category').style.maxHeight == 0) {
                document
                    .querySelector('.drop-item__category')
                    .style
                    .maxHeight = "fit-content";
            } else if (i == clickedBtn[1] && document.querySelector('.drop-item__sort').style.maxHeight == 0) {
                document
                    .querySelector('.drop-item__sort')
                    .style
                    .maxHeight = "fit-content";
            } else if (i == clickedBtn[0] && document.querySelector('.drop-item__category').style.maxHeight == "fit-content") {
                document
                    .querySelector('.drop-item__category')
                    .removeAttribute("style");
            } else if (i == clickedBtn[1] && document.querySelector('.drop-item__sort').style.maxHeight == "fit-content") {
                document
                    .querySelector('.drop-item__sort')
                    .removeAttribute("style");
            }
        })
    })
}

function readJson() {
    return fetch('../json/contents.json')
        .then((response) => response.json())
        .then((json) => json.items);
}

function makeCard(data, i) {
    let cardBox = document.getElementById('card-box');
    let card = `
    <button class="col-12 col-md-3 py-3">
        <div class="contents-hover">
            <div class="card h-100">
                <div class="card-body d-flex flex-column">
                    <div
                        class="card--color__header d-flex justify-content-between card--color--type__epic">
                        <img src="${data.img}"
                            alt="" class="card-img__border">
                    </div>

                    <div class="d-flex flex-column card-product__title">
                        <div class="padding-side__1r margin-col__2r">
                            <h3 class="card-product__title">
                                ${data.title}
                            </h3>
                        </div>
                        <div class="div-flex__ac card-info__box">
                            <div class="pr-0 card-product__info">
                                <div class="m-0 font-weight-light card-price__txt">
                                    Price
                                </div>
                                <div class="m-0 font-weight-light font-color__white">
                                    ${data.price}
                                </div>
                            </div>

                            <div class="card-product__end">
                                <!-- app-countdown -->
                                <div class="m-0 font-weight-light card-price__txt">
                                    Ending in
                                </div>
                                <div class="m-0 font-weight-light font-color__white">
                                    --
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    
    </button>`;

    cardBox.innerHTML += card;

    // detailModalView(data);
}


// <button class="product-item" value=${i}></button>