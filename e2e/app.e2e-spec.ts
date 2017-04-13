import { ExtractPage } from './app.po';

describe('extract App', () => {
  let page: ExtractPage;

  beforeEach(() => {
    page = new ExtractPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
