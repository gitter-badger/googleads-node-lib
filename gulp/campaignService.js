var
  _ = require('lodash'),
  async = require('async'),
  gulp = require('gulp'),
  pd = require('pretty-data').pd,
  soap = require('soap'),
  uuid = require('uuid');

gulp.task(
  'adWords:campaignService:get',
  'gets Google AdWords campaign',
  function(cb) {
    var argv = require('yargs')
      .default(
        'clientCustomerId',
        process.env.ADWORDS_CLIENT_CUSTOMER_ID,
        'clientCustomerId of account'
      )
      .default('validateOnly', false, 'validate only')
      .argv;

    var AdWords = require('..');

    var service = new AdWords.CampaignService({
      validateOnly: argv.validateOnly
    });

    var selector = new AdWords.Selector.model({
      fields: service.selectable,
      ordering: [{field: 'Name', sortOrder: 'ASCENDING'}],
      paging: {startIndex: 0, numberResults: 100},
    });

    service.get(argv.clientCustomerId, selector, function(err, results) {
      if (err) console.log(err);
      else console.log(JSON.stringify(results, null, 2));
      cb(err);
    });
  }
);

gulp.task(
  'adWords:campaignService:mutateAdd',
  'adds Google AdWords campaign',
  function(cb) {
    var argv = require('yargs')
      .boolean('validateOnly')
      .default(
        'clientCustomerId',
        process.env.ADWORDS_CLIENT_CUSTOMER_ID,
        'clientCustomerId of account'
      )
      .default('validateOnly', false, 'validate only')
      .demand('name', 'name of the budget')
      .demand('budgetId', 'budgetId to use')
      .argv;

    var AdWords = require('..');

    var service = new AdWords.CampaignService({
      validateOnly: argv.validateOnly
    });

    // This will only work on my account...
    var operand = new service.Model({
      name: argv.name,
      budget: {budgetId: argv.budgetId},
      advertisingChannelType: 'SEARCH',

      biddingStrategyConfiguration: {
        biddingStrategyName: 'CD-BIDDING_STRATEGY-' + uuid.v4(),
        biddingStrategyType: 'MANUAL_CPC'
      }
    });

    service.mutateAdd(
      argv.clientCustomerId,
      operand,
      function(err, results) {
        if (err) console.log(err);
        else console.log(JSON.stringify(results, null, 2));
        cb(err);
      }
    );
  }
);

gulp.task(
  'adWords:campaignService:query',
  'queries Google AdWords campaigns',
  function(cb) {
    var argv = require('yargs')
      .default(
        'clientCustomerId',
        process.env.ADWORDS_CLIENT_CUSTOMER_ID,
        'clientCustomerId of account'
      )
      .default('validateOnly', false, 'validate only')
      .argv;

    var AdWords = require('..');

    var service = new AdWords.CampaignService({
      validateOnly: argv.validateOnly
    });

    var query = 'SELECT Id, Name, Status ORDER BY Name';

    service.query(argv.clientCustomerId, query, function(err, results) {
      if (err) console.log(err);
      else console.log(JSON.stringify(results, null, 2));
      cb(err);
    });
  }
);
