import { chromium } from 'playwright';
// import fs
import fs from 'fs';
// import subCat json
import subCat from './subCat.json' assert { type: 'json' };


let main = async function Main () {
        const launchOptions = {
            headless: false
        };
        const browser = await chromium.launch(launchOptions);
        const context = await browser.newContext();
        const page = await context.newPage();
        // await page.goto(subCat[0]);
        // console.log('Opened the page');
        // const cards = await page.$eval('.card.mb-4.shadow-sm', allCards => {
        //     let audio = allCards.querySelector('.embed-responsive.float-left').querySelector('source').src;
        //     // Replace spaces between words
        //     let arabic = allCards.querySelector('div.col-12.text-right.font-arabic.mt-2.mb-4.h2.showArabic.clearfix').innerText.replace(/\s+/g, '')
        //     let ayaatText = allCards.querySelector('span.float-left.badge-success.rounded.px-3.py-1').innerText;
        //     let ayaatNumber = allCards.querySelector('span.badge.badge-pill.badge-info.ml-2.font-kalpurush-reading').innerText;
            

        //     return {
        //         audio,
        //         arabic,
        //         ayaatText,
        //         ayaatNumber
        //     }
        // });      
        // console.log(JSON.stringify(cards, null, 2));  
        // console.log(cards.arabic);    

        for (const url of subCat) {
            await page.goto(url);
            let nextNavExist = await page.$('.nav_button.nav_next');
            
            while (nextNavExist !== null) {
                const cards = await page.$$eval('.card.mb-4.shadow-sm', allCards => {
                    let cardData = [];
                    allCards.forEach(card => {
                        let audio = card.querySelector('.embed-responsive.float-left').querySelector('source').src;
                        // Replace spaces between words
                        let arabic = card.querySelector('div.col-12.text-right.font-arabic.mt-2.mb-4.h2.showArabic.clearfix').innerText.replace(/\s+/g, '')
                        let ayaatText = card.querySelector('span.float-left.badge-success.rounded.px-3.py-1').innerText;
                        let ayaatNumber = card.querySelector('span.badge.badge-pill.badge-info.ml-2.font-kalpurush-reading').innerText;
                        cardData.push({
                            audio,
                            arabic,
                            ayaatText,
                            ayaatNumber
                        });
                    });
                    return cardData;
                });
                console.log(JSON.stringify(cards, null, 2));  
                console.log(cards.arabic);  
                // Write data to a file
                fs.writeFile(`${}-page.json`, JSON.stringify(cards, null, 2), (err) => {
                    if (err) throw err;
                    console.log('Data has been written to a file');
                });
                // Click next button and wait for the page to load
                await page.click('.nav_button.nav_next');
                await page.waitForURL(/.*pageNum_tafsirquran.*/);
                nextNavExist = await page.$('.nav_button.nav_next');
            }
            
        }
        
        await browser.close();
}

main();