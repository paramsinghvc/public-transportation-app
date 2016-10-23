import { PublicTransportationAppPage } from './app.po';

describe('public-transportation-app App', function() {
  let page: PublicTransportationAppPage;

  beforeEach(() => {
    page = new PublicTransportationAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
