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
        await page.goto(subCat[0]);
        console.log('Opened the page');
        const cards = await page.$eval('.card.mb-4.shadow-sm', allCards => {
            let audio = allCards.querySelector('.embed-responsive.float-left').querySelector('source').src;
            // Replace spaces between words
            let arabic = allCards.querySelector('div.col-12.text-right.font-arabic.mt-2.mb-4.h2.showArabic.clearfix').innerText.replace(/\s+/g, '')
            let ayaatText = allCards.querySelector('span.float-left.badge-success.rounded.px-3.py-1').innerText;
            let ayaatNumber = allCards.querySelector('span.badge.badge-pill.badge-info.ml-2.font-kalpurush-reading').innerText;
            

            return {
                audio,
                arabic,
                ayaatText,
                ayaatNumber
            }
        });      
        console.log(JSON.stringify(cards, null, 2));  
        console.log(cards.arabic);    
        
        await browser.close();
}

main();