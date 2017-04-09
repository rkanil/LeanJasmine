/**
 * Created by Anil Ras on 4/9/2017.
 */
var LFT = require("leanft");
var Web = LFT.Web;
var expect = require("leanft/expect");
jasmine.DEFAULT_TIMEOUT_INTERVAL =120000; //increase the timeout of the Jasmine framework - will not work in Mocha
describe("Demo promises with execution synchronization test cases", function () {
    var browser;

    beforeAll(function(done) {
        LFT.init();

        Web.Browser.launch(Web.BrowserType.Chrome)
            .then(function (returnedBrowser) {
                browser = returnedBrowser;
            });

        LFT.whenDone(done);
    });


    afterAll(function(done) {
        if(browser) {
            browser.close();
        }
        LFT.cleanup();
        LFT.whenDone(done);
    });


    beforeEach(function(done) {
        LFT.beforeTest();

        //navigate to the HP demo site
        browser.navigate("http://www.advantageonlineshopping.com:8080/#");

        LFT.whenDone(done);
    });

    afterEach(function(done) {
        LFT.afterTest();
        LFT.whenDone(done);
    });


    it("simple click and expect test", function (done) {
        //click on the Tablets image
        browser.$(Web.Element({
                className:"categoryCell",
                tagName:"DIV",
                innerText:"TABLETS Shop Now "
            }
        )).click();

        //describe the HP Elite x2 tablet
        var hpEliteTablet = browser.$(Web.Element({
                tagName:"LI",
                innerText:"SOLD OUT SHOP NOW HP Elite x2 1011 G1 Tablet $1,279.00 "
            }
        ));

        //verify the element exists
        expect(hpEliteTablet.exists()).toBeTruthy();

        //click on the tablet
        hpEliteTablet.click();

        //describe the price element
        var priceElement = browser.$(Web.Element({
                className:"roboto-thin screen768 ng-binding",
                tagName:"H2"
            }
        ));

        //verify the price is correct
        expect(priceElement.innerText()).toContain("$1,279.00");

        LFT.whenDone(done);

    });

    it("accumulate values test", function (done) {
        //click on the Tablets image
        browser.$(Web.Element({
                className:"categoryCell",
                tagName:"DIV",
                innerText:"TABLETS Shop Now "
            }
        )).click();

        //describe the HP Elite x2 tablet
        var hpEliteTablet = browser.$(Web.Element({
                tagName:"LI",
                innerText:"SOLD OUT SHOP NOW HP Elite x2 1011 G1 Tablet $1,279.00 "
            }
        ));

        //click on the tablet
        hpEliteTablet.click();

        //describe the add to cart button
        var addToCartButton = browser.$(Web.Button({
                buttonType:"submit",
                tagName:"BUTTON",
                name:" ADD TO CART                        "
            }
        ));

        //add the tablet to the cart
        addToCartButton.click();

        //add the tablet to the cart again
        addToCartButton.click();

        //click on the tablets link, to go back to the tablets page
        browser.$(Web.Link({
                tagName:"A",
                innerText:"TABLETS "
            }
        )).click();

        //click on the HP ElitePad G2
        browser.$(Web.Element({
                tagName:"LI",
                innerText:"SOLD OUT SHOP NOW HP ElitePad 1000 G2 Tablet $1,009.00 "
            }
        )).click();

        //add this tablet to the cart also
        addToCartButton.click();

        //click the shopping cart icon to go to the shopping cart
        browser.$(Web.Element({
                accessibilityName:"",
                tagName:"svg",
                innerText:"",
                index:6
            }
        )).click();

        //describe the shopping cart table
        var shoppingCartTable = browser.$(Web.Table({
                role:"",
                accessibilityName:"",
                tagName:"TABLE",
                index:1
            }
        ));

        //accumulate the quantity of the items - should be 3var quantityOfItems =0;

        shoppingCartTable.cells().then(function (shoppingCart) {
            for(var i=1; i&lt;=2; i++) {
                shoppingCart[i][3].text().then(function (quantity) {
                    //quantity is of format: QUANTITY: 1
                    quantityOfItems +=parseInt(quantity.substring(10));
                });
            }
        }).then(function () {
            expect(qunatityOfItems).toEqual(3);
        });

        //another way to accumulate
        shoppingCartTable.cells().then(function (shoppingCart) {
            quantityOfItems =0;
            var lastPromise;
            for(var i=1; i&lt;=2; i++) {
                lastPromise = shoppingCart[i][3].text().then(function (quantity) {
                    quantityOfItems +=parseInt(quantity.substring(10));
                });
            }

            lastPromise.then(function () {
                expect(qunatityOfItems).toEqual(3);
            });
        });

        LFT.whenDone(done);
    });

    it("catch error example", function (done) {
        //click on the Tablets image
        browser.$(Web.Element({
                className:"categoryCell",
                tagName:"DIV",
                innerText:"TABLETS Shop Now "
            }
        )).click();

        //describe wrongly the HP Elite x2 tablet
        var hpEliteTabletWithWrongDescription = browser.$(Web.Element({
                tagName:"WrongTagName",
                innerText:"SOLD OUT SHOP NOW HP Elite x2 1011 G1 Tablet $1,279.00 "
            }
        ));

        //now try to click the HP Elite x2 tablet and an error will occur
        hpEliteTabletWithWrongDescription.click().catch(function (error) {
            expect(error.message).toContain("ReplayObjectNotFound");

            //click the 7.9' HP tablet link
            browser.$(Web.Element({
                    tagName:"LI",
                    innerText:"SOLD OUT SHOP NOW HP Pro Tablet 608 G1 $479.00 "
                }
            )).click();
        });

        //expect to be at the page of the 7.9' tablet (verify by checking existence of element with tablet name)//note: the catch will be called before the following exists, since our PromiseManager awaits completion of//the entire sub tree of a promise before it continues to the next promise.//So no 'then' is required between the catch the exists.
        expect(browser.$(Web.Element({
                className:"roboto-regular screen768 ng-binding",
                tagName:"H1",
                innerText:"HP PRO TABLET 608 G1 "
            }
        )).exists()).toBeTruthy();

        LFT.whenDone(done);
    });


    it("if an error is not caught, it will be passed on to the next promises in the chain until someone catches it", function (done) {
            //click on the Tablets image
            browser.$(Web.Element({
                    className:"categoryCell",
                    tagName:"DIV",
                    innerText:"TABLETS Shop Now "
                }
            )).click();

            //describe wrongly the HP Elite x2 tabletvar hpEliteTabletWithWrongDescription = browser.$(Web.Element({
            tagName:"WrongTagName",
                innerText:"SOLD OUT SHOP NOW HP Elite x2 1011 G1 Tablet $1,279.00 "
        }
    ));

//now try to click the HP Elite x2 tablet and an error will occur
hpEliteTabletWithWrongDescription.click();

//click the 7.9' HP tablet link.
//this click will not be performed, since there is no catch on the previous failed promise.
browser.$(Web.Element({
    tagName:"LI",
    innerText:"SOLD OUT SHOP NOW HP Pro Tablet 608 G1 $479.00 "

)).click().catch(function (error) {
    //this catch will catch the promise chain error, previously not caught.
    expect(error.message).toContain("ReplayObjectNotFound");
});

//expect not to be at the page of the 7.9' tablet (verify by checking existence of element with tablet name)
//since the click on the 7.9' tablet was not performed.
expect(browser.$(Web.Element({
        className:"roboto-regular screen768 ng-binding",
        tagName:"H1",
        innerText:"HP PRO TABLET 608 G1 "
    }
)).exists()).toBeFalsy();

LFT.whenDone(done);
});


describe("promises with execution synchronization disabled test cases", function () {
    var browser;

    beforeAll(function (done) {
        LFT.init({executionSynchronization:false})
            .then(function () {
                return Web.Browser.launch(Web.BrowserType.Chrome)
                    .then(function (b) {
                        browser = b;
                    });
            }).then(done);
    });

    afterAll(function (done) {
        browser.close().then(function () {
            return LFT.cleanup();
        }).then(done);
    });

    beforeEach(function(done) {
        LFT.beforeTest();

        browser.navigate("http://54.175.66.142:8080/#").then(done);
    });

    afterEach(function() {
        LFT.afterTest();
    });


    it("simple promise test without execution synchronization", function (done) {
        //click on the Tablets image
        browser.$(Web.Element({
                className:"categoryCell",
                tagName:"DIV",
                innerText:"TABLETS Shop Now "
            }
        )).click().then(function () {
            //describe the HP Elite x2 tablet
            var hpEliteTablet = browser.$(Web.Element({
                    tagName:"LI",
                    innerText:"SOLD OUT SHOP NOW HP Elite x2 1011 G1 Tablet $1,279.00 "
                }
            ));

            //verify the element exists
            return hpEliteTablet.exists().then(function (exists) {
                expect(exists).toBeTruthy();

                //click on the tablet
                return hpEliteTablet.click().then(function () {
                        //describe the price elementvar priceElement = browser.$(Web.Element({
                        className:"roboto-thin screen768 ng-binding",
                            tagName:"H2"
                    }
                ));

            //verify the price in the opened page matches the price in the previous page
            return priceElement.innerText().then(function (priceText) {
                expect(priceText).toContain("$1,279.00");
            });
        });
    });
}).then(done, done.fail);
});
});