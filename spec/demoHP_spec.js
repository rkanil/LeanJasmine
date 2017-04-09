/**
 * Created by Anil Ras on 4/9/2017.
 */
var LFT = require("leanft");
var SDK = LFT.SDK;
var Web = LFT.Web;
var expect = require("leanft/expect");
var whenDone = LFT.whenDone;


describe("HP Site",function(){
    // set the default Jasmine time out (if not using Jasmine: remove this line)
    jasmine : jasmine.DEFAULT_TIMEOUT_INTERVAL = 30 * 1000;

    // set the default Mocha time out (if not using Mocha: remove this line)
    //mocha: this.timeout(30 * 1000);
    var browser;

    // For Jasmine, use beforeAll(); for Mocha, use before()
    beforeAll(function(done){
        LFT.init();
        whenDone(done);
    });

    beforeEach(function(done){
        LFT.beforeTest();
        Web.Browser.launch("chrome").then(function(launchedBrowser){
            browser = launchedBrowser;
        })
        whenDone(done);
    });

    it("Should describe the purpose of your test case",function(done){
        //Navigate to the web site you want to test
        browser.navigate("http://www.advantageonlineshopping.com:8080");

        //Add steps here
        browser.$(Web.Element({
            id: "TabletsImg"
        })).click();

        //gets the list of results
        var firstProduct = browser.$(Web.Element({
            tagName: "LI",
            innerText: /.*HP ElitePad 1000 G2.*/
        }));

        //gets the price
        var priceElement = firstProduct.$(Web.Element({
            tagName: "a",
            className: /.*productPrice.*/
        }));

        expect(priceElement.innerText()).toEqual("$1,009.00 ");

        whenDone(done);
    });

    afterEach(function(done){
        LFT.afterTest();
        if(browser){
            browser.close();
        }
        whenDone(done);
    });

    afterAll(function(done){
        LFT.cleanup();
        whenDone(done);
    });
});