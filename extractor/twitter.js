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

  const imagesLinks = await page.evaluate((url) => {
    const imagesLinks = [];
    const imageRedirectLinks = document.querySelectorAll("a:has(img)");
    imageRedirectLinks.forEach((redirectLink) => {
      if (redirectLink.href.slice(0, -8) === url) {
        const image = redirectLink.querySelector("img");
        const imageLink =
          image.src.slice(0, image.src.indexOf(`&name=`)) + `&name=orig`;
        imagesLinks.push(imageLink);
      }
    });
    return Promise.resolve(imagesLinks);
  }, url);

  imageLinksWebpRemoved = await webpModify(imagesLinks);
  async function webpModify(links) {
    if (imagesLinks.length > 0) {
      const newLinks = await Promise.all(
        imagesLinks.map(async (link) => {
          if (link.includes("webp")) {
            const page = await browser.newPage();

            const urljpg = link.replace("webp", "jpg");
            const [responsejpg] = await Promise.all([
              page.waitForNavigation(),
              page.goto(urljpg),
            ]);
            if (responsejpg.status() == 200) {
              return Promise.resolve(urljpg);
            }

            const page2 = await browser.newPage();
            const urlpng = link.replace("webp", "png");
            const [responsepng] = await Promise.all([
              page2.waitForNavigation(),
              page2.goto(urlpng),
            ]);
            if (responsepng.status() == 200) {
              return Promise.resolve(urlpng);
            } else return Promise.resolve(link);
          } else return Promise.resolve(link);
        }),
      );
      return Promise.resolve(newLinks);
    } else {
      return Promise.resolve(links);
    }
  }

  await browser.close();
  return imageLinksWebpRemoved;
}
module.exports = twitterExtract;
