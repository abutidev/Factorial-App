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

    test('Verify the data limit handling with a max Boundary Value input', async ({ page }) => {

        await inputElement.fill("171");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("The factorial of 171 is: Infinity");
    });

    test('Verify the data limit handling with a min Boundary Value input', async ({ page }) => {

        await inputElement.fill("0");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("The factorial of 0 is: 1");
    });

    test('Verify leading zeros as an input', async ({ page }) => {

        await inputElement.fill("0000000012");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("The factorial of 0000000012 is: 479001600");
    });

    test('Verify Alphanumeric input validation', async ({ page }) => {

        await inputElement.fill("1b2");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("Please enter an integer");
    });

    test('Verify a Decimal without a remainder input validation', async ({ page }) => {

        await inputElement.fill("1.0");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).not.toBeVisible();
        // await expect(resultsElement).toHaveText("Please enter an integer");
    });

    test('Verify a Decimal with a remainder input validation', async ({ page }) => {

        await inputElement.fill("1.5");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("Please enter an integer");
    });
    test('Verify White space handling', async ({ page }) => {

        await inputElement.fill("1 2");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("Please enter an integer");
    });

    test('Verify Empty/whitespace-only input handling', async ({ page }) => {

        await inputElement.fill("     ");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("Please enter an integer");
    });

    test('Verify  Negative integer handling', async ({ page }) => {

        await inputElement.fill("-12");
        await buttonElement.click();

        // Assert the results
        await expect(resultsElement).not.toBeVisible();
        // await expect(resultsElement).toHaveText("infinity");
    });

    test('Verify the API call with invalid input', async({ page }) => {
        // Intercept the API call
        
        let interceptedRequest;

        await page.route("https://qainterview.pythonanywhere.com/factorial", async (route, request) => {
            interceptedRequest = request;
            await route.continue();
        });

        //Trigger the call
        await inputElement.fill("-12");
        await buttonElement.click();
    

        // Wait for the API call to complete
        const [response] = await Promise.all([
            page.waitForResponse("https://qainterview.pythonanywhere.com/factorial") 
        ]);


        // Assert the API request details
        expect(interceptedRequest.method()).toBe("POST"); 
        const payload = interceptedRequest.postDataJSON();
        expect(payload).toEqual({
            number: "-12"
        }); 

          
        // Assert the response status and body
        expect(response.status()).toBe(500);
        const responseBody = await response.text();
        expect(responseBody).toContain("Internal Server Error" )
    })

    test('Verify the form visual feedback styling for positive integer', async ({ page }) => {
        
        await inputElement.fill("12")
        await buttonElement.click()

        const resultDivColor = await resultsElement.evaluate((el) => {
            return window.getComputedStyle(el).color;
        });
        const borderColor = await inputElement.evaluate(el => {
            const color = window.getComputedStyle(el).borderColor;
            const rgbValues = color.match(/\d+/g); // Extract RGB values as an array of numbers
            return rgbValues ? rgbValues.map(Number) : [];
        });
        
        const [r, g, b] = borderColor; 
        

        // Assert  
        expect(r).not.toBeGreaterThanOrEqual(230); 
        expect(g).not.toBeLessThanOrEqual(50); 
        expect(b).not.toBeLessThanOrEqual(50); 

        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("The factorial of 12 is: 479001600");
        expect(resultDivColor).not.toEqual('rgb(255, 0, 0)');

        
    })

    test('Verify the form visual feedback styling for a Decimal without a remainder', async ({ page }) => {
        
        await inputElement.fill("1.00")
        await buttonElement.click()

        const borderColor = await inputElement.evaluate(el => {
            const color = window.getComputedStyle(el).borderColor;
            const rgbValues = color.match(/\d+/g); // Extract RGB values as an array of numbers
            return rgbValues ? rgbValues.map(Number) : [];
        });
        
        const [r, g, b] = borderColor; 
        

        // Assert  
        expect(r).not.toBeGreaterThanOrEqual(230); 
        expect(g).not.toBeLessThanOrEqual(50); 
        expect(b).not.toBeLessThanOrEqual(50); 
        
    })

    test('Verify the form visual feedback styling for a negative integer', async ({ page }) => {
        
        await inputElement.fill("-12")
        await buttonElement.click()


        const borderColor = await inputElement.evaluate(el => {
            const color = window.getComputedStyle(el).borderColor;
            const rgbValues = color.match(/\d+/g); // Extract RGB values as an array of numbers
            return rgbValues ? rgbValues.map(Number) : [];
        });
        
        const [r, g, b] = borderColor;   

        // Assert  
        expect(r).not.toBeGreaterThanOrEqual(230); 
        expect(g).not.toBeLessThanOrEqual(50); 
        expect(b).not.toBeLessThanOrEqual(50); 
        
    })

    test('Verify handling multiple valid submissions', async ({ page }) => {

        await inputElement.fill("12");
        await buttonElement.click();
        await buttonElement.click();
        await buttonElement.click()
        await buttonElement.click()
        await buttonElement.click()


        // Assert the results
        await expect(resultsElement).toBeVisible();
        await expect(resultsElement).toHaveText("The factorial of 12 is: 479001600");
    });

});