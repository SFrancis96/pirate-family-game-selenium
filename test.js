const { Builder, Capabilities, By, until } = require('selenium-webdriver');
const { get } = require('selenium-webdriver/http');

let browserName = new Builder()
    .withCapabilities(Capabilities.firefox())
    .build();

async function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function getOnAddressBrowser(address) {
    return new Promise(resolve => resolve(browserName.get(address)));

}

async function getTitleOnPage(address, title) {
    if (address) {
        await getOnAddressBrowser(address)
    }
    await wait(1);
    let h1Element = await browserName.findElement({ tagName: 'h1' });
    let h1Text = await h1Element.getText();
    return new Promise((resolve) => {
        console.log(h1Text);
        if (h1Text === title) {
            resolve(console.log('✅ Test passed'));
        } else {
            resolve(console.log('💥 Test failed'));
        }
    })
}

async function getOnMainCharacterCreationPage() {
    await browserName.get('http://127.0.0.1:5000/');
    await wait(1);

    let buttonElement = await browserName.findElement(By.id('start-button'));
    await buttonElement.click();

    await wait(1);

    await getTitleOnPage(null, 'Create your main character')
}

async function createMainCharacterForm() {
    await wait(1);

    let nameInput = await browserName.findElement(By.name('name'));
    await nameInput.sendKeys('John Doe');

    let emailInput = await browserName.findElement(By.name('email'));
    await emailInput.sendKeys('johndoe@example.com');

    let submitButton = await browserName.findElement(By.css('input[type="submit"]'));
    await submitButton.click();
    await wait(1);
    await getTitleOnPage(null, 'Choose Your Character');
}

async function getCharacterName() {
    await wait(1);
    let chooseCharacter = await browserName.findElement(By.id('character-1'));
    chooseCharacter.click();

    await wait(1);
    await getTitleOnPage(null, 'Vous jouez avec Victor !')
}


async function test() {
    try {
        await getTitleOnPage('http://127.0.0.1:5000/', 'The Pirate Family Game')
        await getOnMainCharacterCreationPage();
        await createMainCharacterForm();
        await getCharacterName();
    } finally {
        await browserName.quit();
    }
}

test()