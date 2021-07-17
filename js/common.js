window.onload = (function() {
    walletOn();
    walletOff();
});



function walletOn() {
    let onBtn = document.querySelector('#wallet-btn');

    onBtn.addEventListener('click', function() {
        document.querySelector('.wallet-full').style.display = "block";
    });
}


function walletOff() {
    let offBtn = document.querySelector('.wallet-btn__close');
    let modalFull = document.querySelector('.wallet-full');
    let walletBody = document.querySelector('.wallet-body');

    offBtn.addEventListener('click', function() {
        // walletBody.classList.add('wallet-animate__out');
        modalFull.removeAttribute('style');
    });

    modalFull.addEventListener('click', function() {
        modalFull.removeAttribute('style')
        
    });
}


