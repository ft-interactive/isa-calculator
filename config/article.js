export default (environment = 'development') => ({ // eslint-disable-line

  // link file UUID
  id: '',

  // canonical URL of the published page
  //  get filled in by the ./configure script
  url: '',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2016-03-02'),

  headline: 'Calculate the hidden cost of fund fees',

  // summary === standfirst (Summary is what the content API calls it)
  summary: 'Fund managers’ fees can make a huge difference to wealth over the long term. Our calculator helps you work out just how much.',

  topic: {
    name: 'Personal Finance',
    url: 'https://www.ft.com/personal-finance',
  },

  relatedArticle: {
    text: '',
    url: '',
  },

  mainImage: {
    title: '',
    description: '',
    credit: '',

    // You can provide a UUID to an image and it was populate everything else
    uuid: 'e3159bc6-e21c-11e5-9217-6ae3733a2cd1',

    // You can also provide a URL
    // url: 'https://image.webservices.ft.com/v1/images/raw/http%3A%2F%2Fcom.ft.imagepublish.prod.s3.amazonaws.com%2Fc4bf0be4-7c15-11e4-a7b8-00144feabdc0?source=ig&fit=scale-down&width=700',
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
 byline: [
    { name: 'Naomi Rovnick', url: 'https://www.ft.com/stream/authorsId/Q0ItMDMzNDMwNg==-QXV0aG9ycw==' },
    { name: 'Bob Haslett', url: 'https://www.ft.com/stream/authorsId/Q0ItQkg1NDMyMQ==-QXV0aG9ycw==' },
    { name: 'Gavin Jackson', url: 'https://www.ft.com/stream/authorsId/Q0ItMDQ0MTYwMw==-QXV0aG9ycw=='},
    { name: 'Martin Stabe', url: 'https://www.ft.com/stream/authorsId/Q0ItTVM1NDMyMQ==-QXV0aG9ycw==' },
  ],


  // Appears in the HTML <title>
  title: 'Calculate the hidden cost of fund fees',

  // meta data
  description: 'Calculate the hidden cost of fund fees',

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
   socialImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3Ae3159bc6-e21c-11e5-9217-6ae3733a2cd1?source=ig',
 socialHeadline: 'Calculate the hidden cost of fund fees',
 socialSummary:  'Over the long term, managers’ fees can make a huge difference to savers’ wealth. Our calculator shows how.',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  // tweetText: '',
  //
  // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)
  // twitterRelatedAccounts: ['authors_account_here', 'ftdata'],

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  // twitterImage: '',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
