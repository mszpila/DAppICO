(function (Contract) {
    var web3_instance;
    var instance;
    var accounts;

    function init(cb) {
        web3_instance = new Web3(
            (window.web3 && window.web3.currentProvider) ||
            new Web3.providers.HttpProvider(Contract.endpoint));

        accounts = web3.eth.accounts;

        var contract_interface = web3_instance.eth.contract(Contract.abi);
        instance = contract_interface.at(Contract.address);
        cb();
    }

    function timeConvert(time) { 
        return time/24/60 + ":" + time/60%24 + ':' + time%60;
    }

    function getTime() {
        instance.crowdSaleDeadline(function (error, result) { // if it doesn't work create getTime function in the contract
            if(error){
              alert(error);
            }
            else{
              $("#time").html(timeConvert(result));
            }
        });
    }

    function getLeft() {
        instance.getLeftTokens(function (error, result) { // if it doesn't work create getToken function in the contract
            if(error){
              alert(error);
            }
            else{
              $("#tokens").html(result.toString());
            }
        });
    }

    function getRaised() {
        instance.totalAmountRaised(function (error, result) { // if it doesn't work create getToken function in the contract
            if(error){
              alert(error);
            }
            else{
              $("#raised").html(result.toString());
            }
        });
    }

    function waitForReceipt(txHash, cb){
      web3_instance.eth.getTransactionReceipt(txHash, function(error, receipt){
        if(error){
          alert(error);
        }
        else if(receipt !== null){
          cb(receipt);
        }
        else{
          window.setTimeout(function(){
            waitForReceipt(txHash, cb);
          }, 5000);
        }
      })
    }

    // function getResult(){
    //   instance.getLastFlip(accounts[0], function(error, result){
    //     if(result){
    //       $("#result").html("You won!");
    //     }
    //     else{
    //       $("#result").html("You lost!");
    //     }
    //   });
    // }

    function buy(){
      let val = parseInt($("#amount").val());
      instance.sendTransaction({from: accounts[0], gas:100000, value: val}, function(error, txHash){
        if(error){
          alert(error);
        }
        else{
            waitForReceipt(txHash, function(receipt){
              if(receipt.status === "0x1"){
                // getResult();
                getLeft();
                getRaised();
                $("#result").html("You have purchased " + val + " tokens!");
              }
              else{
                alert("Receipt status fail");
                $("#result").html("Transaction has failed!");
              }
            });
        }
      })
    }

    $(document).ready(function () {
          init(function () {
              getTime();
              getLeft();
              getRaised();
          });
          $("#buy").click(function(){
            buy();
          })
      });
})(Contracts['DubICOcontract', 'DubCoin']);
