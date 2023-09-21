const puppeteer = require("puppeteer");

async function twitterExtract(url) {
  const browser = await puppeteer.launch({
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.goto(url, {
    waitUntil: "networkidle2",
  });

  const imagesLinks = await page.evaluate((param) => {
    const links = [];
    const imageRedirectLinks = document.querySelectorAll("a:has(img)");
    imageRedirectLinks.forEach((redirectLink) => {
      if (redirectLink.href.slice(0, -8) === param) {
        const image = redirectLink.querySelector("img");
        const imageLink =
          `${image.src.slice(0, image.src.indexOf(`&name=`))}&name=orig`;
        links.push(imageLink);
      }
    });
    return Promise.resolve(links);
  }, url);

  
  async function webpModify(links) {
    if (imagesLinks.length > 0) {
      const newLinks = await Promise.all(
        imagesLinks.map(async (link) => {
          if (link.includes("webp")) {
            const pageJPG = await browser.newPage();

            const urljpg = link.replace("webp", "jpg");
            const [responsejpg] = await Promise.all([
              pageJPG.waitForNavigation(),
              pageJPG.goto(urljpg),
            ]);
            if (responsejpg.status() === 200) {
              return Promise.resolve(urljpg);
            }

            const pagePNG = await browser.newPage();
            const urlpng = link.replace("webp", "png");
            const [responsepng] = await Promise.all([
              pagePNG.waitForNavigation(),
              pagePNG.goto(urlpng),
            ]);
            if (responsepng.status() === 200) {
              return Promise.resolve(urlpng);
            } 
            return Promise.resolve(link);
          }  return Promise.resolve(link);
        }),
      );
      return Promise.resolve(newLinks);
    } 
      return Promise.resolve(links);
    
  }
  const imageLinksWebpRemoved = await webpModify(imagesLinks);
  await browser.close();
  return imageLinksWebpRemoved;
}
module.exports = twitterExtract;
