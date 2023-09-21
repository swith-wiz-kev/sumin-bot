const twitterExtract = require("./twitter");
const timeout = 90000;
test(
  "works with 4 images",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704163868510167291",
    );
    expect(data).toStrictEqual([
      "https://pbs.twimg.com/media/F6ZnyKhbEAACc3n?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6Zn4U5a4AAXHJx?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6Zn6C6aAAAOQLG?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6Zn_c8b0AAv56O?format=jpg&name=orig",
    ]);
  },
  timeout,
);

test(
  "works with 3 images",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704183995687465436",
    );
    expect(data).toStrictEqual([
      "https://pbs.twimg.com/media/F6Z6H0LaUAcEJTt?format=png&name=orig",
      "https://pbs.twimg.com/media/F6Z6H0KaUAAPweX?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6Z6SysaUAIAq6a?format=jpg&name=orig",
    ]);
  },
  timeout,
);

test(
  "works with 2 images",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704184366018998746",
    );
    expect(data).toStrictEqual([
      "https://pbs.twimg.com/media/F6Z6hYVaUAE3bU1?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6Z6oYpawAA6Z1j?format=jpg&name=orig",
    ]);
  },
  timeout,
);

test(
  "works with 1 image",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704184489759625662",
    );
    expect(data).toStrictEqual([
      "https://pbs.twimg.com/media/F6Z6wQVacAAbD1H?format=jpg&name=orig",
    ]);
  },
  timeout,
);

test(
  "prioritize format jpg over webp, png stays png",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704192937360511030",
    );
    expect(data).toStrictEqual([
      "https://pbs.twimg.com/media/F6aCcOSaUAEnf18?format=png&name=orig",
      "https://pbs.twimg.com/media/F6aCcOQaUAE2N5I?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6aCcOOaUAACEHW?format=jpg&name=orig",
    ]);
  },
  timeout,
);

test(
  "relinked or retweeted should return blank array",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704184667233243252",
    );
    expect(data).toStrictEqual([]);
  },
  timeout,
);

test(
  "no images return blank array",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704184625474720177",
    );
    expect(data).toStrictEqual([]);
  },
  timeout,
);

test(
  "return images only and exclude videos",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/Xuan_0325_/status/1701381294226039214",
    );
    expect(data).toStrictEqual([
      "https://pbs.twimg.com/media/F5yFQDWWsAA012Y?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F5yFQDWXoAAGHrS?format=jpg&name=orig",
    ]);
  },
  timeout,
);

test(
  "works with small images",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704440064087105770",
    );
    expect(data).toStrictEqual([
      "https://pbs.twimg.com/media/F6diuJ8bYAAEeyL?format=png&name=orig",
      "https://pbs.twimg.com/media/F6diu7xa4AASTFx?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6divg4boAARYAR?format=jpg&name=orig",
      "https://pbs.twimg.com/media/F6djLlgaYAA1MI8?format=png&name=orig",
    ]);
  },
  timeout,
);

test(
  "youtube embeds return blank array",
  async () => {
    const data = await twitterExtract(
      "https://twitter.com/staycphotobox/status/1704440642217373866",
    );
    expect(data).toStrictEqual([]);
  },
  timeout,
);
