
//Adding click event to pay button to start pay function
document.addEventListener('DOMContentLoaded',function(e){
  document.getElementById('btn-pay').addEventListener('click', makePayment);
});

//Check for support
if (!window.PaymentRequest) {
    document.getElementById('status').innerHTML = "Sorry, Payment Request API not supported on this browser";
}

function makePayment() {
    //Initalise payment request object
    var paymentRequest = new PaymentRequest(methodData, details, options);

    //Get methods of payment
    var methodData = [{
        supportedMethods : ['basic-card'],
    }];

    //Set some details
    var details = {
        total: {label: 'Parking Spot', amount: {currency: 'GBP', value: '1.23'}},
        displayItems: [
            {
                label: '1 x Parking Spot',
                amount: {currency: 'GBP', value: '1.00'}
            },
            {
                label: 'VAT 20%',
                amount: {currency: 'GBP', value: '0.20'}
            }
        ]
    };

    //Options for requesting information like shipping address, name, email etc
    var options = {
        requestShipping: false,
        requestPayerName: true,
        requestPayerEmail: true   
    }

    paymentRequest.show().then(function(paymentResponse) { 
    //Get the payment details
    let paymentInfo = {
        methodName: paymentResponse.methodName,
        details:    paymentResponse.details
    }
    
    //Prepare payment gateway request
    let params = {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentInfo)
    };

    //Go to page after payment is processed
    return fetch('index.html', params).then(function(response) {
        if(response.status == 200) {
        return paymentResponse.complete('success');
        }
        else {
        return paymentResponse.complete('fail');
        }
    }).then(function() {
            document.getElementById('status').innerHTML = 'Order complete!';
        }).catch(function(err) {
        return paymentResponse.complete('fail');
        });
    }).catch(function(err) {
        document.getElementById('status').innerHTML = 'Could not complete purchase at this time';
    });
}