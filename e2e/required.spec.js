const { test, expect } = require('@playwright/test');

test.describe('Required Factorial App tests', () => {

    let inputElement;
    let buttonElement;
    let resultsElement;

    test.beforeEach(async ({ page }) => {
        // Visit the page
        await page.goto("https://qainterview.pythonanywhere.com/");

        // Save the input element
        inputElement = await page.locator("input[name='number']");
        await expect(inputElement).toBeVisible();

        // Save the button element
        buttonElement = await page.locator("button", { hasText: "Calculate" });
        await expect(buttonElement).toBeVisible();

        // Save the results element
        resultsElement = await page.locator("#resultDiv");
        
    });


    test('Verify the API call being made along with the headers and parameters sent', async({ page }) => {
        // Intercept the API call
        
        let interceptedRequest;

        await page.route("https://qainterview.pythonanywhere.com/factorial", async (route, request) => {
            interceptedRequest = request;
            await route.continue();
        });

        //Trigger the call
        await inputElement.fill("12");
        await buttonElement.click();
    

        // Wait for the API call to complete
        const [response] = await Promise.all([
            page.waitForResponse("https://qainterview.pythonanywhere.com/factorial") 
        ]);


        // Assert the API request details
        expect(interceptedRequest.method()).toBe("POST"); 
        const payload = interceptedRequest.postDataJSON();
        expect(payload).toEqual({
            number: "12"
        }); 

          
        // Assert the response status and body
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toEqual({ "answer":479001600 })
    })

    test('Verify the console message being printed', async({ page }) => {
        
        let successMessage;

        // Listen for console messages
        page.on("console", (msg) => { 
            if (msg.text().includes("the ajax call")){
                successMessage = msg.text();
            }
        });

        await inputElement.fill("12");
        await buttonElement.click();
        await page.waitForTimeout(500)

        // Assert that the expected console message was logged
        expect(successMessage).toBe("Hello! I am in the done part of the ajax call");

    })


    test('Verify the red form validation styling', async ({ page }) => {
        
        await inputElement.fill("1  0 ")
        await buttonElement.click()

        const resultDivColor = await resultsElement.evaluate((el) => {
            return window.getComputedStyle(el).color;
        });
        const borderColor = await inputElement.evaluate(el => {
            const color = window.getComputedStyle(el).borderColor;
            const rgbValues = color.match(/\d+/g); // Extract RGB values as an array of numbers
            return rgbValues ? rgbValues.map(Number) : [];
        });
        
        const [r, g, b] = borderColor; // r = red, g = green, b = blue
        

        // Assert  
        expect(r).toBeGreaterThanOrEqual(230); // Red must be at least 230
        expect(g).toBeLessThanOrEqual(50); // Green should be low
        expect(b).toBeLessThanOrEqual(50); // Blue should be low

        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("Please enter an integer");
        expect(resultDivColor).toEqual('rgb(255, 0, 0)');

        
    })

    test('Verify the functionality of the calculator with 12 as input', async ({ page }) => {

        await inputElement.fill("12");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("The factorial of 12 is: 479001600");
    });
});

